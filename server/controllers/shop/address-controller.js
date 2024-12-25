const Address = require('../../models/Address');

const addAddress = async (req, res) => {
    try {
        console.log(req.body);
        // Get the data from the request
        const { userId, address, city, pincode, phone, notes } = req.body;

        // Check if the data is valid
        if (!userId || !address || !city || !pincode || !phone || !notes) {
            return res.status(400).json({
                success: false,
                message: 'Invalid data provided'
            });
        }

        // Create the address document
        const newlyCreatedAddress = new Address({ userId, address, city, pincode, phone, notes });

        await newlyCreatedAddress.save();
        res.status(200).json({
            success: true,
            message: 'Address added successfully',
            data: newlyCreatedAddress
        });

    } catch (error) {
        console.log(error);
        // Return a 500 response with error details
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
}

const fetchAllAddress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User id is required'
            });
        }

        const addressList = await Address.find({ userId })

        res.status(200).json({
            success: true,
            message: 'Address fetched successfully',
            data: addressList
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
}

const editAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        const formData = req.body;

        // Check if the data is valid
        if (!userId || !addressId) {
            return res.status(400).json({
                success: false,
                message: 'User id and address id is required'
            });
        }

        // Get the data from the request
        const address = await Address.findOneAndUpdate({
            userId,
            _id: addressId
        }, formData, { new: true });

        // Check if the address is found
        if (!address) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: address
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
}

const deleteAddress = async (req, res) => {
    try {
        const { userId, addressId } = req.params;
            
            // Check if the data is valid
            if (!userId || !addressId) {
                return res.status(400).json({
                    success: false,
                    message: 'User id and address id is required'
                });
            }
    
            // Get the data from the request
            const address = await Address.findOneAndDelete({
                userId,
                _id: addressId
            });
    
            // Check if the address is found
            if (!address) {
                return res.status(404).json({
                    success: false,
                    message: 'Address not found'
                });
            }
    
            res.status(200).json({
                success: true,
                message: 'Address deleted successfully',
                data: address
            });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Error'
        });
    }
}

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };