import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { MdArrowBack } from "react-icons/md";

const CreateGroup = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (!name) return;

        try {
            await axiosInstance.post("/groups", {
                name,
                description,
            });

            navigate("/groups");
        } catch (err) {
            console.error("Error creating group");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-secondary flex items-center gap-1"
                >
                    <MdArrowBack />
                    Home
                </button>

                <h2 className="text-xl font-semibold">Create Study Group</h2>
            </div>

            <input
                className="w-full border p-2 mb-2 rounded"
                placeholder="Group name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                className="w-full border p-2 mb-2 rounded"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <button className="btn-primary w-full" onClick={handleCreate}>
                Create
            </button>
        </div>
    );
};

export default CreateGroup;
