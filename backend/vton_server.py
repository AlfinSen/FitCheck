import os
import io
import base64
import json
import uuid
import traceback
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
from gradio_client import Client, handle_file
from huggingface_hub import login
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ready", "model": MODEL_ID})

# Configuration from .env
MODEL_ID = os.getenv('VTON_MODEL_ID', 'yisol/IDM-VTON')
HF_TOKEN = os.getenv('HF_TOKEN')
PYTHON_PORT = int(os.getenv('PYTHON_PORT', 5001))
TEMP_DIR = "temp_vton"
PUBLIC_DIR = "public"

# Create directories if they don't exist
if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)
if not os.path.exists("uploads"):
    os.makedirs("uploads")

# Initialize Gradio Client with Retries & Auth
vton_client = None
max_retries = 5

if HF_TOKEN:
    print("HF_TOKEN found, attempting to login to Hugging Face...")
    try:
        login(token=HF_TOKEN)
        print("Logged into Hugging Face.")
    except Exception as login_e:
        print(f"HF Login failed: {login_e}")
else:
    print("WARNING: HF_TOKEN not found in environment.")

for attempt in range(max_retries):
    try:
        print(f"Initializing {MODEL_ID} client (Attempt {attempt + 1}/{max_retries})...")
        vton_client = Client(MODEL_ID, hf_token=HF_TOKEN)
        print("Client ready.")
        break
    except Exception as e:
        print(f"Attempt {attempt + 1} failed: {e}")
        if attempt == max_retries - 1:
            print(f"CRITICAL: Failed to initialize ML model after {max_retries} attempts.")

def resize_for_vton(image_path, target_width=768, target_height=1024):
    """
    Resizes and pads the image to a specific aspect ratio (3:4) without distortion.
    IDM-VTON performs best at 768x1024.
    """
    try:
        with Image.open(image_path) as img:
            # Convert to RGB if necessary (e.g. for PNGs with alpha)
            if img.mode != "RGB":
                img = img.convert("RGB")
            
            # Calculate aspect ratio
            img_w, img_h = img.size
            target_ratio = target_width / target_height
            img_ratio = img_w / img_h

            if img_ratio > target_ratio:
                # Image is relatively wider than target
                new_w = target_width
                new_h = int(target_width / img_ratio)
            else:
                # Image is relatively taller than target
                new_h = target_height
                new_w = int(target_height * img_ratio)

            # Resize without stretching
            img = img.resize((new_w, new_h), Image.LANCZOS)

            # Create new canvas and paste centered
            new_img = Image.new("RGB", (target_width, target_height), (255, 255, 255))
            paste_x = (target_width - new_w) // 2
            paste_y = (target_height - new_h) // 2
            new_img.paste(img, (paste_x, paste_y))
            
            new_img.save(image_path, "JPEG", quality=95)
        return image_path
    except Exception as e:
        print(f"Resize error: {e}")
        return image_path

# --- ROUTES ---

@app.route('/api/tryon', methods=['POST'])
def handle_tryon():
    global vton_client
    
    # Try to re-initialize if not ready
    if vton_client is None:
        print("Model client not ready. Attempting re-initialization...")
        try:
            vton_client = Client(MODEL_ID, hf_token=HF_TOKEN)
        except Exception as re_e:
            return jsonify({"error": f"Inference server not ready: {re_e}"}), 503

    try:
        # 1. Handle Multipart Form Data
        if 'userImage' not in request.files or 'garmentImage' not in request.files:
            return jsonify({"error": "Missing person or garment image"}), 400

        user_file = request.files['userImage']
        garment_file = request.files['garmentImage']

        # Use a unique ID for this request
        task_id = str(uuid.uuid4())
        
        person_path = os.path.join(TEMP_DIR, f"{task_id}_person.png")
        garment_path = os.path.join(TEMP_DIR, f"{task_id}_garment.png")
        
        user_file.save(person_path)
        garment_file.save(garment_path)
        print(f"[{task_id}] Images saved.")

        # 5. Pre-process (Resize)
        resize_for_vton(person_path)
        resize_for_vton(garment_path)
        print(f"[{task_id}] Images resized.")
        
        # 6. Call IDM-VTON
        print(f"[{task_id}] Calling ML model...")
        result = None
        
        # Structure for yisol/IDM-VTON
        # The first parameter is usually a dict for the 'Editor' component
        # { "background": file, "layers": [], "composite": None }
        
        # Verified structure for yisol/IDM-VTON with inference retries
        inference_max_retries = 3
        for inf_attempt in range(inference_max_retries):
            try:
                print(f"[{task_id}] Calling Model API (/tryon) - Attempt {inf_attempt + 1}/{inference_max_retries}...")
                result = vton_client.predict(
                    dict={"background": handle_file(person_path), "layers": [], "composite": None},
                    garm_img=handle_file(garment_path),
                    garment_des="A custom garment",
                    is_checked=True,
                    is_checked_crop=False,
                    denoise_steps=40,
                    seed=42,
                    api_name="/tryon"
                )
                
                if result:
                    print(f"[{task_id}] Inference success.")
                    # The model returns (output_image, masked_image)
                    output_path = result[0] if isinstance(result, (list, tuple)) else result
                    break
                else:
                    if inf_attempt == inference_max_retries - 1:
                        return jsonify({"error": "Model returned empty result"}), 500
                    
            except Exception as e:
                print(f"[{task_id}] Inference Attempt {inf_attempt + 1} failed: {str(e)}")
                if "timeout" in str(e).lower() or "handshake" in str(e).lower():
                    if inf_attempt < inference_max_retries - 1:
                        print(f"[{task_id}] Retrying due to timeout...")
                        continue
                return jsonify({"error": f"Model inference failed after {inf_attempt + 1} attempts: {str(e)}"}), 500

        # 7. Encode Result
        # The result is already extracted to output_path inside the loop above
        # but let's ensure it's correct here as a final safety check
        if isinstance(result, (list, tuple)):
            output_path = result[0]
        else:
            output_path = result

        print(f"[{task_id}] Result path: {output_path}")
        
        if not os.path.exists(output_path):
             return jsonify({"error": "Result image file not found"}), 500

        with open(output_path, "rb") as image_file:
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')

        return jsonify({"resultImage": encoded_string})

    except Exception as e:
        print(f"[{task_id if 'task_id' in locals() else 'System'}] Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

    finally:
        # Cleanup temporary files regardless of success or failure
        if 'person_path' in locals() and os.path.exists(person_path):
            try: os.remove(person_path)
            except: pass
        if 'garment_path' in locals() and os.path.exists(garment_path):
            try: os.remove(garment_path)
            except: pass

if __name__ == '__main__':
    print(f"Starting Python Unified Backend on port {PYTHON_PORT}...")
    app.run(host='0.0.0.0', port=PYTHON_PORT, debug=True)
