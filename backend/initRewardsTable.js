const { initDatabase } = require('./database');
const { seedRewards } = require('./seedRewards');

async function initRewardsSystem() {
  console.log('🔧 Initializing rewards system...');
  
  try {
    // Initialize database (creates tables if they don't exist)
    await initDatabase();
    console.log('✅ Database initialized');
    
    // Seed rewards
    await seedRewards();
    console.log('✅ Rewards system ready!');
  } catch (error) {
    console.error('❌ Error initializing rewards system:', error);
  }
}

// Run if called directly
if (require.main === module) {
  initRewardsSystem().then(() => process.exit(0));
}

module.exports = { initRewardsSystem };