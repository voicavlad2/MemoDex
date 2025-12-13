import { DataTypes } from "sequelize";

export default (sequelize) => {
    return sequelize.define("ExternalContent", {
        url: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
    });
};
