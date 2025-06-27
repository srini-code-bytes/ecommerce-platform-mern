import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const AuthLogin = () => {
  const initialState = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
      console.log("Login data ===> ", data);
      if (data?.payload?.success) {
        showSnackbar({
          message: data?.payload?.message,
          severity: "success",
        });
      } else {
        showSnackbar({
          message: data?.payload?.message,
          severity: "error",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-8 p-8 bg-white shadow-lg rounded-lg">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-600">
          Sign in to your account to continue enjoying our services.
        </p>
        <p className="text-sm">
          <span className="text-gray-600">Don't have an account?</span>
          <Link
            className="font-medium ml-2 text-blue-600 hover:text-blue-500 underline"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <p className="text-center text-sm text-gray-500 mt-4">
        <Link
          className="text-blue-600 hover:text-blue-500 underline"
          to="/auth/forgot-password"
        >
          Forgot Password?
        </Link>
      </p>
      <div className="text-center text-sm text-gray-500 mt-6">
        <span
          className="hover:text-gray-700 cursor-pointer"
          title="Built with ❤️ by Srini"
        >
          Built with <span className="text-red-600">❤️</span> by Srini | E-Mart
        </span>
      </div>
    </div>
  );
};

export default AuthLogin;
