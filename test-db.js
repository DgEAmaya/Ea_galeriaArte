// test-db.js
const db = require('./src/config/database');

db.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a MySQL');
    connection.release();
  }
});
