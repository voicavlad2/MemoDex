const User = require("./user.model");
const Note = require("./note.model");
const Group = require("./group.model");
const GroupMember = require("./groupMember.model");

User.hasMany(Group, { foreignKey: "ownerId" });
Group.belongsTo(User, { foreignKey: "ownerId" });

Group.belongsToMany(User, {
	through: GroupMember,
	foreignKey: "GroupId",
	otherKey: "UserId",
});

User.belongsToMany(Group, {
	through: GroupMember,
	foreignKey: "UserId",
	otherKey: "GroupId",
});

Group.hasMany(Note);
Note.belongsTo(Group);

User.hasMany(Note, { foreignKey: "userId", onDelete: "CASCADE" });
Note.belongsTo(User, { foreignKey: "userId" });

module.exports = { User, Note, Group, GroupMember };

