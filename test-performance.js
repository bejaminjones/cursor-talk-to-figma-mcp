// Performance test script

/**
 * This script demonstrates how to use Claude's tools to simulate batch operations.
 * While direct batch_create_elements and execute_bundled_commands tools are still being integrated,
 * this script shows how to achieve similar functionality using existing tools.
 * 
 * Instructions:
 * 1. Join a channel with Claude's mcp_TalkToFigma_join_channel tool
 * 2. Create multiple elements of different types in sequence for comparison
 */

// INSTRUCTIONS FOR CLAUDE:
console.log(`
==============================================
PERFORMANCE TEST INSTRUCTIONS
==============================================

1. Make sure the Figma plugin is running and connected
2. Ensure you have a Figma document open
3. Use these commands with Claude:

First, join a channel:
mcp_TalkToFigma_join_channel({
  channel: "your-channel-name"
})

==============================================
INDIVIDUAL ELEMENTS TEST (SLOWER)
==============================================
// Time how long it takes to create these elements individually
mcp_TalkToFigma_create_frame({
  x: 100,
  y: 100,
  width: 600,
  height: 400,
  name: "Individual Elements Frame",
  fillColor: { r: 0.95, g: 0.95, b: 0.95, a: 1 }
})

// Create individual elements
// NOTE: Remember to use the frame ID as parentId from previous step
mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 140,
  width: 100,
  height: 60,
  name: "Individual Rectangle 1",
  parentId: "FRAME_ID_HERE",
})

mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 220,
  width: 100,
  height: 60,
  name: "Individual Rectangle 2",
  parentId: "FRAME_ID_HERE",
})

mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 300,
  width: 100,
  height: 60,
  name: "Individual Rectangle 3",
  parentId: "FRAME_ID_HERE",
})

mcp_TalkToFigma_create_text({
  x: 250,
  y: 150,
  text: "Individual Elements Test",
  name: "Individual Text 1",
  fontSize: 18,
  fontWeight: 600,
  parentId: "FRAME_ID_HERE"
})

mcp_TalkToFigma_create_text({
  x: 250,
  y: 230,
  text: "Created one by one",
  name: "Individual Text 2",
  fontSize: 14,
  parentId: "FRAME_ID_HERE"
})

mcp_TalkToFigma_create_text({
  x: 250,
  y: 310,
  text: "Separate network calls",
  name: "Individual Text 3",
  fontSize: 14,
  parentId: "FRAME_ID_HERE"
})

==============================================
WORKAROUND FOR BATCH OPERATIONS (FASTER APPROACH)
==============================================
// For batch-like behavior, create operations back-to-back with minimal processing in between

// First create the parent frame
mcp_TalkToFigma_create_frame({
  x: 100,
  y: 550,
  width: 600,
  height: 400,
  name: "Batched Elements Frame",
  fillColor: { r: 0.9, g: 0.95, b: 0.9, a: 1 }
})

// Then immediately create all elements without waiting for user input
// NOTE: Claude, use the frame ID from the previous step
const parentId = "FRAME_ID_HERE";

// Create a series of rectangles quickly
mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 590,
  width: 100,
  height: 60,
  name: "Batch Rectangle 1",
  parentId: parentId,
})

mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 670,
  width: 100,
  height: 60,
  name: "Batch Rectangle 2",
  parentId: parentId,
})

mcp_TalkToFigma_create_rectangle({
  x: 120,
  y: 750,
  width: 100,
  height: 60,
  name: "Batch Rectangle 3",
  parentId: parentId,
})

// Create a series of text elements quickly
mcp_TalkToFigma_create_text({
  x: 250,
  y: 600,
  text: "Batched Elements Test",
  name: "Batch Text 1",
  fontSize: 18,
  fontWeight: 600,
  parentId: parentId
})

mcp_TalkToFigma_create_text({
  x: 250,
  y: 680,
  text: "Created in sequence",
  name: "Batch Text 2",
  fontSize: 14,
  parentId: parentId
})

mcp_TalkToFigma_create_text({
  x: 250,
  y: 760,
  text: "Minimizing processing time",
  name: "Batch Text 3",
  fontSize: 14,
  parentId: parentId
})

==============================================
After running both tests, compare the performance:
1. How quickly each set of elements appeared
2. How much time was spent waiting between commands
3. How responsive the interface was during creation
==============================================
`); 