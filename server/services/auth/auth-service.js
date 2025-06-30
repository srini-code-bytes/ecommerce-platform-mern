
const sendEmail = require("../../helpers/send-email");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// forgot password

const sendOtp = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const otp = generateOtp();
  console.log("Generated OTP:", otp);
  const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  console.log("OTP expiry time:", otpExpiry);

  user.otp = otp;
  user.otpExpiry = otpExpiry;
  user.isOtpVerified = false; // Set to false initially

  await user.save();

  await sendEmail(email, otp); // Function to send OTP email

  return { message: "OTP sent to your email." };
};

//verify otp
const verifyOtp = async (email, otp) => {
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    console.log("Invalid OTP or OTP expired");
    throw new Error("Invalid or expired OTP");
  }

  user.isOtpVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();
  console.log("OTP verified successfully");
  return { message: "OTP verified successfully" };
};

const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email });

  if (!user || !user.isOtpVerified) {
    throw new Error("User not found or OTP is not verified");
  }

  const hashPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashPassword;
  user.isOtpVerified = false;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();
  return { message: "Password reset successfully" };
};

module.exports = { sendOtp, verifyOtp, resetPassword };
