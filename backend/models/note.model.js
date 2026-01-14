const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Note = sequelize.define(
	"Note",
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		tags: {
			type: DataTypes.ARRAY(DataTypes.STRING),
			defaultValue: [],
		},
		isPinned: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		youtubeUrl: {
			type: DataTypes.STRING,
			allowNull: true,
		},

		shareToken: {
			type: DataTypes.STRING,
			allowNull: true,
			unique: true,
		},
		isPublic: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	},
	{
		timestamps: true,
		createdAt: "createdOn",
		updatedAt: false,
	}
);

module.exports = Note;
