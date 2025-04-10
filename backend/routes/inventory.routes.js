const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// This is just a placeholder for database connection
// In a real implementation, this would be imported from a central database module
const getPool = async () => {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'studiomuda',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
};

// Get all inventory items
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM inventory');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ message: 'Error fetching inventory items' });
  }
});

// Get a single inventory item
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute('SELECT * FROM inventory WHERE id = ?', [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ message: 'Error fetching inventory item' });
  }
});

// Create a new inventory item
router.post('/', async (req, res) => {
  try {
    const { name, sku, quantity, price, description } = req.body;
    
    const pool = await getPool();
    const [result] = await pool.execute(
      'INSERT INTO inventory (name, sku, quantity, price, description) VALUES (?, ?, ?, ?, ?)',
      [name, sku, quantity, price, description]
    );
    
    res.status(201).json({ 
      message: 'Item created successfully', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ message: 'Error creating inventory item' });
  }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
  try {
    const { name, sku, quantity, price, description } = req.body;
    const id = req.params.id;
    
    const pool = await getPool();
    const [result] = await pool.execute(
      'UPDATE inventory SET name = ?, sku = ?, quantity = ?, price = ?, description = ? WHERE id = ?',
      [name, sku, quantity, price, description, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item updated successfully' });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ message: 'Error updating inventory item' });
  }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const [result] = await pool.execute('DELETE FROM inventory WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({ message: 'Error deleting inventory item' });
  }
});

module.exports = router;
