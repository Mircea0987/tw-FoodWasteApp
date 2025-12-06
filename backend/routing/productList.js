const express = require("express");
const ProductList = require("../models/ProductList");
const router = express.Router();

router.route("/lists") 
    .get(async (req, res) => {
        try {
            const lists = await ProductList.findAll();
            if (lists.length > 0) {
                res.status(200).json(lists);
            } else {
                res.status(404).json({ msg: "No lists found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newList = await ProductList.create(req.body);
            res.status(201).json({ msg: "List created!", list: newList });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

router.route("/lists/:listID")
    .put(async (req, res) => {
        try {
            const list = await ProductList.findByPk(req.params.listID);
            if (list) {
                await list.update(req.body);
                res.status(200).json({ msg: `List ${req.params.listID} updated!` });
            } else {
                res.status(404).json({ msg: "List not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const list = await ProductList.findByPk(req.params.listID);
            if (list) {
                await list.destroy();
                res.status(200).json({ msg: `List ${req.params.listID} deleted!` });
            } else {
                res.status(404).json({ msg: "List not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

module.exports = router;