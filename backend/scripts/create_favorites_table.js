const mysql = require('mysql2/promise');
require('dotenv').config();

const createFavoritesTable = async () => {
    try {
        console.log('Connecting to MySQL...');
        const pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT || 3306,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            waitForConnections: true,
            connectionLimit: 1,
        });

        console.log('Creating favorites table...');

        await pool.query(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        entity_type ENUM('league', 'team', 'tournament') NOT NULL,
        entity_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_favorite (user_id, entity_type, entity_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        console.log('Favorites table created successfully!');
        await pool.end();
        process.exit(0);
    } catch (error) {
        console.error('Error creating favorites table:', error);
        process.exit(1);
    }
};

createFavoritesTable();
