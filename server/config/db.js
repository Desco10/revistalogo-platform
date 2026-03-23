const mysql = require("mysql2/promise");

const db = mysql.createPool({
  uri: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10
});

// prueba de conexión
(async () => {
  try {
    const connection = await db.getConnection();
    console.log("Conectado a MySQL 🚀");
    connection.release();
  } catch (error) {
    console.error("Error conectando a MySQL:", error.message);
  }
})();

module.exports = db;