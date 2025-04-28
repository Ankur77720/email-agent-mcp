import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

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

// ... set up server resources, tools, and prompts ...

const transport = new StdioServerTransport();
await server.connect(transport);