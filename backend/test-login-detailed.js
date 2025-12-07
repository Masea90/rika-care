const http = require('http');

// Test different email cases
const testCases = [
  { email: 'oumanzou.asmae@gmail.com', password: 'Masea22719900' },
  { email: 'OUMANZOU.ASMAE@GMAIL.COM', password: 'Masea22719900' },
  { email: 'test@example.com', password: 'password123' }
];

async function testLogin(loginData, testName) {
  return new Promise((resolve) => {
    const data = JSON.stringify(loginData);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    console.log(`\n🧪 ${testName}:`);
    console.log('   Email:', loginData.email);
    console.log('   Password:', loginData.password);

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        console.log('   Status:', res.statusCode);
        console.log('   Response:', responseData);
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error('   Error:', error);
      resolve();
    });

    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🔍 Testing different login scenarios...');
  
  for (let i = 0; i < testCases.length; i++) {
    await testLogin(testCases[i], `Test ${i + 1}`);
  }
}

runTests();