const express = require('express');
const cors = require('cors');
const connection = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Create a new user
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  const query = 'INSERT INTO users (name, email) VALUES (?, ?)';
  connection.query(query, [name, email], (err, results) => {
    if (err) throw err;
    res.status(201).json({ id: results.insertId, name, email });
  });
});

// Get all users
app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Get a user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(results[0]);
  });
});

// Update a user by ID
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const query = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
  connection.query(query, [name, email, id], (err) => {
    if (err) throw err;
    res.json({ id, name, email });
  });
});

// Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM users WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) throw err;
    res.status(204).send();
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
