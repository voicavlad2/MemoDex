const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,

  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  members: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    role: { type: String, enum: ["admin", "member"], default: "member" }
  }],

  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
