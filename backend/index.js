require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");
const StudyGroup = require("./models/studyGroup.model");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require('jsonwebtoken')
const{authenticateToken} = require("./utilities");

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req,res) => {
    res.json({data: "Hello"});
});

//CREATE ACCOUNT

app.post("/create-account",async(req,res) => {
    const {fullName,email,password} = req.body;
    if(!fullName){
        return res.status(400).json({error:true, message: "Full Name is required"});
    }
    if(!email){
        return res.status(400).json({error:true, message: "Email is required"});
    }
    if(!password){
        return res.status(400).json({error:true, message: "Password is required"});
    }
    const isUser = await User.findOne({email:email});
    if(isUser){
        return res.json({
            error:true,
            message: "User already exists",
        });
    }
    const user = new User({
        fullName, email, password,
    });

    await user.save();

    const accessToken = jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m"
    });

    return res.json({
        error:false,
        user,
        accessToken,
        message:"Registration successful"
    })
    
});

//GET USER

app.post("/get-user", authenticateToken ,async(req,res) => {
    const { user } = req.user;

    const isUser = await User.findOne({_id: user._id});
    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {fullname: isUser.fullName, email: isUser.email, "_id": isUser._id, createdOn: isUser.createdOn},
    })
    
});

//GET ALL USERS

app.get("/get-all-users", authenticateToken, async (req, res) => {
  try {
    const { user } = req.user;

    const users = await User.find(
      { _id: { $ne: user._id } }, // exclude user-ul curent
      { password: 0 }             // exclude parola
    ).select("_id fullName email");

    res.status(200).json({
      error: false,
      users
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error"
    });
  }
});



app.post("/login", async(req,res) => {
    const {email,password} = req.body;

    if(!email){
        return res.status(400).json({message: "Email is required"});
    }
    if(!password){
        return res.status(400).json({message: "Password is required"});
    }
    const userInfo = await User.findOne({email: email});
    if(!userInfo){
        return res.status(400).json({message: "User not found"});
    }
    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};
        const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: "3600m",
        });
        return res.json({
            error:false,
            message: "Login Successful",
            email,
            accessToken
        });
    } else {
        return res.status(400).json({
            error:true,
            message: "Invalid Credentials"
        })
    }
})

//ADD NOTE

app.post("/add-note",authenticateToken, async(req,res) => {
    const {title, content, tags} = req.body;
    const {user} = req.user;
    if(!title){
        return res.status(400).json({message: "Title is required"});
    }
    if(!content){
        return res.status(400).json({message: "Content is required"});
    }
    try{
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();

        return res.json({
            error:false,
            note,
            message: "Note added successfully"
        });

    }catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"

        });
    }
});

app.post("/edit-note/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId;
    const { title,content,tags,isPinned} = req.body;
    const {user} = req.user;

    if(!title && !content && !tags){
        return res.status(400).json({error: true, message:"No changes provided"});
    }

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"});
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(tags) note.tags = tags;
        if(isPinned) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",

        });

    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
     });
    }
})

//GET ALL NOTES

app.post("/get-all-notes", authenticateToken, async(req,res) => {
    const {user} = req.user;


    try{
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});
        return res.status(200).json({error: false, notes, message: "All notes received"});

    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
     });
    }
})

//GET NOTE

app.get("/notes/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { user } = req.user;

  const note = await Note.findOne({
    _id: noteId,
    $or: [
      { userId: user._id },
      { "sharedWithUsers.userId": user._id }
    ]
  });

  if (!note) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json({ note });
});



//SHARE NOTE

app.post("/share-note/user/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { email, permission } = req.body;
  const { user } = req.user;

  const targetUser = await User.findOne({ email });
  if (!targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const note = await Note.findOne({ _id: noteId, userId: user._id });
  if (!note) {
    return res.status(403).json({ message: "Not your note" });
  }

  note.sharedWithUsers.push({
    userId: targetUser._id,
    permission: permission || "read"
  });

  await note.save();

  res.json({ message: "Note shared successfully" });
});

//SEARCH NOTE

app.get("/search-notes", authenticateToken, async (req, res) => {
  const { q } = req.query;
  const { user } = req.user;

  const notes = await Note.find({
    content: { $regex: q, $options: "i" },
    userId: user._id
  });

  res.json({ notes });
});


// UPLOAD ATASAMENT

