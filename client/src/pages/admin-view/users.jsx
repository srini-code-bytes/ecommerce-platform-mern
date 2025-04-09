import { getAllUsers } from "@/store/admin/user-slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"


function UserTable() {
    const dispatch = useDispatch();
    const { usersList, isLoading, error } = useSelector((state) => state.adminAllUsers);

    useEffect(() => {
        dispatch(getAllUsers())
    }, [dispatch])

    return (

        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">List of All Users</h1>
            {isLoading ? (
                <p>Loading Users...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) :
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border">User ID</th>
                            <th className="px-4 py-2 border">User Name</th>
                            <th className="px-4 py-2 border">User Email</th>
                            <th className="px-4 py-2 border">User Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usersList?.length > 0 ? (
                                usersList.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-4 py-2 border text-center">{user._id}</td>
                                        <td className="px-4 py-2 border text-center">{user.userName}</td>
                                        <td className="px-4 py-2 border text-center">{user.email}</td>
                                        <td className="px-4 py-2 border text-center">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr> <td colSpan="4" className="text-center p-4">No users found</td>
                                </tr>
                            )

                        }
                    </tbody>
                </table>
            }

        </div>
    )
}

export default UserTable;