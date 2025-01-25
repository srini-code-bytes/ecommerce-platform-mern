import { House, LogOut, Menu, ShoppingCart, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {

  const navigate = useNavigate();

  function handleNavigation(getCurrentMenuItem) {
    console.log("Inside handleNavigation() ===>")
    console.log("getCurrentMenuItem===>", getCurrentMenuItem)
    sessionStorage.removeItem("filters")

    // better to give it as null always in stead of {}
    const currentFilter = getCurrentMenuItem.id === "home" ? null : { category: [getCurrentMenuItem.id] }

    console.log("currentFilter===>", currentFilter)

    sessionStorage.setItem("filters", JSON.stringify(currentFilter))

    navigate(getCurrentMenuItem.path)

  }
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label onClick={() => handleNavigation(menuItem)}
          className="text-md font-medium cursor-pointer hover:text-primary hover:bg-gray-100 hover:ring-2 hover:ring-gray-300 rounded-md transition duration-200"
          key={menuItem.id}
        // to={menuItem.path}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}



function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const [openCartSheet, setopenCartSheet] = useState(false);
  const { cartItems } = useSelector(state => state.shopCart)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id))
  }, [dispatch])


  console.log("userrr====>", user)
  return (

    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setopenCartSheet(false)}>
        <Button onClick={() => setopenCartSheet(true)} variant="outline" size="icon">
          <ShoppingCart className="w-6 h-6" />
          <span className="sr-only">User cart</span>
        </Button>

        <UserCartWrapper setopenCartSheet={setopenCartSheet} cartItems={cartItems && cartItems?.items?.length > 0 ? cartItems.items : []} />

      </Sheet>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56 bg-white">
          <DropdownMenuLabel> Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <User className="mr-2 h-4 w-4" /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-6 w-6" />
          <span className="font-bold text-lg">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger className="bg-white" asChild>
            <Button variant="outline" siz="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs  bg-white">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
          <div className="hidden lg:block">
            <MenuItems />
          </div>

          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>

        </Sheet>
      </div>
    </header>
  );
}

export default ShoppingHeader;
