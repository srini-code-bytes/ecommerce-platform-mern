import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";



function ShoppingOrderDetailsView() {


    const initialFormData = {
        status: ''

    }

    const [formData, setFormData] = useState(initialFormData);

    function handleUpdateStatus() {
        event.preventDefault();

    }

    return (
        <DialogContent className="sm:max-w-[600px] bg-white">
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex items-center mt-6 justify-between">

                        <div className="text-center text-xl">
                            Order Details
                        </div>

                        <p className="font-medium">Order ID</p>
                        <Label>
                            123456
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Order Date</p>
                        <Label>
                            2/1/2025
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Order Price</p>
                        <Label>
                            $500
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Payment method</p>
                        <Label>
                            Paypal
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Payment status</p>
                        <Label>
                            Paid
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium mb-2">Order Status</p>
                        <Label>
                            Confirmed
                        </Label>
                    </div>

                    <Separator className="bg-gray-600" />

                    <div className="grid-gap-4">
                        <div className="grid-gap-2">
                            <div className="font-medium mt-2">
                                Order Details
                            </div>

                            <ul className="grid-gap-3">
                                <li className="flex items-center justify-between  text-gray-500">
                                    <span>Product One</span>
                                    <span>Price</span>
                                    <span>Quantity</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="grid-gap-4">
                        <div className="grid-gap-2">
                            <div className="font-medium mt-2">
                                Shipping Info
                            </div>

                            <div className="grid gap-0.5 text-gray-500">
                                <span>Virat Kohli</span>
                                <span>Delhi</span>
                                <span>India</span>
                                <span>ABC123</span>
                                <span>0619942004</span>
                                <span>Notes</span>


                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </DialogContent>
    );

}

export default ShoppingOrderDetailsView;