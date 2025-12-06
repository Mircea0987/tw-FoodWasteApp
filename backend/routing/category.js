const express = require("express");
const Category = require("../models/Category");
const router = express.Router();

router.route("/categories")
    .get(async (req, res) => {
        try {
            const categories = await Category.findAll();
            if (categories.length > 0) {
                res.status(200).json(categories);
            } else {
                res.status(404).json({ msg: "No categories found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newCategory = await Category.create(req.body);
            res.status(201).json({ msg: "Category created!", category: newCategory });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

router.route("/categories/:categoryID")
    .put(async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.categoryID);
            if (category) {
                await category.update(req.body);
                res.status(200).json({ msg: `Category ${req.params.categoryID} updated!` });
            } else {
                res.status(404).json({ msg: "Category not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const category = await Category.findByPk(req.params.categoryID);
            if (category) {
                await category.destroy();
                res.status(200).json({ msg: `Category ${req.params.categoryID} deleted!` });
            } else {
                res.status(404).json({ msg: "Category not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

module.exports = router;