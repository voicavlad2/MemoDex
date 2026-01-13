const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },

  tags: { type: [String], default: [] },
  isPinned: { type: Boolean, default: false },

  // 👤 USER ID ca STRING (așa cum vrei tu)
  userId: { type: String, required: true },

  // 📎 ATAȘAMENTE
  attachments: {
    type: [
      {
        fileName: String,
        fileType: String,
        fileUrl: String,
        uploadedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },

  // 🤝 SHARE CU USERI
  sharedWithUsers: {
    type: [
      {
        userId: String,
        permission: { type: String, enum: ["read", "edit"], default: "read" }
      }
    ],
    default: []
  },

  // 👥 SHARE CU GRUPURI
  sharedWithGroups: {
    type: [
      {
        groupId: String
      }
    ],
    default: []
  },

  // 🌐 SURSE EXTERNE
  externalSources: {
    type: [
      {
        type: {
          type: String,
          enum: ["youtube", "book", "conference", "website"]
        },
        title: String,
        sourceUrl: String,
        extraData: {
          timestamp: String,
          page: String,
          speaker: String,
          platform: String
        },
        addedAt: { type: Date, default: Date.now }
      }
    ],
    default: []
  },

  createdOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Note", noteSchema);
