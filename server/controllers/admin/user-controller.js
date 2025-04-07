
const User = require("../../models/User")

const getAllUsers = async (req, res) => {
    try {
        // Need to leverage Pagination component later
        const users = await User.find();
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getAllUsers } 
