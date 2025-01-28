const Product = require('../../models/Product')

const searchProducts = async (req, res) => {
    try {

        const { keyword } = req.params;
        if (!keyword || keyword !== 'string') {
            res.status(400).json({
                success: false,
                message: 'Keyword is required and must be a string'
            })
        }

        // Create a reg expression
        const regEx = new RegExp(keyword, 'i')


        const createSearchQuery = {
            $or: [
                { title: regEx },
                { description: regEx },
                { category: regEx },
                { brand: regEx },
            ]
        }

        // search in db - for the above fields
        const searchResults = await Product.find(createSearchQuery)

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