// Test script for batch operations features
const { exec } = require('child_process');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to execute MCP commands
function executeMcpCommand(command, params) {
  return new Promise((resolve, reject) => {
    const input = {
      method: command,
      params
    };
    
    console.log(`Executing command: ${command}`);
    console.log(`Params: ${JSON.stringify(params, null, 2)}`);
    
    // Prepare stdin data
    const stdinData = JSON.stringify(input) + '\n';
    
    // Execute MCP command
    const child = exec('node dist/talk_to_figma_mcp/server.js', {
      cwd: process.cwd()
    });
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      console.error(`[MCP stderr]: ${data}`);
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        console.error(`MCP process exited with code ${code}`);
        reject(new Error(`Process exited with code ${code}`));
        return;
      }
      
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        console.error('Error parsing MCP output:', err);
        reject(err);
      }
    });
    
    // Write to stdin
    child.stdin.write(stdinData);
    child.stdin.end();
  });
}

// Test the join_channel command
async function testJoinChannel() {
  console.log('Testing join_channel...');
  
  try {
    const response = await executeMcpCommand('join_channel', {
      channel: 'test-channel'
    });
    
    console.log('join_channel response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.error('Error joining channel:', error);
    return false;
  }
}

// Test batch_create_elements feature
async function testBatchCreateElements() {
  console.log('Testing batch_create_elements...');
  
  try {
    const response = await executeMcpCommand('batch_create_elements', {
      elements: [
        {
          type: 'rectangle',
          x: 100,
          y: 100,
          width: 200,
          height: 100,
          name: 'Batch Rectangle 1',
          styles: {
            fillColor: { r: 1, g: 0, b: 0, a: 1 },
            cornerRadius: 8
          }
        },
        {
          type: 'rectangle',
          x: 100,
          y: 220,
          width: 200,
          height: 100,
          name: 'Batch Rectangle 2',
          styles: {
            fillColor: { r: 0, g: 1, b: 0, a: 1 },
            cornerRadius: 8
          }
        },
        {
          type: 'text',
          x: 150,
          y: 350,
          text: 'Batch Created Elements',
          name: 'Batch Text',
          styles: {
            fontSize: 18,
            fontWeight: 600
          }
        }
      ]
    });
    
    console.log('batch_create_elements response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.error('Error in batch creation:', error);
    return false;
  }
}

// Test execute_bundled_commands feature
async function testBundledCommands() {
  console.log('Testing execute_bundled_commands...');
  
  try {
    const response = await executeMcpCommand('execute_bundled_commands', {
      commands: [
        {
          command: 'create_frame',
          params: {
            x: 400,
            y: 100,
            width: 300,
            height: 200,
            name: 'Bundled Frame',
            fillColor: { r: 0.9, g: 0.9, b: 0.9, a: 1 }
          },
          priority: 'high'
        },
        {
          command: 'create_text',
          params: {
            x: 450,
            y: 150,
            text: 'Bundled Commands Test',
            fontSize: 16,
            fontWeight: 600,
            fontColor: { r: 0, g: 0, b: 0, a: 1 }
          },
          priority: 'normal'
        },
        {
          command: 'create_rectangle',
          params: {
            x: 450,
            y: 200,
            width: 200,
            height: 50,
            name: 'Bundled Rectangle'
          },
          priority: 'low'
        }
      ],
      stopOnError: true
    });
    
    console.log('execute_bundled_commands response:', JSON.stringify(response, null, 2));
    return true;
  } catch (error) {
    console.error('Error in bundled commands:', error);
    return false;
  }
}

// Main test function
async function runTests() {
  console.log('=== Starting Batch Operations Tests ===');
  
  rl.question('Please make sure Figma plugin is running and ready. Press Enter to continue...', async () => {
    // First join a channel
    const joinSuccess = await testJoinChannel();
    
    if (!joinSuccess) {
      console.error('Failed to join channel, cannot proceed with tests');
      rl.close();
      return;
    }
    
    // Test batch create elements
    console.log('\n=== Testing Batch Create Elements ===');
    await testBatchCreateElements();
    
    // Test bundled commands
    console.log('\n=== Testing Bundled Commands ===');
    await testBundledCommands();
    
    console.log('\n=== Tests Completed ===');
    rl.close();
  });
}

// Run the tests
runTests(); 