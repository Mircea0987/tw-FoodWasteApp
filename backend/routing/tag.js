const express = require("express");
const Tag = require("../models/Tag");
const router = express.Router();

router.route("/tags")
    .get(async (req, res) => {
        try {
            const tags = await Tag.findAll();
            if (tags.length > 0) {
                res.status(200).json(tags);
            } else {
                res.status(404).json({ msg: "No tags found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newTag = await Tag.create(req.body);
            res.status(201).json({ msg: "Tag created!", tag: newTag });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

router.route("/tags/:tagID")
    .put(async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.tagID);
            if (tag) {
                await tag.update(req.body);
                res.status(200).json({ msg: `Tag with id ${req.params.tagID} updated!` });
            } else {
                res.status(404).json({ msg: "Tag not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const tag = await Tag.findByPk(req.params.tagID);
            if (tag) {
                await tag.destroy();
                res.status(200).json({ msg: `Tag with id ${req.params.tagID} deleted!` });
            } else {
                res.status(404).json({ msg: "Tag not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

module.exports = router;