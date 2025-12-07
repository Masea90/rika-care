/**
 * Developer-only Password Reset Utility
 * 
 * Usage: node dev-reset-password.js
 * 
 * IMPORTANT: This is for local development only. 
 * Do NOT expose this as a public API endpoint.
 */

const bcrypt = require('bcryptjs');
const { dbHelpers } = require('./database');

// ========================================
// CONFIGURE THESE VARIABLES:
// ========================================
const EMAIL = 'oumanzou.asmae@gmail.com'.toLowerCase();        // Set the user's email here
const NEW_PASSWORD = 'Masea22719900';    // Set the new password here
// ========================================

async function resetPassword() {
  try {
    console.log('🔍 Looking for user with email:', EMAIL);
    
    // Find user by email
    const user = await dbHelpers.findUserByEmail(EMAIL);
    if (!user) {
      console.error('❌ User not found with email:', EMAIL);
      process.exit(1);
    }
    
    console.log('✅ User found:', user.email, '(ID:', user.id + ')');
    
    // Hash the new password
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    
    // Update user's password
    console.log('💾 Updating password in database...');
    const changes = await dbHelpers.updateUser(user.id, { password: hashedPassword });
    
    if (changes > 0) {
      console.log('✅ Password successfully reset!');
      console.log('📧 Email:', EMAIL);
      console.log('🔑 New password:', NEW_PASSWORD);
      console.log('');
      console.log('You can now log in with the new password.');
    } else {
      console.error('❌ Failed to update password');
    }
    
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    process.exit(1);
  }
}

// Run the reset
resetPassword();