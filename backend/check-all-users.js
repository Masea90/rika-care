const { db } = require('./database');

db.all('SELECT id, email, password FROM users', (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('All users in database:');
    rows.forEach(user => {
      console.log(`ID: ${user.id}, Email: "${user.email}", Password: ${user.password.substring(0, 20)}...`);
    });
  }
});