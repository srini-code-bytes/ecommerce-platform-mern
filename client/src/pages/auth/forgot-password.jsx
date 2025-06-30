import React, { useState, useEffect } from "react";
import { useSnackbar } from "@/context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import CommonForm from "@/components/common/form";
import { useDispatch } from "react-redux";
import {
  forgotPassword,
  verifyOtp,
  resetPassword,
} from "@/store/forgot-password-slice";
import { use } from "react";

const ForgotPassword = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "" });
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    hasLetter: false,
    hasNumber: false,
    noSpace: false,
    passwordsMatch: false,
  });

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Countdown timer
  useEffect(() => {
    let timer;
    if (otpSent && secondsLeft > 0) {
      timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [secondsLeft, otpSent]);

  // Validate new password criteria
  useEffect(() => {
    const { newPassword, confirmNewPassword } = passwords;
    setPasswordCriteria({
      length: newPassword.length >= 8,
      hasLetter: newPassword.match(/[a-z]/i) && newPassword.match(/[A-Z]/i),
      hasNumber: newPassword.match(/\d+/),
      noSpace: newPassword.trim() === newPassword,
      passwordsMatch: newPassword === confirmNewPassword,
    });
  }, [passwords]);

  // Submit email to generate OTP
  const onSubmit = async (event) => {
    event.preventDefault();

    if (!isValidEmail(formData.email)) {
      showSnackbar({
        message: "Please enter a valid email address",
        severity: "error",
      });
      return;
    }

    try {
      await dispatch(forgotPassword(formData)).unwrap();
      // dispatch(forgotPassword(formData));
      showSnackbar({
        message: "OTP sent to your email",
        severity: "success",
      });
      setOtpSent(true);
      setSecondsLeft(60);
    } catch (error) {
      showSnackbar({
        message: "Server error. Please try again later.",
        severity: "error",
      });
      console.error(error);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!otp.trim()) {
      showSnackbar({ message: "Please enter the OTP", severity: "error" });
      return;
    }

    try {
      const res = await dispatch(
        verifyOtp({ email: formData.email, otp })
      ).unwrap();
      console.log("** res verifyOtp **", res);
      if (res.error) {
        throw new Error(res.error.message || "Error verifying OTP");
      }
      showSnackbar({
        message: "OTP verified successfully",
        severity: "success",
      });
      setIsOtpVerified(true);
      setSecondsLeft(0);
      setOtp("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      showSnackbar({
        message: "Invalid or expired OTP. Please try again.",
        severity: "error",
      });
      console.error(error);
    }
  };

  // Reset Password
  const handleResetPassword = (event) => {
    event.preventDefault();

    const { newPassword, confirmNewPassword } = passwords;
    if (!newPassword || !confirmNewPassword) {
      showSnackbar({ message: "Please fill in all fields", severity: "error" });
      return;
    }

    if (newPassword != confirmNewPassword) {
      showSnackbar({ message: "Passwords do not match", severity: "error" });
      return;
    }

    try {
      const res = dispatch(
        resetPassword({
          email: formData.email,
          newPassword: passwords.newPassword,
        })
      );
      if (res.error) {
        throw new Error(res.error.message || "Error resetting password");
      }
      showSnackbar({
        message: "Password reset successfully",
        severity: "success",
      });
      setFormData({ email: "" });
      setPasswords({ newPassword: "", confirmNewPassword: "" });
      setIsOtpVerified(false);
      setOtpSent(false);
      navigate("/auth/login");
    } catch (error) {
      console.error(error);
      showSnackbar({
        message: "Error resetting password",
        severity: "error",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-8 p-6 bg-white shadow-md rounded-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
        <p className="mt-2 text-gray-600">
          {isOtpVerified
            ? "Enter the new password"
            : otpSent
            ? "Enter the OTP sent to your email"
            : "Enter your email to receive an OTP"}
        </p>
      </div>

      {/* Email submission form */}
      <CommonForm
        formControls={[
          {
            name: "email",
            type: "email",
            label: "Email",
            placeholder: "Enter your email",
            required: true,
            disabled: isOtpVerified || otpSent,
          },
        ]}
        buttonText={otpSent ? "Resend OTP" : "Generate OTP"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        hideButton={isOtpVerified}
        isBtnDisabled={
          isOtpVerified ||
          !formData.email.trim() ||
          !isValidEmail(formData.email) ||
          (otpSent && secondsLeft > 0)
        }
      />

      {/* OTP input and verify section */}
      {!isOtpVerified && otpSent && (
        <form
          id="otp-form"
          onSubmit={handleVerifyOtp}
          className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm"
        >
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={!otp || secondsLeft <= 0}
          >
            Verify OTP {secondsLeft > 0 && `(${secondsLeft}s)`}
          </button>

          <div className="text-center text-sm text-gray-600">
            {secondsLeft > 0 ? (
              <span>OTP will expire in {secondsLeft} seconds</span>
            ) : (
              <span className="text-red-500">
                OTP expired. Please generate a new one.
              </span>
            )}
          </div>
        </form>
      )}

      {isOtpVerified && (
        <form
          id="reset-password-form"
          onSubmit={handleResetPassword}
          className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-sm"
        >
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={passwords.confirmNewPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmNewPassword: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            disabled={
              !passwords.newPassword ||
              !passwords.confirmNewPassword ||
              !passwordCriteria.length ||
              !passwordCriteria.hasLetter ||
              !passwordCriteria.hasNumber ||
              !passwordCriteria.noSpace ||
              !passwordCriteria.passwordsMatch
            }
          >
            Reset Password
          </button>

          <div className="text-sm text-gray-600">
            <p className="font-semibold">Password Criteria:</p>
            <ul className="list-disc list-inside space-y-1">
              <li
                className={
                  passwordCriteria.length ? "text-green-500" : "text-red-500"
                }
              >
                At least 8 characters
              </li>
              <li
                className={
                  passwordCriteria.hasLetter ? "text-green-500" : "text-red-500"
                }
              >
                Contains letters (uppercase and lowercase)
              </li>
              <li
                className={
                  passwordCriteria.hasNumber ? "text-green-500" : "text-red-500"
                }
              >
                Contains at least one number
              </li>
              <li
                className={
                  passwordCriteria.length > 0 && passwordCriteria.noSpace
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                No spaces allowed
              </li>
              <li
                className={
                  passwordCriteria.length > 0 && passwordCriteria.passwordsMatch
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                Passwords match
              </li>
            </ul>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
