/*
Tabela intermediara GroupMember
-Leaga User de Group
Campuri
-id(implicit,PK)
-role
-UserId(FK catre User)
-GroupId(FK catre Group)
-createdAt(implicit)
-updatedAt(implicit)
Relatii
-User poate sa fie membru in mai multe Groups
-Group poate sa aiba mai multi Users
*/


export const GroupMemberModel = (sequelize) => {
    return sequelize.define("GroupMember", {
        role: { type: DataTypes.STRING, defaultValue: "member" }, // admin/member
    });
};
