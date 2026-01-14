const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const GroupMember = sequelize.define(
	"GroupMember",
	{},
	{
		timestamps: false,
	}
);

module.exports = GroupMember;
