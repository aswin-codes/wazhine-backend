const express = require("express");
const pool = require("../db");
const router = express.Router();

// Get laundries with ratings
router.get("/", async (req, res) => {
  try {
    const query = `
        SELECT ls.id, ls.title, ls.location, ls.image_path,
        COALESCE(AVG(r.rating), 5) AS average_rating
        FROM laundry_shop ls
        LEFT JOIN reviews r ON ls.id = r.shop_id
        GROUP BY ls.id
        ORDER BY average_rating DESC;
      `;

    const result = await pool.query(query);

    const laundries = result.rows;
    res.status(200).json(laundries);
  } catch (error) {
    console.error("Error retrieving laundries with ratings:", error);
    res.status(500).json({ error: "Error retrieving laundries with ratings" });
  }
});



router.get('/laundry/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Retrieve laundry details
      const laundryQuery = 'SELECT id, title, location, image_path, phone_number, email FROM laundry_shop WHERE id = $1';
      const laundryValues = [id];
      const laundryResult = await pool.query(laundryQuery, laundryValues);
  
      const laundry = laundryResult.rows[0];
  
      if (!laundry) {
        return res.status(404).json({ error: 'Laundry not found' });
      }
  
      // Retrieve user reviews including rating, review, and user name
      const reviewsQuery = `
        SELECT reviews.rating, reviews.description, user_table.username
        FROM reviews
        INNER JOIN user_table ON reviews.user_id = user_table.user_id
        WHERE shop_id = $1
      `;
      const reviewsValues = [id];
      const reviewsResult = await pool.query(reviewsQuery, reviewsValues);
  
      const reviews = reviewsResult.rows;
  
      // Calculate the average rating
      const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRatings / reviews.length : 0;
  
      // Include the average rating and reviews in the laundry object
      laundry.reviews = reviews;
      laundry.averageRating = averageRating;
  
      res.status(200).json(laundry);
    } catch (error) {
      console.error('Error retrieving laundry and reviews:', error);
      res.status(500).json({ error: 'Error retrieving laundry and reviews' });
    }
  });
  
  


  

module.exports = router