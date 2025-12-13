const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    return sequelize.define("ExternalContent", {
        url: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false },
    });
};