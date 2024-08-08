import express from "express";
import path from "path";
import { connection as db } from "./config/index.js"; // Assuming your DB connection is in config/index.js

// Create an express app
const app = express();
const port = +process.env.PORT || 4000;
const router = express.Router();

// Middleware
app.use(
  router,
  express.static("./static"),
  express.json(),
  express.urlencoded({
    extended: true,
  })
);

// Endpoints

// Serve index.html
router.get("^/$|/eShop", (req, res) => {
  res.status(200).sendFile(path.resolve("./static/html/index.html"));
});

// Get all users
router.get("/users", (req, res) => {
  try {
    const strQry = `
      select userName, userSurname, userAge, userEmail
      from Users;
    `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error(`Unable to fetch all users`);
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Get user by ID
router.get("/user/:id", (req, res) => {
  try {
    const strQry = `
      select userName, userSurname, userAge, userEmail
      from Users
      where userID = ${req.params.id};
    `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error(`Issue when retrieving a user.`);
      res.json({
        status: res.statusCode,
        results: results[0],
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Add a new user
router.post("/register", (req, res) => {
  try {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = `
      INSERT INTO Users (userName, userSurname, userAge, userEmail, userPwd)
      VALUES (?, ?, ?, ?, ?);
    `;
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd], (err, results) => {
      if (err) throw new Error("Unable to register user.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Update a user by ID
router.patch("/user/:id", (req, res) => {
  try {
    const { userName, userSurname, userAge, userEmail, userPwd } = req.body;
    const strQry = `
      UPDATE Users
      SET userName = ?, userSurname = ?, userAge = ?, userEmail = ?, userPwd = ?
      WHERE userID = ?;
    `;
    db.query(strQry, [userName, userSurname, userAge, userEmail, userPwd, req.params.id], (err, results) => {
      if (err) throw new Error("Unable to update user.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Delete a user by ID
router.delete("/user/:id", (req, res) => {
  try {
    const strQry = `
      DELETE FROM Users WHERE userID = ?;
    `;
    db.query(strQry, [req.params.id], (err, results) => {
      if (err) throw new Error("Unable to delete user.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Get all products
router.get("/products", (req, res) => {
  try {
    const strQry = `
      SELECT * FROM Products;
    `;
    db.query(strQry, (err, results) => {
      if (err) throw new Error("Unable to fetch all products.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Get a product by ID
router.get("/product/:id", (req, res) => {
  try {
    const strQry = `
      SELECT * FROM Products WHERE prodID = ?;
    `;
    db.query(strQry, [req.params.id], (err, results) => {
      if (err) throw new Error("Unable to fetch product.");
      res.json({
        status: res.statusCode,
        results: results[0],
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Add a new product
router.post("/addProduct", (req, res) => {
  try {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    const strQry = `
      INSERT INTO Products (prodName, prodQuantity, prodPrice, prodURL, userID)
      VALUES (?, ?, ?, ?, ?);
    `;
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, userID], (err, results) => {
      if (err) throw new Error("Unable to add product.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Update a product by ID
router.patch("/product/:id", (req, res) => {
  try {
    const { prodName, prodQuantity, prodPrice, prodURL, userID } = req.body;
    const strQry = `
      UPDATE Products
      SET prodName = ?, prodQuantity = ?, prodPrice = ?, prodURL = ?, userID = ?
      WHERE prodID = ?;
    `;
    db.query(strQry, [prodName, prodQuantity, prodPrice, prodURL, userID, req.params.id], (err, results) => {
      if (err) throw new Error("Unable to update product.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Delete a product by ID
router.delete("/product/:id", (req, res) => {
  try {
    const strQry = `
      DELETE FROM Products WHERE prodID = ?;
    `;
    db.query(strQry, [req.params.id], (err, results) => {
      if (err) throw new Error("Unable to delete product.");
      res.json({
        status: res.statusCode,
        results,
      });
    });
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message,
    });
  }
});

// Fallback for undefined routes
router.get("*", (req, res) => {
  res.json({
    status: 404,
    msg: "Page not found",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});