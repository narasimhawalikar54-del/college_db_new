const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Narasimha@12JW', // update if needed
    database: 'project1',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize Users table with correct schema
async function initDb() {
    try {
        const [rows] = await pool.promise().query(`
            CREATE TABLE IF NOT EXISTS Users (
                userid INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
}

initDb();

// Test connection on startup and log errors
pool.getConnection((err, conn) => {
    if (err) {
        console.error('MySQL connection error:', err.message || err);
        // do not throw here so server can start for debugging; callers will see errors on queries
        return;
    }
    console.log('Connected to MySQL database:', pool.config.connectionConfig.database);
    conn.release();
});

module.exports = pool.promise();
