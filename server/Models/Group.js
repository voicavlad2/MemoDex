const { DataTypes } = require("sequelize");

/*
Tabela Groups
-grupuri de studiu
Campuri
-id(implicit,PK)
-name
-description
-createdAt(implicit)
-updatedAt(implicit)
Relatii:
-Group poate avea mai multi Users prin GroupMember
-Group poate avea mai multe SharedNotes
*/

module.exports = (sequelize) => {
    return sequelize.define("Group", {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT, allowNull: true },
    });
};
