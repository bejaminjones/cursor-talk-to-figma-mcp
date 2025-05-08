// Automated test script for batch operations features
const { exec } = require('child_process');

// Channel to join - update this for each test run
const CHANNEL = 'o6dbasq6';

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
    const child = exec('node dist/server.js', {
      cwd: process.cwd()
    });
    
    let output = '';
    
    child.stdout.on('data', (data) => {
      const dataStr = data.toString();
      output += dataStr;
      console.log(`[STDOUT]: ${dataStr}`);
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
        if (!output.trim()) {
          reject(new Error('No output received from command'));
          return;
        }
        
        console.log('Raw output:', output);
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
      channel: CHANNEL
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
          y: 1500,
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
          y: 1620,
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
          y: 1750,
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
            y: 1500,
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
            y: 1550,
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
            y: 1600,
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
  
  // First join a channel
  const joinSuccess = await testJoinChannel();
  
  if (!joinSuccess) {
    console.error('Failed to join channel, cannot proceed with tests');
    return;
  }
  
  // Test batch create elements
  console.log('\n=== Testing Batch Create Elements ===');
  const batchSuccess = await testBatchCreateElements();
  
  if (!batchSuccess) {
    console.error('Failed to test batch create elements');
  }
  
  // Test bundled commands
  console.log('\n=== Testing Bundled Commands ===');
  const bundledSuccess = await testBundledCommands();
  
  if (!bundledSuccess) {
    console.error('Failed to test bundled commands');
  }
  
  console.log('\n=== Tests Completed ===');
  
  if (joinSuccess && batchSuccess && bundledSuccess) {
    console.log('All tests passed successfully!');
  } else {
    console.log('Some tests failed, check the log for details.');
  }
}

// Run the tests
runTests(); 