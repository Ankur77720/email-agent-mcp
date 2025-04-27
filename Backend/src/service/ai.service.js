import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_GEMINI_API_KEY });

async function getResponse(prompt) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
    })

    const text = response.text

    return text
}


export default getResponse