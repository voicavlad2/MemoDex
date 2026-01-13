const express = require("express");
const {Note, Tag, Attachment} = require("../../Models/database");

const router = express.Router();

//GET all notes
router.get("/:id", async(req,res) => {
    const notes = await Note.findAll({include: [Tag, Attachment]});
    res.json(notes);
});

//GET by id
router.get("/:id", async (req,res) => {
    const note = await Note.findByPk(req.params.id, {include: [Tag, Attachment]});
    res.json(note);
});

//POST create note
router.post("/", async(req,res) => {
    const {title, content_markdown, course, date, userId, tagIds} = req.body;
    const note = await Note.create({title, content_markdown, course, date, userId, tagIds});
    if(tagIds) {
        await note.setTags(tagIds);
    }
    res.status(201).json(note);
})

//PUT update note
router.put("/:id", async(req,res) => {
    const note = await Note.findByPk(req.params.id);
    if(!note) {
        return res.status(404).json({error: "Note not found"});

    }
    const {title, content_markdown, course, date, tagIds} = req.body;
    await note.update(title, content_markdown, course, date);
    if(tagIds) {
        await note.setTags(tagIds);
    }
    res.json(note);
})

//DELETE user
router.delete("/:id", async(req,res) => {
    const note = await Note.findByPk(req.params.id);
    if(!note) {
        return res.status(404).json({error: "Note not found"});

    }
    await note.destroy();
    res.json({message : "Note deleted"});
})

module.exports = router;
