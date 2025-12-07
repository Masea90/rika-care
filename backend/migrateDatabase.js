const { db } = require('./database');

async function migrateDatabase() {
  console.log('🔄 Migrating database schema...');
  
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Add new columns to existing products table
      const alterQueries = [
        'ALTER TABLE products ADD COLUMN full_description TEXT',
        'ALTER TABLE products ADD COLUMN benefits TEXT',
        'ALTER TABLE products ADD COLUMN how_to_use TEXT', 
        'ALTER TABLE products ADD COLUMN full_ingredient_list TEXT',
        'ALTER TABLE products ADD COLUMN clean_flags TEXT',
        'ALTER TABLE products ADD COLUMN suitability TEXT'
      ];
      
      let completed = 0;
      const total = alterQueries.length;
      
      alterQueries.forEach(query => {
        db.run(query, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.log('Column might already exist:', err.message);
          }
          completed++;
          if (completed === total) {
            console.log('✅ Database migration completed');
            resolve();
          }
        });
      });
    });
  });
}

// Run if called directly
if (require.main === module) {
  migrateDatabase().then(() => process.exit(0));
}

module.exports = { migrateDatabase };