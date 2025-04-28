import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { sendEmail } from "../src/service/google.service.js";
import mongoose from "mongoose";
import config from "../src/config/config.js";
import { z } from "zod";
import fs from "fs";

mongoose.connect(config.MONGODB_URI)


const server = new McpServer({
    name: "example-server",
    version: "1.0.0"
});

server.tool(
    "addTwoNumbers",
    "add two numbers",
    {
        a: z.number(),
        b: z.number()
    },
    async ({ a, b }) => {
        const result = a + b;

        return {
            content: [ {
                type: "text",
                text: `The sum of ${a} and ${b} is ${result}`
            } ]
        }

    }
)

server.tool(
    "sendEmail",
    "send an email",
    {
        userId: z.string(),
        to: z.string(),
        subject: z.string(),
        message: z.string()
    },
    async ({ userId, to, subject, message }) => {
        try {

            const result = await sendEmail(userId, to, subject, message);

            return {
                content: [ {
                    type: "text",
                    text: `Email sent to ${to} with subject "${subject}"`
                } ]
            }
        } catch (error) {
            console.error("Error sending email:", error);

            fs.appendFileSync("./mcp.error.json", JSON.stringify({
                userId,
                to,
                subject,
                message,
                error: error.message,
            }));


            return {
                content: [ {
                    type: "text",
                    text: `Failed to send email to ${to} with subject "${subject}"`
                } ]
            }
        }

    }
)

// ... set up server resources, tools, and prompts ...

const transport = new StdioServerTransport();
await server.connect(transport);