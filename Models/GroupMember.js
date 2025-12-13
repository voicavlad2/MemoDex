const { DataTypes } = require("sequelize");

// Tabela intermediara GroupMember
// leaga Users de Groups
// Campuri:
// id (implicit)
// role 
// UserId (FK)
// GroupId (FK)

module.exports = (sequelize) => {
    return sequelize.define("GroupMember",
        {
            role: {
                type: DataTypes.ENUM("member", "admin"),
                allowNull: false,
                defaultValue: "member",
            },
        },
        {
            indexes: [
                { unique: true, fields: ["UserId", "GroupId"] },
            ],
        }
    );
};