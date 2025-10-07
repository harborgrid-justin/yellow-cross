/**
 * Test script to verify the fix for blank page issue
 */
const http = require('http');

console.log('Testing if http://localhost:3000/ serves content...\n');

// Give server time to start if running in parallel
setTimeout(() => {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200 && data.includes('<html')) {
        console.log('\n✓ SUCCESS: Server responds with HTML content');
        console.log(`✓ Response length: ${data.length} bytes`);
        console.log('✓ The blank page issue should be fixed!');
        process.exit(0);
      } else {
        console.log('\n✗ FAILED: Server did not return HTML content');
        console.log('Response:', data.substring(0, 200));
        process.exit(1);
      }
    });
  });

  req.on('error', (error) => {
    console.error('✗ ERROR: Could not connect to server');
    console.error('Make sure the server is running with: npm start');
    console.error('Error:', error.message);
    process.exit(1);
  });

  req.end();
}, 1000);
