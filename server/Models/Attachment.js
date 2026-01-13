const { DataTypes } = require("sequelize");


// Tabela Attachments
// -fisiere atasate la notite
// Campuri:
// -id(implicit, PK)
// -url
// -NoteId
// -createdAt(implicit)
// -updatedAt(implicit)
// Relatii:
// -Attachments apartine unei Note


module.exports = (sequelize) => {
    return sequelize.define("Attachment", {
        url: { type: DataTypes.STRING, allowNull: false },
    });
};