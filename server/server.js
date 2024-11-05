const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const { registerUser } = require("./controllers/auth/auth-controller");

// create db connection
// create a separate file for this and import that file here --better approach

mongoose
  .connect(
    "mongodb+srv://sriniv33613:sriniv336132024@cluster0.vj57d.mongodb.net/"
  )
  .then(() => console.log("Mongo db is connected"))
  .catch((error) => console.log("error"));

const app = express();
const PORT = process.env.PORT || 8080;

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

// /api/auth/registerUser -> registerUser
// /api/auth/loginUser -> loginUser 

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
