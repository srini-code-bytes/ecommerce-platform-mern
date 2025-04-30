require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");

async function importProducts() {
    try {
        await mongoose
        .connect(
          "mongodb+srv://sriniv33613:sriniv336132024@cluster0.vj57d.mongodb.net/eCommerce-db-mern?retryWrites=true&w=majority",
        )

        console.log("Mongodb connected")

        const filePath = path.join(__dirname, "../test_data/products.json");
        const jsonData = fs.readFileSync(filePath, "utf-8");
        const products = JSON.parse(jsonData);

        await Product.insertMany(products);
        console.log(`Successfully inserted ${products.length} products into the db.`);

        process.exit();
    } catch (error) {
        console.error("Error importing products:", error);
        process.exit(1);
    }
}

importProducts();
