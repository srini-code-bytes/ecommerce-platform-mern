import { Routes, Route } from "react-router-dom";
import { AuthLayout } from "./components/auth/layout";
import { AuthLogin } from "./pages/auth/login";
import { AuthRegister } from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import UserTable from "./pages/admin-view/users";
import AdminFeatures from "./pages/admin-view/features";
import PaypalReturnPage from "./pages/shopping-view/paypal-return";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
import SearchProducts from "./pages/shopping-view/search";
import ForgotPassword from "./pages/auth/forgot-password";
import VerifyOtp from "./pages/auth/verify-otp";
import FloatingGroqBot from "./components/common/floating-groq-bot";

function App() {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state) => state.auth
  );
  const authorizedUser = JSON.parse(localStorage.getItem("authorized"));
  console.log("authorizedUser : ", authorizedUser);
  // takes from local storage; if not authenticated then takes from check auth
  const isUserAuthenticated = authorizedUser?.isAuthenticated
    ? authorizedUser.isAuthenticated
    : isAuthenticated;
  const isUser = authorizedUser?.user ? authorizedUser.user : user;
  console.log("isUserAuthenticated : ", isUserAuthenticated);
  console.log("isUser : ", isUser);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800px] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <FloatingGroqBot />

      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isUserAuthenticated}
              user={isUser}
            ></CheckAuth>
          }
        ></Route>
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isUserAuthenticated} user={isUser}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isUserAuthenticated} user={isUser}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="users" element={<UserTable />} />
        </Route>

        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isUserAuthenticated} user={isUser}>
              <ShoppingLayout />
              {/* <AuthLayout /> */}
            </CheckAuth>
          }
        >
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
