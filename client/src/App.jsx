import { Routes, Route } from "react-router-dom"
import { AuthLayout } from "./components/auth/layout"
import { AuthLogin } from "./pages/auth/login"
import { AuthRegister } from "./pages/auth/register"
import AdminLayout from "./components/admin-view/layout"
import AdminDashboard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
import AdminFeatures from "./pages/admin-view/features"
import PaypalReturnPage from "./pages/shopping-view/paypal-return"
import ShoppingLayout from "./components/shopping-view/layout"
import NotFound from "./pages/not-found"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingCheckout from "./pages/shopping-view/checkout"
import ShoppingAccount from "./pages/shopping-view/account"
import CheckAuth from "./components/common/check-auth"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"
import PaymentSuccessPage from "./pages/shopping-view/payment-success"
import SearchProducts from "./pages/shopping-view/search"


function App() {

  const {isAuthenticated, user, isLoading} = useSelector(state => state.auth)
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(checkAuth())
  },[dispatch])

  if(isLoading) return <Skeleton className="w-[800px] bg-black h-[600px]" />

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      {/* <h1>Header component</h1> */}

      <Routes>
        <Route path="/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
        </CheckAuth>
        }>
        </Route>
        <Route path="/auth" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path="login" element={<AuthLogin />}/>
          <Route path="register" element={<AuthRegister />} />

        </Route>

        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
          <AdminLayout  />
        </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />}/>
          <Route path="products" element={<AdminProducts />}/>
          <Route path="orders" element={<AdminOrders />}/>
          <Route path="features" element={<AdminFeatures />}/>
        
        </Route>

        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
            {/* <AuthLayout /> */}
          </CheckAuth>
        }>
          <Route path="account" element={<ShoppingAccount />}/>
          <Route path="checkout" element={<ShoppingCheckout />}/>
          <Route path="home" element={<ShoppingHome />}/>
          <Route path="listing" element={<ShoppingListing />}/>
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        <Route> 
          <Route path="*" element={<NotFound />}/>
        </Route>
      
      </Routes>

    </div>
  )
}

export default App
