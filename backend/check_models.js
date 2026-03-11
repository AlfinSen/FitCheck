const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    console.log("Checking Gemini Models with API Key...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTest = [
        "gemini-1.5-flash",
        "gemini-1.5-flash-001",
        "gemini-1.5-flash-latest",
        "gemini-2.0-flash",
        "gemini-pro",
        "gemini-1.0-pro"
    ];

    for (const modelName of modelsToTest) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello, are you there?");
            console.log(`✅ SUCCESS: ${modelName} works!`);
            console.log("Response:", result.response.text().slice(0, 50) + "...");
        } catch (error) {
            console.log(`❌ FAILED: ${modelName}`);
            if (error.message.includes("404")) {
                console.log("Reason: 404 Not Found (Invalid model name or not supported in this API version)");
            } else {
                console.log("Reason:", error.message.split('\n')[0]);
            }
        }
    }
}

listModels();
