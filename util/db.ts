import mysql from 'mysql2';

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'zack123!!!',
  database: process.env.DB_NAME || 'geservice',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
