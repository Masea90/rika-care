const axios = require('axios');

const loginData = {
  email: 'oumanzou.asmae@gmail.com',
  password: 'Masea22719900'
};

async function testLogin() {
  try {
    console.log('Testing login API...');
    const response = await axios.post('http://localhost:3000/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.log('❌ Login failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testLogin();