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
            Identify the bounding box for the torso area where a top (shirt/jacket) would be worn.
            CRITICAL: The box must start BELOW the chin/neck. Do NOT include the face or head.
            The box should cover the shoulders down to the waist/hips.
            Return ONLY a JSON object with the following properties (values as percentages 0-100):
            {
                "top": number,
                "left": number,
                "width": number,
                "height": number
            }
            Do not include markdown formatting or explanations. Just the JSON string.
        `;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: userBase64, mimeType: "image/png" } }
        ]);

        const response = await result.response;
        let text = response.text();
        console.log("Gemini Analysis:", text);

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Error analyzing image:", error);
        // Fallback to default center position if AI fails
        return { top: 25, left: 25, width: 50, height: 50 };
    }
}

module.exports = { analyzeImageForTryOn };
