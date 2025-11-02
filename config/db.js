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
