const { initDatabase } = require('./database');

async function initCommunitySystem() {
  console.log('👥 Initializing community system...');
  
  try {
    // Initialize database (creates tables if they don't exist)
    await initDatabase();
    console.log('✅ Community tables created');
    console.log('✅ Community system ready!');
  } catch (error) {
    console.error('❌ Error initializing community system:', error);
  }
}

// Run if called directly
if (require.main === module) {
  initCommunitySystem().then(() => process.exit(0));
}

module.exports = { initCommunitySystem };