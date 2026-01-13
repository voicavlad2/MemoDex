const express = require("express");
const { Group, User, Note } = require("../../Models/database");

const router = express.Router();

// GET all groups
router.get("/", async (req, res) => {
    const groups = await Group.findAll();
    res.json(groups);
});

// POST a group
router.post("/", async (req, res) => {
    const group = await Group.create(req.body);
    res.status(201).json(group);
});

// GET a group by id
router.get("/:id", async (req, res) => {
    const group = await Group.findByPk(req.params.id);
    res.json(group);
});

// ADD a user to group
router.post("/:id/users", async (req, res) => {
    const { userId } = req.body;
    const group = await Group.findByPk(req.params.id);
    const user = await User.findByPk(userId);

    if (!group || !user) {
        return res.status(404).json({ error: "Group or User not found" });
    }

    await group.addUser(user);
    res.json({ message: "User added to group" });
});

// GET group notes
router.get("/:id/notes", async (req, res) => {
    const group = await Group.findByPk(req.params.id, {
        include: Note
    });
    res.json(group);
});

module.exports = router;