const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

const UserModel = require("./User.js");
const NoteModel = require("./Note.js");
const TagModel = require("./Tag.js");
const NoteTagModel = require("./NoteTag.js");
const AttachmentModel = require("./Attachment.js"); 
const GroupModel = require("./Group.js");
const GroupMemberModel = require("./GroupMember.js");

const SharedNoteUserModel = require("./SharedNoteUser.js");
const SharedNoteGroupModel = require("./SharedNoteGroup.js");

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: isProd
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

const User = (UserModel.default || UserModel)(sequelize);
const Note = (NoteModel.default || NoteModel)(sequelize);

const Tag = (TagModel.default || TagModel)(sequelize);
const NoteTag = (NoteTagModel.default || NoteTagModel)(sequelize);

const Attachment = (AttachmentModel.default || AttachmentModel)(sequelize);

const Group = (GroupModel.default || GroupModel)(sequelize);
const GroupMember = (GroupMemberModel.default || GroupMemberModel)(sequelize);

const SharedNoteUser = (SharedNoteUserModel.default || SharedNoteUserModel)(sequelize);
const SharedNoteGroup = (SharedNoteGroupModel.default || SharedNoteGroupModel)(sequelize);

// Relations

// User - Note
User.hasMany(Note, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Note.belongsTo(User);

// Note - Tag
Note.belongsToMany(Tag, { through: NoteTag });
Tag.belongsToMany(Note, { through: NoteTag });

// Note - Attachment
Note.hasMany(Attachment, { onDelete: "CASCADE" });
Attachment.belongsTo(Note);

// User - Group
User.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(User, { through: GroupMember });

GroupMember.belongsTo(User);
GroupMember.belongsTo(Group);
User.hasMany(GroupMember);
Group.hasMany(GroupMember);

Note.belongsToMany(User, { through: SharedNoteUser, as: "SharedUsers" });
User.belongsToMany(Note, { through: SharedNoteUser, as: "NotesSharedWithMe" });

Note.belongsToMany(Group, { through: SharedNoteGroup, as: "SharedGroups" });
Group.belongsToMany(Note, { through: SharedNoteGroup, as: "SharedNotes" });

module.exports = {
  sequelize,
  User,
  Note,
  Tag,
  NoteTag,
  Attachment,
  Group,
  GroupMember,
  SharedNoteUser,
  SharedNoteGroup,
};
