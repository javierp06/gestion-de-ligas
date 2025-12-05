const mysql = require('mysql2/promise');

let pool = null;

const connectMySQL = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT || 3306,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });

    // Probar la conexión
    const connection = await pool.getConnection();
    console.log('MySQL conectado correctamente');
    connection.release();

    // Crear tablas si no existen
    await createTables();
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
    process.exit(1);
  }
};

const createTables = async () => {
  try {
    const connection = await pool.getConnection();

    // Tabla de Usuarios
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role ENUM('user', 'organizer', 'admin') DEFAULT 'user',
        phone VARCHAR(20),
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_role (role)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Deportes
    await connection.query(`
      CREATE TABLE IF NOT EXISTS sports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        players_per_team INT NOT NULL,
        icon VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_name (name)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Ligas
    await connection.query(`
      CREATE TABLE IF NOT EXISTS leagues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        sport_id INT NOT NULL,
        organizer_id INT NOT NULL,
        location VARCHAR(255),
        status ENUM('active', 'inactive', 'finished') DEFAULT 'active',
        logo VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE RESTRICT,
        FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE RESTRICT,
        INDEX idx_status (status),
        INDEX idx_sport (sport_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Torneos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        league_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE,
        format ENUM('league', 'knockout', 'group_knockout') DEFAULT 'league',
        status ENUM('upcoming', 'in_progress', 'finished') DEFAULT 'upcoming',
        max_teams INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        INDEX idx_status (status),
        INDEX idx_dates (start_date, end_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Equipos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        short_name VARCHAR(50),
        logo VARCHAR(500),
        captain_id INT,
        league_id INT NOT NULL,
        founded_date DATE,
        colors VARCHAR(100),
        stadium VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (captain_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (league_id) REFERENCES leagues(id) ON DELETE CASCADE,
        INDEX idx_league (league_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Jugadores
    await connection.query(`
      CREATE TABLE IF NOT EXISTS players (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        team_id INT NOT NULL,
        jersey_number INT,
        position VARCHAR(50),
        status ENUM('active', 'inactive', 'injured') DEFAULT 'active',
        joined_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        UNIQUE KEY unique_player_team (user_id, team_id),
        INDEX idx_team (team_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Partidos
    await connection.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tournament_id INT NOT NULL,
        home_team_id INT NOT NULL,
        away_team_id INT NOT NULL,
        match_date DATETIME NOT NULL,
        location VARCHAR(255),
        home_score INT DEFAULT 0,
        away_score INT DEFAULT 0,
        status ENUM('scheduled', 'live', 'finished', 'postponed', 'cancelled') DEFAULT 'scheduled',
        round INT,
        referee VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
        FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
        FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE RESTRICT,
        INDEX idx_tournament (tournament_id),
        INDEX idx_status (status),
        INDEX idx_date (match_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Estadísticas de Jugadores por Partido
    await connection.query(`
      CREATE TABLE IF NOT EXISTS player_match_stats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        match_id INT NOT NULL,
        player_id INT NOT NULL,
        goals INT DEFAULT 0,
        assists INT DEFAULT 0,
        yellow_cards INT DEFAULT 0,
        red_cards INT DEFAULT 0,
        minutes_played INT DEFAULT 0,
        points INT DEFAULT 0,
        rebounds INT DEFAULT 0,
        fouls INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        UNIQUE KEY unique_player_match (match_id, player_id),
        INDEX idx_match (match_id),
        INDEX idx_player (player_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Clasificación/Standings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS standings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tournament_id INT NOT NULL,
        team_id INT NOT NULL,
        matches_played INT DEFAULT 0,
        wins INT DEFAULT 0,
        draws INT DEFAULT 0,
        losses INT DEFAULT 0,
        goals_for INT DEFAULT 0,
        goals_against INT DEFAULT 0,
        goal_difference INT DEFAULT 0,
        points INT DEFAULT 0,
        position INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
        FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
        UNIQUE KEY unique_tournament_team (tournament_id, team_id),
        INDEX idx_tournament (tournament_id),
        INDEX idx_points (points DESC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Tabla de Refresh Tokens
    await connection.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user (user_id),
        INDEX idx_token (token(255))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    console.log('Tablas MySQL creadas/verificadas correctamente');
    connection.release();
  } catch (error) {
    console.error('Error creando tablas MySQL:', error.message);
    throw error;
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('MySQL pool no inicializado. Llama a connectMySQL() primero.');
  }
  return pool;
};

module.exports = { connectMySQL, getPool };
