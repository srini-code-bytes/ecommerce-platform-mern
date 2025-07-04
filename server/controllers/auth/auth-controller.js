const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const authService = require("../../services/auth/auth-service");
//register

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(req);
  try {
    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User is registered successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      e,
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    console.log("**checkUser**", checkUser);
    console.log("**checkUser id **", checkUser.id);
    console.log("**checkUser _id **", checkUser._id);

    if (!checkUser) {
      return res.json({
        success: false,
        message: "User does not exist, please register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password, please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser.id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.CLIENT_SECRET_KEY,
      { expiresIn: "30h" }
    );

    // Sending user data in cookies
    console.log("Token generated:", token);
    console.log("process.env.CLIENT_SECRET_KEY", process.env.CLIENT_SECRET_KEY);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true only in prod
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // allow cross-origin in prod
        maxAge: 30 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser.id,
          userName: checkUser.userName,
        },
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully.",
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.sendOtp(email);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);
    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//auth middleware

//like when we refresh the page

const authMiddleware = async (req, res, next) => {
  console.log("Auth middleware called");
  console.log("Cookies: ", req.cookies);
  const token = req.cookies.token; //getting from cookies
  console.log("Token from cookies:", token);
  if (!token) {
    console.log("No token found");
    return res.status(401).json({
      success: false,
      message: "Unauthorized user",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
    console.log("Token decoded:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Token verification failed:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  authMiddleware,
};
