const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  forgotPassword,
  verifyOtp,
  resetPassword,
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

//API route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user",
    user,
  });
});

module.exports = router;
