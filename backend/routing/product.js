const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const ProductList = require("../models/ProductList");
const Category = require("../models/Category");

const { authenticateToken } = require("../middleware/auth");

router.get("/products", authenticateToken, async (req, res) => {
  try {
    const fridge = await ProductList.findOne({ where: { UserID: req.user.id, Status: "private" } });
    if (!fridge) return res.status(400).json({ message: "Nu ai frigider." });

    const products = await Product.findAll({ where: { Status: "private" } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/marketplace", authenticateToken, async (req, res) => {
  try {
    const products = await Product.findAll({ where: { Status: "public" } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/products", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const fridge = await ProductList.findOne({ where: { UserID: userId } });
    if (!fridge) return res.status(400).json({ message: "Nu ai frigider asociat." });

    const { ProductName, CategoryID, CategoryName, Status, ExpirationDate, Description } = req.body;
    if (!ProductName || !CategoryID) return res.status(400).json({ message: "ProductName și CategoryID sunt obligatorii." });

    const [category] = await Category.findOrCreate({
      where: { CategoryID },
      defaults: { CategoryName }
    });

    const product = await Product.create({
      ProductName,
      CategoryID: category.CategoryID,
      Status: Status || "private",
      ExpirationDate,
      Description,
      ListID: fridge.ListID
    });

    res.status(201).json({ message: "Produs adăugat în frigider!", product });
  } catch (err) {
    console.error("ADD PRODUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.put("/products/:productID", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productID;
    const fridge = await ProductList.findOne({ where: { UserID: userId } });
    if (!fridge) return res.status(403).json({ message: "Nu ai frigider." });

    const product = await Product.findOne({ where: { ProductID: productId, ListID: fridge.ListID } });
    if (!product) return res.status(404).json({ message: "Produsul nu există sau nu îți aparține." });

    await product.update(req.body);
    res.json({ message: "Produs actualizat!", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/products/:productID", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productID;
    const fridge = await ProductList.findOne({ where: { UserID: userId } });
    if (!fridge) return res.status(403).json({ message: "Nu ai frigider." });

    const product = await Product.findOne({ where: { ProductID: productId, ListID: fridge.ListID } });
    if (!product) return res.status(404).json({ message: "Produsul nu a fost găsit sau nu îți aparține." });

    await product.destroy();
    res.json({ message: "Produs șters cu succes!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/share/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const fridge = await ProductList.findOne({ where: { UserID: userId } });
    if (!fridge) return res.status(400).json({ message: "Nu ai frigider." });

    const product = await Product.findOne({ where: { ProductID: productId, ListID: fridge.ListID } });
    if (!product) return res.status(404).json({ message: "Produsul nu îți aparține." });
    if (product.Status === "public") return res.status(400).json({ message: "Produsul este deja în Marketplace." });

    product.Status = "public";
    await product.save();

    res.json({ message: "Produsul a fost mutat în Marketplace.", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/products/claim/:id", authenticateToken, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const productId = req.params.id;
    const fridge = await ProductList.findOne({ where: { UserID: buyerId } });
    if (!fridge) return res.status(400).json({ message: "Nu ai frigider asociat." });

    const product = await Product.findOne({ where: { ProductID: productId, Status: "public" } });
    if (!product) return res.status(404).json({ message: "Produs indisponibil." });

    product.ListID = fridge.ListID; 
    product.Status = "private";
    await product.save();

    res.json({ message: "Produsul este acum în frigiderul tău!", product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
