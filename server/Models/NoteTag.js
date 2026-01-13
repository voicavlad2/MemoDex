/*
Tabela intermediara NoteTag
-leaga Note de Tag
Campuri:
-id(implicit, PK)
-NoteId(FK catre note)
-TagId(FK catre Tag)
-createdAt(implicit)
-updatedAt(implicit)
Relatii:
-Note poate avea mai multe Tag
-Tag poate fi asociat cu mai multe Note
*/

module.exports = (sequelize) => {
    return sequelize.define("NoteTag", {});
};
