import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrderDetailsView from "./order-details";


function AdminOrdersView() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

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
                        <TableRow>
                            <TableCell>123456</TableCell>
                            <TableCell>30/12/2024</TableCell>
                            <TableCell>In Progress</TableCell>
                            <TableCell>$1000</TableCell>
                            <TableCell>
                                <Button onClick={() => setOpenDetailsDialog(true)} className="bg-black text-white">View Details</Button>
                            </TableCell>



                        </TableRow>


                    </TableBody>
                </Table>
            </CardContent>
            <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
                <AdminOrderDetailsView />
            </Dialog>

        </Card>
    )
}

export default AdminOrdersView;