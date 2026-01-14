import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";
import { MdClose, MdShare } from "react-icons/md";

const getYouTubeId = (url) => {
    const regExp =
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
};

const ViewNote = ({ note, onClose }) => {
    if (!note) return null;

    const handleShare = async () => {
        const res = await fetch(
            `http://localhost:8080/api/notes/${note.id}/share`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        const data = await res.json();
        navigator.clipboard.writeText(data.shareLink);
        alert("Link copiat!");
    };

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 flex gap-1">
                <button
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100"
                    onClick={handleShare}
                >
                    <MdShare className="text-xl text-slate-500" />
                </button>

                <button
                    className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-100"
                    onClick={onClose}
                >
                    <MdClose className="text-xl text-slate-500" />
                </button>
            </div>

            <h2 className="text-2xl font-semibold">{note.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
                {moment(note.createdOn).format("Do MMM YYYY")}
            </p>

            {note.youtubeUrl && getYouTubeId(note.youtubeUrl) && (
                <div className="my-4 aspect-video">
                    <iframe
                        className="w-full h-full rounded"
                        src={`https://www.youtube.com/embed/${getYouTubeId(
                            note.youtubeUrl
                        )}`}
                        title="YouTube video"
                        allowFullScreen
                    />
                </div>
            )}

            <hr className="my-4" />

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content}
            </ReactMarkdown>
        </div>
    );
};

export default ViewNote;
