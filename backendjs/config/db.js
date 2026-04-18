const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Substitua pelo usuário do seu banco
  password: '', // Substitua pela senha do seu banco
  database: 'aplis_db'
});

module.exports = pool.promise();