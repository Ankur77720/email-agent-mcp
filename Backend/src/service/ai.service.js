import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";
import mcpClient from "../../mcp/client.mcp.js"

const ai = new GoogleGenAI({ apiKey: config.GOOGLE_GEMINI_API_KEY });

const tools = (await mcpClient.listTools()).tools

function getSystemInstruction(user) {
    return `
    <persona>

    your an helpful assistant that can help the user with their tasks.
    you have access to a set of tools that can help you with your tasks.
    
    </persona>

    <important>
    you are not allowed to use any other tools or APIs other than the ones provided to you.

    currently you are acting on behalf of ${user.name} with the email ${user.email} and userId ${user._id}.
    
    </important>
    
    `
}


async function getResponse(messages, user) {

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: messages,
        config: {
            systemInstruction: getSystemInstruction(user),
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



    const functionCall = response.functionCalls && response.functionCalls[ 0 ]

    if (functionCall) {

        const toolResult = await mcpClient.callTool({
            name: functionCall.name,
            arguments: functionCall.args
        })

        const result = toolResult.content[ 0 ].text

        return result

    }


    const text = response.text

    return text
}


export default getResponse