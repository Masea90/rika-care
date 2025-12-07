const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./database');

// Simulate the exact login logic from server.js
async function simulateLogin(email, password) {
  try {
    console.log('🔍 Simulating server login logic...');
    console.log('Input email:', email);
    console.log('Input password:', password);
    
    const user = await dbHelpers.findUserByEmail(email);
    console.log('User found:', !!user);
    
    if (!user) {
      console.log('❌ User not found - would return 401');
      return { success: false, message: 'Invalid credentials' };
    }
    
    console.log('User email from DB:', user.email);
    console.log('User password from DB:', user.password);
    console.log('Password starts with $2b$:', user.password.startsWith('$2b$'));
    
    // Check if password is hashed (starts with $2b$) or plain text (legacy)
    let passwordValid = false;
    if (user.password.startsWith('$2b$')) {
      console.log('Using bcrypt comparison...');
      passwordValid = await bcrypt.compare(password, user.password);
      console.log('bcrypt result:', passwordValid);
    } else {
      console.log('Using plain text comparison...');
      passwordValid = user.password === password;
      console.log('Plain text result:', passwordValid);
    }

    if (!passwordValid) {
      console.log('❌ Password invalid - would return 401');
      return { success: false, message: 'Invalid credentials' };
    }
    
    console.log('✅ Login would succeed');
    return { success: true, message: 'Login successful' };
    
  } catch (error) {
    console.error('❌ Error in simulation:', error.message);
    return { success: false, message: 'Server error' };
  }
}

// Test the simulation
simulateLogin('oumanzou.asmae@gmail.com', 'Masea22719900');