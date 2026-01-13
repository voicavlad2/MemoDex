const { DataTypes } = require("sequelize");
/*
Tabela Subject
-materii pentru notite
Campuri:
-id(implicit,PK)
-name
-createdAt(implicit)
-updatedAt(implicit)
Relatii:
-Subject poate avea mai multe Notes
-Fiecare Note apartine unui Subject
*/
module.exports = (sequelize) => {
    return sequelize.define("Subject", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    });
};
