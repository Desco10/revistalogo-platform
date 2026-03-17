const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// prueba de conexión
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conectado a MySQL 🚀");
    connection.release();
  } catch (error) {
    console.error("Error conectando a MySQL:", error);
  }
})();

module.exports = db;