import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define("SharedNote", {
        permission: {
            type: DataTypes.ENUM("view", "edit"),
            allowNull: false,
            defaultValue: "view"
        },
    });
};
