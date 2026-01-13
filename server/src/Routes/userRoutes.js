const express = require("express");
const { User } = require("../../Models/database");

const router = express.Router();

//GET all users
router.get("/:id", async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

//GET by id
router.get("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

//POST create user
router.post("/", async (req, res) => {
    const { email, name } = req.body;
    const user = await User.create({ email, name });
    res.status(201).json(user);
})

//PUT update user
router.put("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    await user.update(req.body);
    res.json(user);
})

//DELETE user
router.delete("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted" });
})

module.exports = router;