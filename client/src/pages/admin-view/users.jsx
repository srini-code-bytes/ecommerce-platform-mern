import { getAllUsers } from "@/store/admin/user-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function getRoleColor(role){
    if(role === "admin"){
        return "bg-red-600"
    } else if(role === "user"){
        return "bg-green-500"
    } else {
        return "bg-black-400"
    }
}

function capitalizeRole(role){
    return role.charAt(0).toUpperCase() + role.slice(1);
}


function UserTable() {
    const dispatch = useDispatch();
    const { usersList, isLoading, error } = useSelector((state) => state.adminAllUsers);

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    return (

        // <div className="p-4">
        //     <h1 className="text-xl font-bold mb-4">List of All Users</h1>
        //     {isLoading ? (
        //         <p>Loading Users...</p>
        //     ) : error ? (
        //         <p className="text-red-500">{error}</p>
        //     ) :
        //         <table className="min-w-full border-collapse border border-gray-200">
        //             <thead>
        //                 <tr>
        //                     <th className="px-4 py-2 border">User ID</th>
        //                     <th className="px-4 py-2 border">User Name</th>
        //                     <th className="px-4 py-2 border">User Email</th>
        //                     <th className="px-4 py-2 border">User Role</th>
        //                 </tr>
        //             </thead>
        //             <tbody>
        //                 {
        //                     usersList?.length > 0 ? (
        //                         usersList.map((user) => (
        //                             <tr key={user._id}>
        //                                 <td className="px-4 py-2 border text-center">{user._id}</td>
        //                                 <td className="px-4 py-2 border text-center">{user.userName}</td>
        //                                 <td className="px-4 py-2 border text-center">{user.email}</td>
        //                                 <td className="px-4 py-2 border text-center">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
        //                             </tr>
        //                         ))
        //                     ) : (
        //                         <tr> <td colSpan="4" className="text-center p-4">No users found</td>
        //                         </tr>
        //                     )

        //                 }
        //             </tbody>
        //         </table>
        //     }

        // </div>
        <Card>
            <CardHeader>
                <CardTitle>
                    All Users
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-extrabold text-center">User ID</TableHead>
                            <TableHead className="font-extrabold text-center">User Name</TableHead>
                            <TableHead className="font-extrabold text-center">User Email</TableHead>
                            <TableHead className="font-extrabold text-center">User Role</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {
                            usersList && usersList?.length > 0
                                ? usersList.map((user) => (
                                    <TableRow>
                                        <TableCell className="text-center">{user?._id}</TableCell>
                                        <TableCell className="text-center">{user?.userName}</TableCell>
                                        <TableCell className="text-center">{user?.email}</TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={`py-1 px-3 text-black ${getRoleColor(user?.role)}`}>
                                                {capitalizeRole(user?.role)}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>

                                )) : null
                        }



                    </TableBody>
                </Table>
            </CardContent>


        </Card>
    )
}

export default UserTable;