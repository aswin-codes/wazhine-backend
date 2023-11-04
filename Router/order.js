const express = require("express");
const pool = require("../db");
const sendMail = require("./sendmail");

const router = express.Router();

// Add a new order
router.post("/addorder", async (req, res) => {
  try {
    const { status, shop_id, clothes, email, username } = req.body;

    // Validate the request data as needed

    // Insert the new order into the database
    const insertQuery = `
        INSERT INTO orders (status, shop_id, clothes, email, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING order_id`;
    const values = [status, shop_id, JSON.stringify(clothes), email, username];

    const result = await pool.query(insertQuery, values);

    // Respond with the newly created order's ID
    res.status(201).json({ order_id: result.rows[0].order_id });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Error adding order" });
  }
});

router.post("/addorder/user", async (req, res) => {
    try {
      const { status, shop_id, clothes, email, username,user_id } = req.body;
  
      // Validate the request data as needed
  
      // Insert the new order into the database
      const insertQuery = `
          INSERT INTO orders (status, shop_id, clothes, email, username,user_id)
          VALUES ($1, $2, $3, $4, $5,$6)
          RETURNING order_id`;
      const values = [status, shop_id, JSON.stringify(clothes), email, username,user_id];
  
      const result = await pool.query(insertQuery, values);
  
      // Respond with the newly created order's ID
      res.status(201).json({ order_id: result.rows[0].order_id });
    } catch (error) {
      console.error("Error adding order:", error);
      res.status(500).json({ error: "Error adding order" });
    }
  });
// Define a route to get orders for a specific shop by shop_id
router.get("/getorders/:shopId", async (req, res) => {
  try {
    const { shopId } = req.params;

    // Query the database to retrieve orders for the specified shop
    const ordersQuery = "SELECT * FROM orders WHERE shop_id = $1";
    const ordersValues = [shopId];
    const ordersResult = await pool.query(ordersQuery, ordersValues);

    // Respond with the list of orders
    res.status(200).json(ordersResult.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Route to change the status of an order by order ID
router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus } = req.body;

    // Update the order status in the database
    const updateQuery = `
        UPDATE orders
        SET status = $1
        WHERE order_id = $2;
      `;

    const updatedOrder = await pool.query(updateQuery, [newStatus, orderId]);

    if (updatedOrder) {
      res.status(200).json({ msg: "Updated" });
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Define a new route to get orders by user_id
router.get("/user/:user_id", async (req, res) => {
    try {
      const { user_id } = req.params;
  
      // Query the database to retrieve orders for the specified user_id
      const query = `
        SELECT * FROM orders
        WHERE user_id = $1
      `;
  
      const { rows } = await pool.query(query, [user_id]);
  
      res.status(200).json(rows);
    } catch (error) {
      console.error("Error fetching orders by user_id:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

router.delete("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    // Run a DELETE SQL query to remove the order with the specified order ID
    const deleteQuery = "DELETE FROM orders WHERE order_id = $1";

    const result = await pool.query(deleteQuery, [orderId]);

    if (result.rowCount === 1) {
      // The order was deleted successfully
      res.status(204).send();
    } else {
      // No order was deleted (order with the specified ID not found)
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/sendmail/:id", async (req, res) => {
    const {id} = req.params;
    await sendMail(id);
    res.json({
        "success" : "true"
    })
});

module.exports = router;
