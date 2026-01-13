const express = require("express");
const {SharedNote , Note, User, Group} = require("../../Models/database");

const router = express.Router();

//GET all shared notes
router.get("/:id", async(req,res) => {
    const shared = await SharedNote.findAll({include: [Note, User, Group]});
    res.json(shared);
});

//POST create create shared note
router.post("/", async(req,res) => {
    const {NoteId, UserId, GroupId, permission} = req.body;
    const shared = await SharedNote.create({NoteId, UserId, GroupId, permission});
    res.status(201).json(note);
})

//DELETE shared note
router.delete("/:id", async(req,res) => {
    const shared = await SharedNote.findByPk(req.params.id);
    if(!shared) {
        return res.status(404).json({error: "Shared note not found"});

    }
    await shared.destroy();
    res.json({message : "Shared note deleted"});
})

module.exports = router;
