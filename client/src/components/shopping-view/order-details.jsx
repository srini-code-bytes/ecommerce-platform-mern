import { useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useSelector } from "react-redux";



// function ShoppingOrderDetailsView({ orderDetails }) {

//     const { user } = useSelector((state) => state.auth)

//     console.log("orderDetails===>", orderDetails)


//     const initialFormData = {
//         status: ''

//     }

//     const [formData, setFormData] = useState(initialFormData);

//     function handleUpdateStatus() {
//         event.preventDefault();

//     }

//     return (
//         <DialogContent className="sm:max-w-[600px] bg-white">
//             <div className="grid gap-6">
//                 <div className="grid gap-2">
//                     <div className="flex items-center mt-6 justify-between">

//                         <div className="text-center text-xl">
//                             Order Details
//                         </div>

//                         <p className="font-medium">Order ID</p>
//                         <Label>
//                             {orderDetails?._id}
//                         </Label>
//                     </div>

//                     <div className="flex items-center mt-6 justify-between">

//                         <p className="font-medium">Order Date</p>
//                         <Label>
//                             {orderDetails?.orderDate.split("T")[0]}
//                         </Label>
//                     </div>

//                     <div className="flex items-center mt-6 justify-between">

//                         <p className="font-medium">Order Price</p>
//                         <Label>
//                             {orderDetails?.totalAmount}

//                         </Label>
//                     </div>

//                     <div className="flex items-center mt-6 justify-between">

//                         <p className="font-medium">Payment method</p>
//                         <Label>
//                             {orderDetails?.paymentMethod.charAt(0).toUpperCase() + orderDetails?.paymentMethod.slice(1)}
//                         </Label>
//                     </div>

//                     <div className="flex items-center mt-6 justify-between">

//                         <p className="font-medium">Payment status</p>
//                         <Label>
//                             {orderDetails?.paymentStatus.charAt(0).toUpperCase() + orderDetails?.paymentStatus.slice(1)}
//                         </Label>
//                     </div>

//                     <div className="flex items-center mt-6 justify-between">

//                         <p className="font-medium mb-2">Order Status</p>
//                         <Label>
//                             {orderDetails?.orderStatus.charAt(0).toUpperCase() + orderDetails?.orderStatus.slice(1)}
//                         </Label>
//                     </div>

//                     <Separator className="bg-gray-600" />

//                     <div className="grid-gap-4">
//                         <div className="grid-gap-2">
//                             <div className="font-medium mt-2">
//                                 Order Details
//                             </div>

//                             <ul className="grid-gap-3">
//                                 {orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ? orderDetails.cartItems.map((item) => (
//                                     <li className="flex items-center justify-between  text-gray-500">
//                                         <span>Title : {item?.title}</span>
//                                         <span>Quantity : {item?.quantity}</span>
//                                         <span>Price : {item?.price}</span>
//                                     </li>
//                                 )
//                                 ) : null}

//                             </ul>
//                         </div>
//                     </div>

//                     <div className="grid-gap-4">
//                         <div className="grid-gap-2">
//                             <div className="font-medium mt-2">
//                                 Shipping Info
//                             </div>

//                             <div className="grid gap-0.5 text-gray-500">
//                                 <span>{user?.userName}</span>
//                                 <span>{orderDetails?.addressInfo.address}</span>
//                                 <span>{orderDetails?.addressInfo.city}</span>
//                                 <span>{orderDetails?.addressInfo.phone}</span>
//                                 <span>{orderDetails?.addressInfo.pincode}</span>
//                                 <span>{orderDetails?.addressInfo.notes}</span>


//                             </div>
//                         </div>
//                     </div>


//                 </div>
//             </div>

//         </DialogContent>
//     );

// }

function ShoppingOrderDetailsView({ orderDetails }) {

    console.log("** ShoppingOrderDetailsView orderDetails**", orderDetails)

    const { user } = useSelector((state) => state.auth)

        return (
            <DialogContent className="sm:max-w-[600px] bg-white">
                <div className="grid gap-6">
                    <div className="text-center text-2xl font-bold mt-4">Order Details</div>
        
                    {/* Order Info */}
                    <div className="grid gap-4">
                        {[
                            { label: "Order ID", value: orderDetails._id },
                            { label: "Order Date", value: orderDetails.orderDate.split("T")[0] },
                            { label: "Order Price", value: orderDetails.totalAmount },
                            { label: "Payment Method", value: capitalize(orderDetails.paymentMethod) },
                            { label: "Payment Status", value: capitalize(orderDetails.paymentStatus) },
                            { label: "Order Status", value: capitalize(orderDetails.orderStatus) },
                        ].map((detail, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <p className="font-medium">{detail.label}</p>
                                <Label className="font-semibold text-gray-700">{detail.value}</Label>
                            </div>
                        ))}
                    </div>
        
                    <Separator className="bg-gray-600 mt-4" />
        
                    {/* Order Details Table */}
                    <div>
                        <div className="text-lg font-medium mb-2">Order Details</div>
                        {orderDetails && orderDetails.cartItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table-auto w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
                                            <th className="border border-gray-300 px-4 py-2 text-left">Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetails.cartItems.map((item, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{item.price}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-lg font-medium">No items in the cart.</p>
                        )}
                    </div>
        
                    <Separator className="bg-gray-900 mt-4" />
        
                    {/* Shipping Info */}
                    <div>
                        <div className="text-lg font-medium mb-2">Shipping Info</div>
                        <div className="grid gap-1 text-gray-500">
                            {[
                                user.userName?.replace("-", " "),
                                orderDetails?.addressInfo?.address || "Not Available",
                                orderDetails?.addressInfo?.city || "Not Available",
                                orderDetails?.addressInfo?.pincode || "Not Available",
                                orderDetails?.addressInfo?.phone || "Not Available",
                                orderDetails?.addressInfo?.notes || "No additional notes",
                            ].map((info, index) => (
                                <span key={index}>{info}</span>
                            ))}
                        </div>
                    </div>
        
                    {/* Order Status Form */}
                    {/* <div>
                        <CommonForm
                            formControls={[
                                {
                                    label: "Order Status",
                                    name: "status",
                                    componentType: "select",
                                    options: [
                                        { id: "pending", label: "Pending" },
                                        { id: "inProcess", label: "In Process" },
                                        { id: "inShipping", label: "In Shipping" },
                                        { id: "delivered", label: "Delivered" },
                                        { id: "rejected", label: "Rejected" },
                                    ],
                                },
                            ]}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={"Update Order Status"}
                            onSubmit={handleUpdateStatus}
                        />
                    </div> */}
                </div>
            </DialogContent>
        );
        
        // Helper function to capitalize strings
        function capitalize(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
        
    }

export default ShoppingOrderDetailsView;