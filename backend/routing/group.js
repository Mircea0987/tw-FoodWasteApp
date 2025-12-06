const express = require("express");
const Group = require("../models/Group");
const router = express.Router();

router.route("/groups")
    .get(async (req, res) => {
        try {
            const groups = await Group.findAll();
            if (groups.length > 0) {
                res.status(200).json(groups);
            } else {
                res.status(404).json({ msg: "No groups found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .post(async (req, res) => {
        try {
            const newGroup = await Group.create(req.body);
            res.status(201).json({ msg: "Group created!", group: newGroup });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    });

router.route("/groups/:groupID")
    .put(async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.groupID);
            if (group) {
                await group.update(req.body);
                res.status(200).json({ msg: `Group ${req.params.groupID} updated!` });
            } else {
                res.status(404).json({ msg: "Group not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    })
    .delete(async (req, res) => {
        try {
            const group = await Group.findByPk(req.params.groupID);
            if (group) {
                await group.destroy();
                res.status(200).json({ msg: `Group ${req.params.groupID} deleted!` });
            } else {
                res.status(404).json({ msg: "Group not found!" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

module.exports = router;