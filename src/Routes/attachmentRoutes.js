const express = require("express");
const {Attachment, Note} = require("../../Models/database");

const router = express.Router();

//GET all attachments
router.get("/:id", async(req,res) => {
    const attachments = await Attachment.findAll();
    res.json(attachments);
});

//POST create create attachment
router.post("/", async(req,res) => {
    const {url, NoteId} = req.body;
    const attachment = await Attachment.create({url, NoteId});
    res.status(201).json(attachment);
})

//DELETE shared attachment
router.delete("/:id", async(req,res) => {
    const attachment = await Attachment.findByPk(req.params.id);
    if(!attachment) {
        return res.status(404).json({error: "Attachment not found"});

    }
    await attachment.destroy();
    res.json({message : "Attachment deleted"});
})

module.exports = router;