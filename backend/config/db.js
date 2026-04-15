const mysql=require('mysql2')

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, // Max concurrent connections
  queueLimit: 0        // 0 = No limit on waiting requests
});
<<<<<<< HEAD
db.getConnection((err, connection) => {
    if(err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Database connected successfully!");
        connection.release(); // release connection back to pool
    }
});
module.exports = db;
=======

module.exports = db; 
>>>>>>> Krishna
