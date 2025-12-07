// Simple test script to verify authentication endpoints
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api';

async function testAuth() {
    console.log('🧪 Testing RIKA Authentication Endpoints\n');
    
    // Test health endpoint
    try {
        const health = await fetch(`${API_BASE}/health`);
        const healthData = await health.json();
        console.log('✅ Health check:', healthData.status);
    } catch (error) {
        console.log('❌ Server not running. Start with: npm start');
        return;
    }
    
    // Test signup
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'testpass123';
    
    try {
        const signupResponse = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testEmail,
                password: testPassword,
                profile: { personalInfo: { name: 'Test User' } }
            })
        });
        
        const signupData = await signupResponse.json();
        
        if (signupData.success) {
            console.log('✅ Signup successful');
            console.log('   Token:', signupData.token.substring(0, 20) + '...');
            
            // Test login with same credentials
            const loginResponse = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    password: testPassword
                })
            });
            
            const loginData = await loginResponse.json();
            
            if (loginData.success) {
                console.log('✅ Login successful');
                console.log('   User ID:', loginData.user.id);
            } else {
                console.log('❌ Login failed:', loginData.message);
            }
            
        } else {
            console.log('❌ Signup failed:', signupData.message);
        }
        
    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
    
    console.log('\n🎉 Authentication test complete');
}

testAuth();