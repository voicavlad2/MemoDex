require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const { Op } = require("sequelize");

const sequelize = require("./db");
const { User, Note, Group, GroupMember } = require("./models");
const { authenticateToken } = require("./utilities");

const app = express();


//  Middleware

app.use(express.json());
app.use(cors({ origin: "*" }));


//  Database Init

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync({ alter: true });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection failed:", error);
    }
})();

//  Health

app.get("/", (req, res) => {
    res.json({ data: "API running" });
});

//  Image Upload

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

app.post(
    "/upload-image",
    authenticateToken,
    upload.single("image"),
    (req, res) => {
        res.json({
            url: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
        });
    }
);

//  Auth

app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
        return res.status(400).json({ message: "All fields required" });

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.json({ message: "User already exists" });

    const user = await User.create({ fullName, email, password });

    const accessToken = jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "36000m" }
    );

    res.json({ user, accessToken });
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.password !== password)
        return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
        { user },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "36000m" }
    );

    res.json({ email, accessToken });
});

app.get("/get-user", authenticateToken, async (req, res) => {
    const user = await User.findByPk(req.user.user.id);
    if (!user) return res.sendStatus(401);
    res.json({ user });
});

//  Notes CRUD


app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags, youtubeUrl, groupId } = req.body;
    const { user } = req.user;

    if (!title || !content)
        return res.status(400).json({ message: "Title & content required" });

    const note = await Note.create({
        title,
        content,
        tags: tags || [],
        youtubeUrl: youtubeUrl || null,
        GroupId: groupId || null,
        userId: user.id,
    });


    res.json({ note });
});

app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const { title, content, tags, isPinned, youtubeUrl, groupId } = req.body;
    const { user } = req.user;

    const note = await Note.findOne({
        where: { id: req.params.noteId, userId: user.id },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    await note.update({
        title,
        content,
        tags,
        isPinned,
        youtubeUrl: youtubeUrl || null,
        GroupId: groupId || null,
    });


    res.json({ note });
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const notes = await Note.findAll({
        where: { userId: user.id },
        order: [["isPinned", "DESC"]],
    });
    res.json({ notes });
});

app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const { user } = req.user;
    await Note.destroy({
        where: { id: req.params.noteId, userId: user.id },
    });
    res.json({ success: true });
});

//  Search

app.get("/search-notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    const notes = await Note.findAll({
        where: {
            userId: user.id,
            [Op.or]: [
                { title: { [Op.iLike]: `%${query}%` } },
                { content: { [Op.iLike]: `%${query}%` } },
                { tags: { [Op.contains]: [query] } },
            ],
        },
    });

    res.json({ notes });
});

//  Share Note

app.post("/api/notes/:id/share", authenticateToken, async (req, res) => {
    const token = crypto.randomBytes(24).toString("hex");

    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    note.shareToken = token;
    note.isPublic = true;
    await note.save();

    res.json({
        shareLink: `${process.env.FRONTEND_URL}/shared/${token}`,
    });
});

app.get("/api/notes/shared/:token", async (req, res) => {
    const note = await Note.findOne({
        where: { shareToken: req.params.token, isPublic: true },
    });

    if (!note)
        return res.status(404).json({ message: "Invalid or expired link" });

    res.json(note);
});

//  Groups

app.get("/groups", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const memberships = await GroupMember.findAll({
        where: { UserId: user.id },
    });

    const groupIds = memberships.map((m) => m.GroupId);

    if (groupIds.length === 0) return res.json([]);

    const groups = await Group.findAll({
        where: { id: groupIds },
    });

    res.json(groups);
});

app.post("/groups/:groupId/invite", authenticateToken, async (req, res) => {
    try {
        const { email } = req.body;
        const { user } = req.user;
        const { groupId } = req.params;

        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }

        const invitedUser = await User.findOne({ where: { email } });
        if (!invitedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMember = await GroupMember.findOne({
            where: {
                GroupId: groupId,
                UserId: user.id,
            },
        });

        if (!isMember) {
            return res.status(403).json({ message: "Not a group member" });
        }

        await GroupMember.findOrCreate({
            where: {
                GroupId: groupId,
                UserId: invitedUser.id,
            },
        });

        res.json({ message: "Invite sent" });
    } catch (error) {
        console.error("Invite error:", error);
        res.status(500).json({ message: "Invite failed" });
    }
});


app.get("/groups/:groupId", authenticateToken, async (req, res) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) return res.sendStatus(404);
    res.json(group);
});

app.post("/groups", authenticateToken, async (req, res) => {
    const { name, description } = req.body;
    const { user } = req.user;

    if (!name) {
        return res.status(400).json({ message: "Group name required" });
    }

    const group = await Group.create({
        name,
        description,
        ownerId: user.id,
    });

    await GroupMember.create({
        GroupId: group.id,
        UserId: user.id,
    });

    res.json(group);
});

app.get("/groups/:groupId/notes", authenticateToken, async (req, res) => {
    const notes = await Note.findAll({
        where: { GroupId: req.params.groupId },
    });

    res.json(notes);
});

app.post("/groups/:groupId/leave", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { groupId } = req.params;

    const group = await Group.findByPk(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (group.ownerId === user.id) {
        return res.status(400).json({
            message: "Owner cannot leave the group",
        });
    }

    await GroupMember.destroy({
        where: {
            GroupId: groupId,
            UserId: user.id,
        },
    });

    res.json({ message: "Left group successfully" });
});



//  NoEmbed (API extern youtube)

app.get("/noembed", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ message: "URL required" });

    const response = await fetch(
        `https://noembed.com/embed?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();
    res.json(data);
});

//  Server

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

module.exports = app;
