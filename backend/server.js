const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql2/promise');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
let pool = null;
const connectToDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'studiomuda',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Test the connection
    const connection = await pool.getConnection();
    connection.release();
    
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await initializeDatabase();
    
    return pool;
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create inventory table if it doesn't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        sku VARCHAR(100),
        quantity INT NOT NULL DEFAULT 0,
        price DECIMAL(10, 2) DEFAULT 0.00,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    process.exit(1);
  }
};

// Sample API route
app.get('/api/status', (req, res) => {
  res.json({ status: 'API is running', timestamp: new Date() });
});

// Import and use route files (to be created)
const inventoryRoutes = require('./routes/inventory.routes');
app.use('/api/inventory', inventoryRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
