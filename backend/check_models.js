const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct listModels on the instance in some versions, 
        // but let's try a simple generation to see if the model name works.
        const result = await model.generateContent("Test");
        console.log("Model gemini-1.5-flash works!");
        console.log(result.response.text());
    } catch (error) {
        console.error("Error with gemini-1.5-flash:", error.message);

        try {
            const model2 = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result2 = await model2.generateContent("Test");
            console.log("Model gemini-pro works!");
        } catch (err2) {
            console.error("Error with gemini-pro:", err2.message);
        }
    }
}

listModels();
