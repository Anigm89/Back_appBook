require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    port: process.env.MYSQLPORT || 3306,
    database: process.env.MYSQLDATABASE || 'appbook'
});
console.log('Se ha conectado con éxito a la base de datos');


module.exports = pool;

