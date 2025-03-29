import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useSnackbar } from "@/context/SnackbarContext";
import { loginUser } from "@/store/auth-slice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export const AuthLogin = () => {

  const initialState = {
    email : '',
    password: ''
  }

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar(); 

  function onSubmit(event){
    event.preventDefault()
    dispatch(loginUser(formData)).then((data) =>
    {
      console.log("Login data ===> ", data)
      if(data?.payload?.success){
        showSnackbar({
          message : data?.payload?.message,
          severity : "success"
        })
      } else{
        showSnackbar({
          message : data?.payload?.message,
          severity : "error"
        })
      }
    });

  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">Already have an account</p>
        <Link
          className="font-medium ml-2 text-primary hover:underline"
          to="/auth/register"
        >
          Don't have an account
        </Link>
      </div>
      <CommonForm 
      formControls = {loginFormControls}
      buttonText= {'Sign In'}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />

    </div>
  );
};

export default AuthLogin;