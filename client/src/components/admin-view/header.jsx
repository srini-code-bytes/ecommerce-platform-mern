import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useThemeContext } from "@/context/ThemeContext";
import { useEffect } from "react";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const { mode, toggleMode } = useThemeContext();
  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header
      className={`flex items-center justify-between px-4 py-3 bg-background border-b
      ${mode === "light" ? "bg-white text-black" : "bg-black text-white"}`}
    >
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <button
          onClick={toggleMode}
          title="Toggle Light/Dark mode"
          className="mr-[12px] text-2xl "
        >
          {mode === "light" ? "☀️" : "🌙"}
        </button>
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 item-center text-sm font-medium shadow bg-black text-white px-4 py-2 rounded-[5px] hover:bg-gray-800"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
