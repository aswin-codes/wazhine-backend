const express = require("express");
const pool = require("../db");

const router = express.Router();

// Create a New Review
router.post("/reviews", async (req, res) => {
  try {
    const { rating, description, shop_id, user_id } = req.body;
    const query =
      "INSERT INTO reviews (rating, description, shop_id, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
    const values = [rating, description, shop_id, user_id];

    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating a review:", error);
    res.status(500).json({ error: "Error creating a review" });
  }
});

module.exports = router;
