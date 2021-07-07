const mysql=require('mysql2');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'userBolao',
  database: 'dbbolao',
  password:'supersenha123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

module.exports=pool;
