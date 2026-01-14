import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdArrowBack } from "react-icons/md";

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    const fetchGroups = async () => {
        try {
            const res = await axiosInstance.get("/groups");
            setGroups(res.data);
        } catch (err) {
            console.error("Error fetching groups");
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="btn-secondary flex items-center gap-1"
                    >
                        <MdArrowBack />
                        Home
                    </button>

                    <h2 className="text-2xl font-semibold">Study Groups</h2>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => navigate("/groups/create")}
                >
                    Create Group
                </button>
            </div>

            {groups.length === 0 && (
                <p className="text-slate-500">No groups yet</p>
            )}

            {groups.map((group) => (
                <div
                    key={group.id}
                    className="border p-3 rounded mb-2 cursor-pointer hover:bg-slate-50"
                    onClick={() => navigate(`/groups/${group.id}`)}
                >
                    <h3 className="font-semibold">{group.name}</h3>
                    <p className="text-xs text-slate-500">{group.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Groups;
