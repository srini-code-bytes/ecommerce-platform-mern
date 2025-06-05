// MAIN ENTRY POINT 
// To connect to the database

const dotenv = require("dotenv"); // To use the environment variables from .env file

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

const adminUsersRouter = require("./routes/admin/user-routes")

const shopSearchRouter = require('./routes/shop/search-routes')

const shopReviewRouter = require('./routes/shop/review-routes')

const commonFeatureImagesRouter = require('./routes/common/feature-routes')

dotenv.config(); // To use the environment variables from .env file

// Create database connection
// create a separate file for this and import that file here --better approach

// take the below url from mongodb; make sure to give the password that you created in mongodb

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // So EB knows app failed to start
  });

const app = express(); // CREATE THE EXPRESS APP
const PORT = process.env.PORT || 8080; // Backend server will run on 8080

//To parse the cookie that we send from frontend
app.use(cookieParser());

// To get the response from backend in standard json format
app.use(express.json());


// To allow cross-origin requests
app.use(
  cors({
    // origin: process.env.FRONTEND_HOST_URL, 
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie"
    ],
    credentials: true,
  })
);



app.options("*", cors({
  // origin: process.env.FRONTEND_HOST_URL,
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductsRouter);

app.use("/api/admin/orders", adminOrderRouter);

app.use("/api/admin/users", adminUsersRouter);

app.use("/api/shop/products", shopProductsRouter);

app.use("/api/shop/cart", shopCartRouter);

app.use("/api/shop/address", shopAddressRouter);

app.use("/api/shop/order", shopOrderRouter);

app.use("/api/shop/search", shopSearchRouter);

app.use("/api/shop/review", shopReviewRouter);

app.use("/api/common/feature-images", commonFeatureImagesRouter)


// /api/auth/registerUser -> registerUser
// /api/auth/loginUser -> loginUser 

// API designed to write things to the

console.log("Starting Express app on:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "Present" : "Missing");


app.listen(PORT, () => console.log(`Server is now running on PORT : ${PORT}`));



