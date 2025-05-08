// batch_operations.ts - Implements batch operations for improved performance
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

// Define the BatchCreateElementParams interface
export interface BatchCreateElementsParams {
  elements: Array<{
    type: "rectangle" | "frame" | "text";
    x: number;
    y: number;
    width?: number;
    height?: number;
    text?: string;
    name?: string;
    parentId?: string;
    styles?: {
      fillColor?: { r: number; g: number; b: number; a?: number };
      strokeColor?: { r: number; g: number; b: number; a?: number };
      strokeWeight?: number;
      cornerRadius?: number;
      fontSize?: number;
      fontWeight?: number;
    };
  }>;
}

// Define the BundledCommandsParams interface
export interface BundledCommandsParams {
  commands: Array<{
    command: string;
    params: any;
    priority?: "high" | "normal" | "low";
  }>;
  stopOnError?: boolean;
}

// Function to register batch operation tools with the server
export function registerBatchOperations(server: McpServer, sendCommandToFigma: Function) {
  // Batch Create Elements Tool
  server.tool(
    "batch_create_elements",
    "Create multiple elements in one operation for improved performance",
    {
      elements: z
        .array(
          z.object({
            type: z.enum(["rectangle", "frame", "text"]).describe("Type of element to create"),
            x: z.number().describe("X position"),
            y: z.number().describe("Y position"),
            width: z.number().optional().describe("Width of the element"),
            height: z.number().optional().describe("Height of the element"),
            text: z.string().optional().describe("Text content for text elements"),
            name: z.string().optional().describe("Optional name for the element"),
            parentId: z.string().optional().describe("Optional parent node ID"),
            styles: z.object({
              fillColor: z.object({
                r: z.number().min(0).max(1),
                g: z.number().min(0).max(1),
                b: z.number().min(0).max(1),
                a: z.number().min(0).max(1).optional(),
              }).optional().describe("Fill color in RGBA format"),
              strokeColor: z.object({
                r: z.number().min(0).max(1),
                g: z.number().min(0).max(1),
                b: z.number().min(0).max(1),
                a: z.number().min(0).max(1).optional(),
              }).optional().describe("Stroke color in RGBA format"),
              strokeWeight: z.number().positive().optional().describe("Stroke weight"),
              cornerRadius: z.number().min(0).optional().describe("Corner radius"),
              fontSize: z.number().positive().optional().describe("Font size"),
              fontWeight: z.number().optional().describe("Font weight"),
            }).optional().describe("Styling options for the element"),
          })
        )
        .describe("Array of elements to create"),
    },
    async ({ elements }) => {
      try {
        if (!elements || elements.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No elements provided to create",
              },
            ],
          };
        }

        // Send command to Figma
        const result = await sendCommandToFigma("batch_create_elements", { elements });

        // Structure the response
        interface BatchCreateResult {
          success: boolean;
          message: string;
          createdCount: number;
          failedCount: number;
          results: Array<{
            success: boolean;
            nodeId?: string;
            type?: string;
            error?: string;
          }>;
        }

        const typedResult = result as BatchCreateResult;

        // Format a nice response
        const successCount = typedResult.createdCount || 0;
        const failCount = typedResult.failedCount || 0;
        const totalCount = elements.length;
        
        const summaryText = `
        Batch element creation complete:
        - ${successCount} of ${totalCount} elements created successfully
        - ${failCount} elements failed to create
        `;

        // Include details of created elements
        const detailsText = typedResult.results 
          ? `\n\nCreated Elements:\n${typedResult.results
              .filter(r => r.success)
              .map(r => `- ${r.type} (${r.nodeId})`)
              .join('\n')}`
          : '';

        // Include failure details if any
        const failuresText = typedResult.results && failCount > 0
          ? `\n\nFailed Elements:\n${typedResult.results
              .filter(r => !r.success)
              .map(r => `- ${r.type || 'Unknown'}: ${r.error || 'Unknown error'}`)
              .join('\n')}`
          : '';

        // Return the response
        return {
          content: [
            {
              type: "text",
              text: summaryText + detailsText + failuresText,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating elements in batch: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );

  // Execute Bundled Commands Tool
  server.tool(
    "execute_bundled_commands",
    "Execute multiple Figma commands in a single batch for improved performance",
    {
      commands: z
        .array(
          z.object({
            command: z.string().describe("The Figma command to execute"),
            params: z.any().describe("Parameters for the command"),
            priority: z.enum(["high", "normal", "low"]).optional().describe("Command priority"),
          })
        )
        .describe("Array of commands to execute"),
      stopOnError: z.boolean().optional().describe("Whether to stop execution on first error"),
    },
    async ({ commands, stopOnError = false }) => {
      try {
        if (!commands || commands.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: "No commands provided to execute",
              },
            ],
          };
        }

        // Send command to Figma
        const result = await sendCommandToFigma("execute_bundled_commands", { commands, stopOnError });

        // Structure the response
        interface BundledCommandsResult {
          success: boolean;
          message: string;
          completedCount: number;
          failedCount: number;
          results: Array<{
            command: string;
            success: boolean;
            result?: any;
            error?: string;
          }>;
        }

        const typedResult = result as BundledCommandsResult;

        // Format a nice response
        const successCount = typedResult.completedCount || 0;
        const failCount = typedResult.failedCount || 0;
        const totalCount = commands.length;
        
        const summaryText = `
        Bundled commands execution complete:
        - ${successCount} of ${totalCount} commands executed successfully
        - ${failCount} commands failed
        `;

        // Include details of successful commands
        const successesText = typedResult.results 
          ? `\n\nSuccessful Commands:\n${typedResult.results
              .filter(r => r.success)
              .map(r => `- ${r.command}`)
              .join('\n')}`
          : '';

        // Include failure details if any
        const failuresText = typedResult.results && failCount > 0
          ? `\n\nFailed Commands:\n${typedResult.results
              .filter(r => !r.success)
              .map(r => `- ${r.command}: ${r.error || 'Unknown error'}`)
              .join('\n')}`
          : '';

        // Return the response
        return {
          content: [
            {
              type: "text",
              text: summaryText + successesText + failuresText,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error executing bundled commands: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    }
  );
} 