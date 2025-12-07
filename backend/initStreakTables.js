const { initDatabase } = require('./database');

async function initStreakTables() {
  try {
    await initDatabase();
    console.log('✅ Streak tables initialized successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to initialize streak tables:', error);
    process.exit(1);
  }
}

initStreakTables();