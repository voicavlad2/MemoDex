export const GroupMemberModel = (sequelize) => {
    return sequelize.define("GroupMember", {
        role: { type: DataTypes.STRING, defaultValue: "member" }, // admin/member
    });
};
