const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeImageForTryOn(userBase64) {
    console.log('Analyzing image with Gemini 2.0 Flash...');
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            Analyze this image of a person. 
            Identify the bounding box for the TORSO area where a top (shirt/jacket) would be worn.
            
            CRITICAL GUIDELINES:
            1. The top of the box must be at the SHOULDER line, strictly BELOW the chin.
            2. The bottom of the box should be at the HIPS/WAIST.
            3. Do NOT include the head or face.
            4. The width should cover the shoulders fully.

            Return ONLY a JSON object with the following properties (values as percentages 0-100 of the original image dimensions):
            {
                "top": number,   // Distance from top edge to shoulder line
                "left": number,  // Distance from left edge to left shoulder
                "width": number, // Width from shoulder to shoulder
                "height": number // Height from shoulder to waist
            }
            Do not include markdown formatting or explanations. Just the JSON string.
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: userBase64, mimeType: "image/png" } }
        ]);

        const response = await result.response;
        let text = response.text();
        console.log("Gemini Analysis Raw:", text);

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const json = JSON.parse(text);
        console.log("Parsed Coordinates:", json);
        return json;
    } catch (error) {
        console.error("Error analyzing image:", error);
        // Fallback to default torso position if AI fails (e.g. Rate Limit)
        // Adjusted to be lower to avoid covering the face
        return { top: 40, left: 20, width: 60, height: 50 };
    }
}

module.exports = { analyzeImageForTryOn };