const upload = require("./middlewares/upload");

app.post(
  "/notes/:noteId/attachment",
  authenticateToken,
  upload.single("file"),
  async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.attachments.push({
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      fileUrl: `/uploads/${req.file.filename}`
    });

    await note.save();

    res.json({ message: "Attachment added", note });
  }
);







//GET VISIBLE NOTES/INLOCUIESTE GET ALL NOTES
app.post("/get-visible-notes", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const groups = await StudyGroup.find({
    "members.userId": user._id
  });

  const groupIds = groups.map(g => g._id);

  const notes = await Note.find({
    $or: [
      { userId: user._id },
      { "sharedWithUsers.userId": user._id },
      { "sharedWithGroups.groupId": { $in: groupIds } }
    ]
  }).sort({ isPinned: -1 });

  res.json({ notes });
});


//DELETE NOTE

app.post("/delete-note/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId;
    const {user} = req.user;

    try{
        const note = await Note.findOne({_id: noteId, userId: user._id});
        if(!note){
        return res.status(400).json({message: "Note not found"});
    }
    await Note.deleteOne({_id: noteId, userId: user._id});
    return res.status(200).json({error: false, message: "Note deleted"});


    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
     });
    }
})

//DELETE ATASAMENT


app.delete(
  "/notes/:noteId/attachment/:attachmentId",
  authenticateToken,
  async (req, res) => {
    const { noteId, attachmentId } = req.params;
    const { user } = req.user;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.attachments = note.attachments.filter(
      a => a._id.toString() !== attachmentId
    );

    await note.save();
    res.json({ message: "Attachment removed" });
  }
);



//UPDATE isPinned

app.post("/update-note-pinned/:noteId", authenticateToken, async(req,res) => {
    const noteId = req.params.noteId;
    const {isPinned} = req.body;
    const {user} = req.user;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user._id});
        if(!note){
            return res.status(404).json({error: true, message: "Note not found"});
        }

        note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",

        });

    } catch (error){
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
     });
    }
})

// CREARE GRUP

app.post("/create-group", authenticateToken, async (req, res) => {
  const { name, description } = req.body;
  const { user } = req.user;

  const group = new StudyGroup({
    name,
    description,
    ownerId: user._id,
    members: [{ userId: user._id, role: "admin" }]
  });

  await group.save();
  res.json({ group });
});

//INVITA IN GRUP

app.post("/groups/:groupId/invite", authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const { email } = req.body;
  const { user } = req.user;

  const group = await StudyGroup.findOne({
    _id: groupId,
    "members.userId": user._id,
    "members.role": "admin"
  });

  if (!group) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const invitedUser = await User.findOne({ email });
  if (!invitedUser) {
    return res.status(404).json({ message: "User not found" });
  }

  group.members.push({ userId: invitedUser._id });
  await group.save();

  res.json({ message: "User added to group" });
});


//GET GROUP 

app.get("/my-groups", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const groups = await StudyGroup.find({
    "members.userId": user._id
  }).select("_id name description");

  res.json({ groups });
});


//LEAVE GROUP

app.post("/groups/:groupId/leave", authenticateToken, async (req, res) => {
  const { groupId } = req.params;
  const { user } = req.user;

  const group = await StudyGroup.findById(groupId);
  group.members = group.members.filter(
    m => m.userId.toString() !== user._id.toString()
  );

  await group.save();
  res.json({ message: "Left group" });
});



//PARTAJARE NOTE CU GRUP

app.post("/share-note/group/:noteId", authenticateToken, async (req, res) => {
  const { noteId } = req.params;
  const { groupId } = req.body;
  const { user } = req.user;

  const note = await Note.findOne({ _id: noteId, userId: user._id });
  if (!note) {
    return res.status(403).json({ message: "Not your note" });
  }

  note.sharedWithGroups.push({ groupId });
  await note.save();

  res.json({ message: "Note shared with group" });
});

//ADAUGARE SURSA EXTERNA

app.post(
  "/notes/:noteId/add-source",
  authenticateToken,
  async (req, res) => {
    const { noteId } = req.params;
    const { user } = req.user;
    const { type, title, sourceUrl, extraData } = req.body;

    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.externalSources.push({
      type,
      title,
      sourceUrl,
      extraData
    });

    await note.save();

    res.json({ message: "External source added", note });
  }
);


const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;