const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./database');

async function debugLogin() {
  try {
    const email = 'oumanzou.asmae@gmail.com';
    const password = 'Masea22719900';
    
    console.log('🔍 Debugging login for:', email);
    
    // Find user
    const user = await dbHelpers.findUserByEmail(email);
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Password hash:', user.password);
    console.log('  Password starts with $2:', user.password.startsWith('$2'));
    
    // Test password comparison
    console.log('\n🔐 Testing password comparison:');
    console.log('  Input password:', password);
    
    if (user.password.startsWith('$2')) {
      const isValid = await bcrypt.compare(password, user.password);
      console.log('  bcrypt.compare result:', isValid);
    } else {
      const isValid = user.password === password;
      console.log('  Plain text comparison:', isValid);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugLogin();