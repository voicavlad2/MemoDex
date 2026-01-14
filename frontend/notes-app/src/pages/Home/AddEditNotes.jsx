import React, { useEffect, useRef, useState } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose, MdImage } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({
    noteData,
    type,
    onClose,
    showToastMessage,
    getAllNotes,
}) => {
    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || []);
    const [youtubeUrl, setYoutubeUrl] = useState(noteData?.youtubeUrl || "");
    const [youtubeInfo, setYoutubeInfo] = useState(null);
    const [groupId, setGroupId] = useState(noteData?.groupId || "");
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    const imageInputRef = useRef(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axiosInstance.get("/groups");
                setGroups(res.data);
            } catch (err) {
                console.error("Error fetching groups");
            }
        };

        fetchGroups();
    }, []);

    const applyMarkdown = (start, end = "") => {
        const textarea = document.getElementById("note-content");
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;

        const selectedText = content.substring(selectionStart, selectionEnd);

        const newText =
            content.substring(0, selectionStart) +
            start +
            selectedText +
            end +
            content.substring(selectionEnd);

        setContent(newText);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(
                selectionStart + start.length,
                selectionEnd + start.length
            );
        }, 0);
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await axiosInstance.post("/upload-image", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            applyMarkdown(`![image](${res.data.url})`);
        } catch {
            setError("Image upload failed");
        }
    };

    const fetchYoutubeInfo = async () => {
        if (!youtubeUrl) return;

        try {
            const res = await fetch(
                `http://localhost:8080/noembed?url=${encodeURIComponent(youtubeUrl)}`
            );
            const data = await res.json();
            setYoutubeInfo(data);
        } catch {
            setError("Invalid YouTube link");
        }
    };

    const addNewNote = async () => {
        try {
            const res = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
                youtubeUrl,
                groupId,
            });

            if (res.data?.note) {
                showToastMessage("Note Added Successfully");
                getAllNotes();
                onClose();
            }
        } catch {
            setError("Error adding note");
        }
    };

    const editNote = async () => {
        try {
            const res = await axiosInstance.put("/edit-note/" + noteData.id, {
                title,
                content,
                tags,
                youtubeUrl,
                groupId,
            });

            if (res.data?.note) {
                showToastMessage("Note Updated Successfully", "update");
                getAllNotes();
                onClose();
            }
        } catch {
            setError("Error updating note");
        }
    };

    const handleSave = () => {
        if (!title) return setError("Title required");
        if (!content) return setError("Content required");

        setError(null);
        type === "edit" ? editNote() : addNewNote();
    };

    return (
        <div className="relative">
            <button
                className="absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400" />
            </button>

            <label className="input-label">GROUP</label>
            <select
                className="w-full border p-2 rounded mb-3"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
            >
                <option value="">Personal</option>
                {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                        {g.name}
                    </option>
                ))}
            </select>

            <label className="input-label">TITLE</label>
            <input
                className="text-2xl w-full outline-none mb-4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <div className="flex gap-2 mb-2 flex-wrap">
                <button onClick={() => applyMarkdown("**", "**")} className="btn-secondary font-bold">B</button>
                <button onClick={() => applyMarkdown("*", "*")} className="btn-secondary italic">I</button>
                <button onClick={() => applyMarkdown("~~", "~~")} className="btn-secondary">S</button>
                <button onClick={() => applyMarkdown("# ")} className="btn-secondary">H1</button>
                <button onClick={() => applyMarkdown("## ")} className="btn-secondary">H2</button>
                <button onClick={() => applyMarkdown("`", "`")} className="btn-secondary">{"</>"}</button>
                <button onClick={() => applyMarkdown("- ")} className="btn-secondary">• List</button>
                <button onClick={() => applyMarkdown("- [ ] ")} className="btn-secondary">☑</button>

                <button
                    onClick={() => imageInputRef.current.click()}
                    className="btn-secondary"
                >
                    <MdImage />
                </button>
            </div>

            <input
                type="file"
                accept="image/*"
                hidden
                ref={imageInputRef}
                onChange={(e) => handleImageUpload(e.target.files[0])}
            />

            <textarea
                id="note-content"
                rows={10}
                className="w-full bg-slate-50 p-2 rounded outline-none text-sm"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <label className="input-label mt-3">YouTube link (optional)</label>
            <input
                className="w-full p-2 border rounded"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
            />

            <button onClick={fetchYoutubeInfo} className="btn-secondary mt-2">
                Verify video
            </button>

            {youtubeInfo && (
                <div className="mt-2 border p-2 rounded">
                    <img src={youtubeInfo.thumbnail_url} alt="" />
                    <p className="font-semibold">{youtubeInfo.title}</p>
                    <p className="text-xs text-slate-500">
                        {youtubeInfo.author_name}
                    </p>
                </div>
            )}

            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

            <button className="btn-primary mt-4 p-3 w-full" onClick={handleSave}>
                {type === "add" ? "ADD NOTE" : "UPDATE NOTE"}
            </button>
        </div>
    );
};

export default AddEditNotes;
