const { db } = require('./database');

db.all("PRAGMA table_info(products)", (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Products table schema:');
    rows.forEach(row => {
      console.log(`${row.name}: ${row.type}`);
    });
  }
  process.exit(0);
});