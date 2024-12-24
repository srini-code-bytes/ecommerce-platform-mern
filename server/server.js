// To connect to the database

// Import 
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");  // Why?
const cors = require("cors"); // Why?
const authRouter = require("./routes/auth/auth-routes");
const { registerUser } = require("./controllers/auth/auth-controller");

const adminProductsRouter = require("./routes/admin/products-routes");

const shopProductsRouter = require('./routes/shop/products-routes')

const shopCartRouter = require('./routes/shop/cart-routes')

const shopAddressRouter = require('./routes/shop/address-routes')

// Create db connection
// create a separate file for this and import that file here --better approach

mongoose
  .connect(
    "mongodb+srv://sriniv33613:sriniv336132024@cluster0.vj57d.mongodb.net/"
  )
  .then(() => console.log("Mongo db is connected"))
  .catch((error) => console.log("error"));

const app = express();
const PORT = process.env.PORT || 8080; // Backend server will run at 8080

app.use(
  cors({
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

app.use("/api/shop/products", shopProductsRouter);

app.use("/api/shop/cart", shopCartRouter);

app.use("/api/shop/address", shopAddressRouter);

// /api/auth/registerUser -> registerUser
// /api/auth/loginUser -> loginUser 

app.listen(PORT, () => console.log(`Server is now running on PORT : ${PORT}`));
