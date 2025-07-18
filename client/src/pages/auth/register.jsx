import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import { registerUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const AuthRegister = () => {
  const initialState = {
    userName: "",
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data) => {
      console.log("data ===> ", data);
      if (data?.payload && data?.payload?.success) {
        showSnackbar({
          message: data?.payload.message,
          severity: "success",
        });
        navigate("/auth/login");
      } else {
        showSnackbar({
          message: data?.payload.message,
          severity: "error",
        });
      }
    });
  }
  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">
          Create New Account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            className="font-medium text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
};
