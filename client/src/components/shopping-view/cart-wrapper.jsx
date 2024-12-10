import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";


function UserCartWrapper() {

    return <SheetContent className="sm:max-w-md back bg-white">
        <SheetHeader>
            <SheetTitle>
                My Cart
            </SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">

        </div>

        <div className="mt-8 space-y-4">
            <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">$1000</span>
            </div>
        </div>

        

        <Button className="w-full bg-black text-white rounded-[10px] hover:bg-gray-800 hover:shadow-lg transition-all duration-200 mt-4">
            Checkout
        </Button>


    </SheetContent>

}

export default UserCartWrapper;