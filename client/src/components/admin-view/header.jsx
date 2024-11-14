import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";

function AdminHeader({ setOpen }) {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button className="inline-flex gap-2 item-center text-sm font-medium shadow bg-black text-white px-4 py-2 rounded-[5px] hover:bg-gray-800">
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
