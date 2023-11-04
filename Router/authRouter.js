const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

// Sign-up endpoint
router.post("/signup", async (req, res) => {
  const { username, password, phonenumber, email } = req.body;

  // Hash the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing the password" });
    }

    // Store the user in the database with the hashed password
    const insertQuery =
      "INSERT INTO user_table (username, password, phonenumber, email) VALUES ($1, $2, $3, $4) RETURNING user_id, username, email, phonenumber";
    pool.query(
      insertQuery,
      [username, hash, phonenumber, email],
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: "Error signing up" });
        }

        // Extract the user data from the database response
        const { user_id, username, email, phonenumber } = result.rows[0];

        // Send user data as a response
        res.status(201).json({
          message: "User signed up successfully",
          user_id,
          username,
          email,
          phonenumber,
        });
      }
    );
  });
});

// Login endpoint
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Retrieve user information from the database by email
  const selectQuery =
    "SELECT user_id, username, email, phonenumber,password FROM user_table WHERE email = $1";
  pool.query(selectQuery, [email], (error, result) => {
    if (error) {
      return res.status(500).json({ error: "Error during login" });
    }

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Compare the hashed password
    bcrypt.compare(password, user.password, (err, passwordMatch) => {
      if (!passwordMatch) {
        return res.status(401).json({ error: "Incorrect password" });
      }

      // If login is successful, send user details
      res.status(200).json({
        message: "Login successful",
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          phonenumber: user.phonenumber,
        },
      });
    });
  });
});

module.exports = router;
