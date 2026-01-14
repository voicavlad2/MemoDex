import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import ViewNote from "../Home/ViewNote";
import { MdArrowBack } from "react-icons/md";

const GroupDetails = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();

    const [group, setGroup] = useState(null);
    const [notes, setNotes] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [error, setError] = useState("");

    const fetchGroup = async () => {
        try {
            const res = await axiosInstance.get(`/groups/${groupId}`);
            setGroup(res.data);
        } catch {
            console.error("Error fetching group");
        }
    };

    const fetchNotes = async () => {
        try {
            const res = await axiosInstance.get(`/groups/${groupId}/notes`);
            setNotes(res.data);
        } catch {
            console.error("Error fetching notes");
        }
    };

    useEffect(() => {
        fetchGroup();
        fetchNotes();
    }, [groupId]);

    const handleInvite = async () => {
        if (!inviteEmail) return;

        try {
            await axiosInstance.post(`/groups/${groupId}/invite`, {
                email: inviteEmail,
            });
            alert("User invited successfully");
            setInviteEmail("");
        } catch (err) {
            alert("Invite failed");
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm("Are you sure you want to leave this group?")) return;

        try {
            await axiosInstance.post(`/groups/${groupId}/leave`);
            navigate("/groups");
        } catch (err) {
            alert(err.response?.data?.message || "Cannot leave group");
        }
    };

    if (!group) return null;

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-secondary flex items-center gap-1"
                >
                    <MdArrowBack />
                    Home
                </button>

                <button onClick={() => navigate("/groups")} className="btn-secondary">
                    Groups
                </button>
            </div>

            <h2 className="text-2xl font-semibold">{group.name}</h2>
            <p className="text-slate-500 mb-4">{group.description}</p>

            <div className="border p-3 rounded mb-4">
                <h3 className="font-semibold mb-2">Invite member</h3>
                <div className="flex gap-2">
                    <input
                        type="email"
                        className="border p-2 flex-1 rounded"
                        placeholder="email@stud.ase.ro"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <button className="btn-primary" onClick={handleInvite}>
                        Invite
                    </button>
                </div>
            </div>

            <button
                onClick={handleLeaveGroup}
                className="btn-secondary mb-6 text-red-600"
            >
                Leave Group
            </button>

            <h3 className="font-semibold mb-2">Group Notes</h3>

            {notes.length === 0 && (
                <p className="text-slate-500">No notes yet</p>
            )}

            {notes.map((note) => (
                <div key={note.id} className="border p-3 rounded mb-4">
                    <ViewNote note={note} />
                </div>
            ))}

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default GroupDetails;
