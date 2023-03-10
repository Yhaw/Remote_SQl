const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.use(cors('*'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
};

 const pool = mysql.createPool(dbConfig);

 pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }

  console.log('Connected to database');

  // Release the connection when done
  connection.release();

  // Start the server
  app.listen(3000, () => {
    console.log('Server started on port 3000');
  });
});

// Example route that queries the database
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.error('Error querying database:', err);
      res.status(500).send('Error querying database');
    } else {
      res.send(result);
    }
  });
});

app.post('/input_users', (req, res) => {
  const { name, number, amount } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query('INSERT INTO users (name, number, amount) VALUES (?, ?, ?)', [name, number, amount], (error, results, fields) => {
      connection.release();
      if (error) throw error;
      res.json({ message: 'User added successfully.' });
    });
  });
});
