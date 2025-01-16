import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";



function ShoppingOrderDetailsView({ orderDetails }) {

    const { user } = useSelector((state) => state.auth)

    console.log("orderDetails===>", orderDetails)


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
                            {orderDetails?._id}
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Order Date</p>
                        <Label>
                            {orderDetails?.orderDate.split("T")[0]}
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Order Price</p>
                        <Label>
                            {orderDetails?.totalAmount}

                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Payment method</p>
                        <Label>
                            {orderDetails?.paymentMethod.charAt(0).toUpperCase() + orderDetails?.paymentMethod.slice(1)}
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium">Payment status</p>
                        <Label>
                            {orderDetails?.paymentStatus.charAt(0).toUpperCase() + orderDetails?.paymentStatus.slice(1)}
                        </Label>
                    </div>

                    <div className="flex items-center mt-6 justify-between">

                        <p className="font-medium mb-2">Order Status</p>
                        <Label>
                            {orderDetails?.orderStatus.charAt(0).toUpperCase() + orderDetails?.orderStatus.slice(1)}
                        </Label>
                    </div>

                    <Separator className="bg-gray-600" />

                    <div className="grid-gap-4">
                        <div className="grid-gap-2">
                            <div className="font-medium mt-2">
                                Order Details
                            </div>

                            <ul className="grid-gap-3">
                                {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? orderDetails.cartItems.map((item) => (
                                    <li className="flex items-center justify-between  text-gray-500">
                                        <span>Title : {item?.title}</span>
                                        <span>Quantity : {item?.quantity}</span>
                                        <span>Price : {item?.price}</span>
                                    </li>
                                )
                                ) : null}

                            </ul>
                        </div>
                    </div>

                    <div className="grid-gap-4">
                        <div className="grid-gap-2">
                            <div className="font-medium mt-2">
                                Shipping Info
                            </div>

                            <div className="grid gap-0.5 text-gray-500">
                                <span>{user?.userName}</span>
                                <span>{orderDetails?.addressInfo.address}</span>
                                <span>{orderDetails?.addressInfo.city}</span>
                                <span>{orderDetails?.addressInfo.phone}</span>
                                <span>{orderDetails?.addressInfo.pincode}</span>
                                <span>{orderDetails?.addressInfo.notes}</span>


                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </DialogContent>
    );

}

export default ShoppingOrderDetailsView;