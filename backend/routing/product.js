const express = require("express");
const Product = require('../models/Product');
const User = require('../models/User');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

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

router.put('/share/:id', authenticateToken, async (req, res) => { 
    try {
        const productId = req.params.id;
        const userId = req.user.id; 

        const user = await User.findByPk(userId);
        if (!user || !user.ListID) {
            return res.status(400).json({ message: "Nu ai un frigider asociat pentru a putea partaja produse." });
        }

        const product = await Product.findOne({ 
            where: { 
                ProductID: productId, 
                ListID: user.ListID 
            } 
        });

        if (!product) {
            return res.status(404).json({ message: "Produsul nu a fost găsit sau nu îți aparține." });
        }

        if (product.Status === 'MARKETPLACE') {
             return res.status(400).json({ message: "Produsul este deja în Marketplace." });
        }

        product.Status = 'MARKETPLACE';
        await product.save();

        res.json({ message: "Produsul a fost adăugat în Marketplace!", product });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.put('/claim/:id', authenticateToken, async (req, res) => { 
    try {
        const productId = req.params.id;
        const buyerId = req.user.id; 

        const buyer = await User.findByPk(buyerId);
        if (!buyer) return res.status(404).json({ message: "User not found" });

        if (!buyer.ListID) {
            return res.status(400).json({ message: "Nu ai un frigider (ListID) asociat." });
        }

        const product = await Product.findOne({ 
            where: { 
                ProductID: productId, 
                Status: 'MARKETPLACE' 
            } 
        });

        if (!product) {
            return res.status(404).json({ message: "Produsul nu este disponibil sau a fost deja luat." });
        }

        product.ListID = buyer.ListID; 
        product.Status = 'FRIDGE'; 

        await product.save();

        res.json({ message: "Produsul este acum în frigiderul tău!", product });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;