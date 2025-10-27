const mysql = require('mysql2/promise');

let connection = null;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aham_housing',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create database tables
const createTables = async () => {
  try {
    // Leads table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255),
        city VARCHAR(100),
        loan_type VARCHAR(100),
        loan_amount DECIMAL(15,2),
        message TEXT,
        source VARCHAR(50) DEFAULT 'website',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // EMI calculations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS emi_calculations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        loan_amount DECIMAL(15,2) NOT NULL,
        interest_rate DECIMAL(5,2) NOT NULL,
        tenure_months INT NOT NULL,
        monthly_emi DECIMAL(15,2) NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        total_interest DECIMAL(15,2) NOT NULL,
        user_ip VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Eligibility scores table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS eligibility_scores (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        mobile VARCHAR(20),
        age_group VARCHAR(50),
        income_range VARCHAR(50),
        employment_type VARCHAR(50),
        city_tier VARCHAR(50),
        existing_loans VARCHAR(50),
        credit_score_range VARCHAR(50),
        property_type VARCHAR(50),
        eligibility_score INT,
        eligibility_status VARCHAR(50),
        recommendations TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Newsletter subscriptions
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

const initialize = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connected to MySQL database');
    
    await createTables();
    return connection;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database not initialized. Call initialize() first.');
  }
  return connection;
};

module.exports = {
  initialize,
  getConnection
};