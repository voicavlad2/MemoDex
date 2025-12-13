import { DataTypes } from "sequelize";

// Tabela Users
// -stocheaza studentii
// Campuri:
// -id (implicit, PK, autoincrementat)
// -email
// -name
// -createdAt(implicit)
// -updatedAt(implicit)
// Relatii:
// -User are mai multe Notes
// -User poate fi membru Group prin GroupMember
// -User poate avea acces la mai multe SharedNotes


export default (sequelize) => {
    return sequelize.define("User", {
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        name: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false },
    });
};
