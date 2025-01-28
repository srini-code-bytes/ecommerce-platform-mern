// MAIN ENTRY POINT 
// To connect to the database

// All require are imports
const express = require("express");
const mongoose = require("mongoose");

// To parse the cookie
const cookieParser = require("cookie-parser");  

// To allow cross-origin requests
const cors = require("cors"); // Why?
const authRouter = require("./routes/auth/auth-routes");
const { registerUser } = require("./controllers/auth/auth-controller");

const adminProductsRouter = require("./routes/admin/products-routes");

const shopProductsRouter = require('./routes/shop/products-routes')

const shopCartRouter = require('./routes/shop/cart-routes')

const shopAddressRouter = require('./routes/shop/address-routes')

const shopOrderRouter = require('./routes/shop/order-routes')

const adminOrderRouter = require('./routes/admin/order-routes')

const shopSearchRouter = require('./routes/shop/search-routes')

// Create database connection
// create a separate file for this and import that file here --better approach

// take the below url from mongodb; make sure to give the password that you created in mongodb

mongoose
  .connect(
    "mongodb+srv://sriniv33613:sriniv336132024@cluster0.vj57d.mongodb.net/"
  )
  .then(() => console.log("Yayyyy! Mongo db is connected"))
  .catch((error) => console.log("error"));

const app = express(); // CREATE THE EXPRESS APP
const PORT = process.env.PORT || 8080; // Backend server will run on 8080

// To allow cross-origin requests
app.use(
  cors({
    // Mention that you want client side to be running on port 5173
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

//To parse the cookie that we send from frontend
app.use(cookieParser());

// To get the response from backend in standard json format
app.use(express.json());

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);

app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/shop/products", shopProductsRouter);

app.use("/api/shop/cart", shopCartRouter);

app.use("/api/shop/address", shopAddressRouter);

app.use("/api/shop/order", shopOrderRouter);

app.use("/api/shop/search", shopSearchRouter);

// /api/auth/registerUser -> registerUser
// /api/auth/loginUser -> loginUser 

// Run the server
app.listen(PORT, () => console.log(`Server is now running on PORT : ${PORT}`));
