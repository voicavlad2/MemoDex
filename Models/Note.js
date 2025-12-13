import { DataTypes } from "sequelize";
import User from "./User";

/*
Tabela Notes
-stocheaza notitele studentilor
Campuri:
-id(implicit, PK)
-title
-content_markdown
-course
-date
-UserId(FK catre User)
-createdAt(implicit)
-updatedAt(implicit)
Relatii:
-Note apartine unei User
-Note poate avea mai multe Tags
-Note poate avea mai multe attachments
-Note poate fi partajata cu Users sau Groups
*/

export default (sequelize) => {
    return sequelize.define("Note", {
        title: { type: DataTypes.STRING, allowNull: false },
        content_markdown: { type: DataTypes.TEXT, allowNull: true },
        course: { type: DataTypes.STRING, allowNull: true },
        date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    });
};
