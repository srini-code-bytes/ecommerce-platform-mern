const Product = require('../../models/Product')

const searchProducts = async (req, res) => {
    try {

        // const { keyword } = req.params;
        const { searchTerm } = req.query;
        
        console.log("searchProducts searchTerm===>", typeof searchTerm)

        if (!searchTerm || typeof searchTerm !== 'string') {
            res.status(400).json({
                success: false,
                message: 'searchTerm is required and must be a string'
            })
        }

        // Create a reg expression
        const regEx = new RegExp(searchTerm, 'i')

        console.log("searchProducts regEx===>", regEx)


        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ]
        }

        console.log("searchProducts createSearchQuery===>", createSearchQuery)

        // search in db - for the above fields
        const searchResults = await Product.find(createSearchQuery)

        console.log("searchProducts searchResults===>", searchResults)

        res.status(200).json({
            success: true,
            data: searchResults
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })

    }
}

module.exports = { searchProducts }