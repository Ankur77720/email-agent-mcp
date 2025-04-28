import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";
import mcpClient from "../../mcp/client.mcp.js"

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_GEMINI_API_KEY });

const tools = (await mcpClient.listTools()).tools


async function getResponse(messages) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: messages,
        config: {
            tools: [ {
                functionDeclarations: tools.map(tool => {
                    return {
                        name: tool.name,
                        description: tool.description,
                        parameters: {
                            type: tool.inputSchema.type,
                            properties: tool.inputSchema.properties,
                            required: tool.inputSchema.required,
                        }
                    }
                })
            } ]
        }
    })



    const functionCall = response.functionCalls[ 0 ]

    if (functionCall) {

        const toolResult = await mcpClient.callTool({
            name: functionCall.name,
            arguments: functionCall.args
        })

        console.log("Tool result", toolResult)

        const result = toolResult.content[ 0 ].text

        return result

    }


    const text = response.text

    return text
}


export default getResponse