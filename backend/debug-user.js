const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./database');

const EMAIL = 'oumanzou.asmae@gmail.com';
const TEST_PASSWORD = 'Masea22719900';

async function debugUser() {
  try {
    const user = await dbHelpers.findUserByEmail(EMAIL);
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('User found:');
    console.log('- ID:', user.id);
    console.log('- Email:', user.email);
    console.log('- Password hash:', user.password);
    console.log('- Hash starts with $2b$:', user.password.startsWith('$2b$'));
    
    // Test password comparison
    const isValid = await bcrypt.compare(TEST_PASSWORD, user.password);
    console.log('- Password test result:', isValid);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugUser();