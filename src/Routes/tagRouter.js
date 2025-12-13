const express = require("express");
const Tag = require("../../Models/database");

const router = express.Router();

//GET all tags
router.get("/", async(req, res) => {
    const tags = await Tag.findAll();
    res.json(tags);
});

module.exports = router;