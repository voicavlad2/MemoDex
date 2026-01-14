import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const API_BASE_URL = "http://localhost:8080";

const getYouTubeId = (url) => {
    const regExp =
        /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
    const match = url?.match(regExp);
    return match ? match[1] : null;
};

const SharedNote = () => {
    const { token } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/notes/shared/${token}`)
            .then((res) => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then((data) => setNote(data))
            .catch(() => setError("Notița nu există sau link invalid"));
    }, [token]);

    if (error) return <p>{error}</p>;
    if (!note) return <p>Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h2 className="text-2xl font-semibold">{note.title}</h2>

            <div className="text-xs text-slate-500 mb-4">
                Shared note (read-only)
            </div>

            {note.youtubeUrl && getYouTubeId(note.youtubeUrl) && (
                <div className="my-4 aspect-video">
                    <iframe
                        className="w-full h-full rounded"
                        src={`https://www.youtube.com/embed/${getYouTubeId(
                            note.youtubeUrl
                        )}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )}

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content}
            </ReactMarkdown>
        </div>
    );
};

export default SharedNote;
