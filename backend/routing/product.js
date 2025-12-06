const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

router.route("/products")
    .get(async (req, res) => {
        try {
            const products = await Product.findAll();
            if (products.length > 0) {
                res.status(200).json(products);
            } else {
                res.status(404).json({ msg: "No products found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newProduct = await Product.create(req.body);
            res.status(201).json({ msg: "Product created!", product: newProduct });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

router.route("/products/:productID")
    .put(async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.productID);
            if (product) {
                await product.update(req.body);
                res.status(200).json({ msg: `Product ${req.params.productID} updated!` });
            } else {
                res.status(404).json({ msg: "Product not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const product = await Product.findByPk(req.params.productID);
            if (product) {
                await product.destroy();
                res.status(200).json({ msg: `Product ${req.params.productID} deleted!` });
            } else {
                res.status(404).json({ msg: "Product not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

module.exports = router;