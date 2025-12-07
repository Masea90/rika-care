const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'wellness-app.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT id, email, password FROM users', (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Users in wellness-app.db:');
    if (rows.length === 0) {
      console.log('No users found');
    } else {
      rows.forEach(user => {
        console.log(`ID: ${user.id}, Email: "${user.email}"`);
      });
    }
  }
  db.close();
});