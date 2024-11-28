const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'mapalo', // Your MySQL username
    password: '1320', // Your MySQL password
    database: 'maboee' // Your database name
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('MySQL Connection Error:', err);
        return;
    }
    console.log('MySQL Connected...');
});

// User Management Routes

// Add new user
app.post('/api/users', (req, res) => {
    console.log('Request Body:', req.body);
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, req.body, (err, result) => {
        if (err) {
            console.error('Error adding user:', err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.status(201).json(result);
    });
});

// Update user
app.put('/api/users/:id', (req, res) => {
    const sql = 'UPDATE users SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating user:', err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.status(200).json(result);
    });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err.sqlMessage);
            return res.status(500).json({ error: err.sqlMessage });
        }
        res.status(200).json(result);
    });
});

// Get all users
app.get('/api/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json(err);
        }
        res.status(200).json(results);
    });
});

// Product Management Routes

// Add new product
app.post('/api/products', (req, res) => {
    const sql = 'INSERT INTO products SET ?';
    db.query(sql, req.body, (err, result) => {
        if (err) {
            console.error('Error adding product:', err);
            return res.status(500).json(err);
        }
        res.status(201).json(result);
    });
});

// Update product
app.put('/api/products/:id', (req, res) => {
    const sql = 'UPDATE products SET ? WHERE id = ?';
    db.query(sql, [req.body, req.params.id], (err, result) => {
        if (err) {
            console.error('Error updating product:', err);
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, req.params.id, (err, result) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
});

// Get all products
app.get('/api/products', (req, res) => {
    const sql = 'SELECT * FROM products';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).json(err);
        }
        res.status(200).json(results);
    });
});

// Sell product
app.post('/api/sell', (req, res) => {
    const { id, quantity } = req.body;

    // Check if the product exists and has enough quantity
    const checkSql = 'SELECT quantity FROM products WHERE id = ?';
    db.query(checkSql, [id], (err, results) => {
        if (err) {
            console.error('Error checking product:', err);
            return res.status(500).json(err);
        }

        if (results.length > 0) {
            const currentQuantity = results[0].quantity;

            if (currentQuantity >= quantity) {
                // Update the product quantity
                const newQuantity = currentQuantity - quantity;
                const updateSql = 'UPDATE products SET quantity = ? WHERE id = ?';
                db.query(updateSql, [newQuantity, id], (err, result) => {
                    if (err) {
                        console.error('Error updating quantity:', err);
                        return res.status(500).json(err);
                    }
                    res.status(200).json({ message: 'Product sold successfully', newQuantity });
                });
            } else {
                res.status(400).json({ message: 'Not enough stock available' });
            }
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});