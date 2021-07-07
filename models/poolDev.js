const mysql=require('mysql2');
const dbHostname = process.env.DB_HOSTNAME || 'localhost';
const pool = mysql.createPool({
  host: dbHostname,
  user: 'userBolao',
  database: 'dbbolao',
  password:'supersenha123',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true
});

module.exports=pool;

