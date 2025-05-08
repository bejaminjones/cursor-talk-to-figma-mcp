// Simple test script for batch operations
console.log(`
==============================================
BATCH OPERATIONS TEST INSTRUCTIONS
==============================================

1. Make sure the Figma plugin is running and connected
2. Ensure you have a Figma document open
3. Use the following MCP commands in Claude or similar client:

A. BATCH CREATE ELEMENTS:
------------------------
mcp_TalkToFigma_join_channel({
  channel: "test-channel"
})

mcp_TalkToFigma_batch_create_elements({
  elements: [
    {
      type: "rectangle",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      name: "Batch Rectangle 1",
      styles: {
        fillColor: { r: 1, g: 0, b: 0, a: 1 },
        cornerRadius: 8
      }
    },
    {
      type: "rectangle",
      x: 100,
      y: 220,
      width: 200,
      height: 100,
      name: "Batch Rectangle 2",
      styles: {
        fillColor: { r: 0, g: 1, b: 0, a: 1 },
        cornerRadius: 8
      }
    },
    {
      type: "text",
      x: 150,
      y: 350,
      text: "Batch Created Elements",
      name: "Batch Text",
      styles: {
        fontSize: 18,
        fontWeight: 600
      }
    }
  ]
})

B. EXECUTE BUNDLED COMMANDS:
---------------------------
mcp_TalkToFigma_execute_bundled_commands({
  commands: [
    {
      command: "create_frame",
      params: {
        x: 400,
        y: 100,
        width: 300,
        height: 200,
        name: "Bundled Frame",
        fillColor: { r: 0.9, g: 0.9, b: 0.9, a: 1 }
      },
      priority: "high"
    },
    {
      command: "create_text",
      params: {
        x: 450,
        y: 150,
        text: "Bundled Commands Test",
        fontSize: 16,
        fontWeight: 600,
        fontColor: { r: 0, g: 0, b: 0, a: 1 }
      },
      priority: "normal"
    },
    {
      command: "create_rectangle",
      params: {
        x: 450,
        y: 200,
        width: 200,
        height: 50,
        name: "Bundled Rectangle"
      },
      priority: "low"
    }
  ],
  stopOnError: true
})

==============================================
Copy and paste these commands into Claude to test
the batch operations functionality.
==============================================
`); 