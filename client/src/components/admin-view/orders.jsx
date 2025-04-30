import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetailsForAdmin } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";


function AdminOrdersView() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

    const { orderList, orderDetails, totalOrders, totalPages } = useSelector((state) => state.adminOrder)

    // Pagination 
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }

    const dispatch = useDispatch()

    function handleFetchOrderDetails(getId) {
        console.log("**getId**", getId)
        setOpenDetailsDialog(true);
        dispatch(getOrderDetailsForAdmin(getId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin({currentPage, limit}));
    }, [dispatch, currentPage, limit]);

    console.log("admin orderList===>", orderList, totalOrders, totalPages)

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    All Orders
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {
                            orderList && orderList.length > 0
                                ? orderList.map((orderItem) => (
                                    <TableRow>
                                        <TableCell>{orderItem?._id}</TableCell>

                                        <TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>

                                        <TableCell>
                                            <Badge
                                                className={`py-1 px-3 text-white ${orderItem?.orderStatus === "confirmed"
                                                    ? "bg-green-500"
                                                    : orderItem?.orderStatus === "rejected"
                                                        ? "bg-red-600"
                                                        : "bg-black"
                                                    }`}
                                            >
                                                {orderItem?.orderStatus.charAt(0).toUpperCase() + orderItem?.orderStatus.slice(1)}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>{orderItem?.totalAmount}</TableCell>

                                        <TableCell>
                                            <Dialog open={openDetailsDialog} onOpenChange={() => {
                                                setOpenDetailsDialog(false);
                                                dispatch(resetOrderDetailsForAdmin())
                                            }}>
                                                <Button onClick={() =>
                                                    handleFetchOrderDetails(orderItem?._id)
                                                } className="bg-black text-white">View Details</Button>

                                                {orderDetails && <AdminOrderDetailsView orderDetails={orderDetails} setOpenDetailsDialog={setOpenDetailsDialog} />}
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                )) : null
                        }
                    </TableBody>

                </Table>
                <div className="flex justify-between items-center mt-5">
                        <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-4 py-2 rounded bg-gray-200 text-black disabled:opacity-50">Previous
                        </button>

                        <p className="text-sm"> Page {currentPage} of {totalPages} </p>

                        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-4 py-2 bg-gray-200 text-black rounded disabled:opacity-50">Next
                        </button>
                    </div>
            </CardContent>
        </Card>
    )
}

export default AdminOrdersView;