import { DataTypes } from "sequelize";

/*
Tabela Tags
-etichete pt organizare notite
Campuri:
-id(implicit, PK)
-name
-createdAt(implicit)
-updatedAt(implicit)
Relatii:
-Tag poate fi legat la Notes prin NoteTag
*/

export default (sequelize) => {
    return sequelize.define("Tag", {
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
    });
};
