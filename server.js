const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Question 1: Setup the MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// Create a basic route to test the connection
app.get('/', (req, res) => {
  res.send('Welcome to the Hospital API');
});

// Question 1: GET endpoint to retrieve all patients and display specific fields
app.get('/patients', (req, res) => {
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        return res.status(500).send('Error fetching data from database');
      }
      
      // Respond with the results in JSON format
      res.json(results);
    });
});

// Question 2: GET endpoint to retrieve all providers and display specific fields
app.get('/providers', (req, res) => {
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers';
    
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        return res.status(500).send('Error fetching data from database');
      }
      
      // Respond with the results in JSON format
      res.json(results);
    });
});

// Question 3: GET endpoint to retrieve all patients by first name
app.get('/patients/:first_name', (req, res) => {
    const firstName = req.params.first_name;
    const sql = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
    
    db.query(sql, [firstName], (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        return res.status(500).send('Error fetching data from database');
      }
  
      // If no results found, return a 404 error
      if (results.length === 0) {
        return res.status(404).send('No patients found with the given first name');
      }
      
      // Respond with the results in JSON format
      res.json(results);
    });
});

// Question 4: GET endpoint to retrieve all providers by specialty
app.get('/providers/:specialty', (req, res) => {
    const specialty = req.params.specialty;
    const sql = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
    db.query(sql, [specialty], (err, results) => {
      if (err) {
        console.error('Error fetching data from database:', err);
        return res.status(500).send('Error fetching data from database');
      }
  
      // If no providers are found, return a 404 error
      if (results.length === 0) {
        return res.status(404).send('No providers found with the given specialty');
      }
      
      // Respond with the results in JSON format
      res.json(results);
    });
});

// Close the database connection when server shuts down
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('Error closing the database connection:', err);
    } else {
      console.log('Database connection closed');
    }
    process.exit();
  });
});

// Listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});