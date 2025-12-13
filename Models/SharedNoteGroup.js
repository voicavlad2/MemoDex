const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define(
        "SharedNoteGroup",
        {
            permission: {
                type: DataTypes.ENUM("view", "edit"),
                allowNull: false,
                defaultValue: "view",
            },
        },
        {
            indexes: [{ unique: true, fields: ["NoteId", "GroupId"] }],
        }
    );
};