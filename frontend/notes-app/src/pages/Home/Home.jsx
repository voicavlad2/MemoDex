import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddEditNotes from "./AddEditNotes";
import ViewNote from "./ViewNote";
import Toast from "../../components/ToastMessage/Toast";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import AddNotesImg from "../../assets/images/add-notes.svg";

const Home = () => {
    const [allNotes, setAllNotes] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [openViewModal, setOpenViewModal] = useState({
        isShown: false,
        data: null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add",
    });

    const navigate = useNavigate();

    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            type: "edit",
            data: noteDetails,
        });
    };

    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };

    const handleCloseToast = () => {
        setShowToastMsg({ isShown: false, message: "", type: "" });
    };

    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data?.notes) {
                setAllNotes(response.data.notes);
            }
        } catch {
            console.log("Error fetching notes");
        }
    };

    const deleteNote = async (note) => {
        try {
            const response = await axiosInstance.delete(
                "/delete-note/" + note.id
            );
            if (!response.data.error) {
                showToastMessage("Note Deleted Successfully", "delete");
                getAllNotes();
            }
        } catch {
            console.log("Error deleting note");
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data?.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query },
            });
            if (response.data?.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        } catch {
            console.log("Search error");
        }
    };

    const updateIsPinned = async (note) => {
        try {
            const response = await axiosInstance.put(
                "/update-note-pinned/" + note.id,
                { isPinned: !note.isPinned }
            );
            if (response.data?.note) {
                showToastMessage("Note Updated Successfully", "update");
                getAllNotes();
            }
        } catch {
            console.log("Pin error");
        }
    };

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    };

    useEffect(() => {
        getAllNotes();
        getUserInfo();
    }, []);

    return (
        <>
            <Navbar
                userInfo={userInfo}
                onSearchNote={onSearchNote}
                handleClearSearch={handleClearSearch}
            />

            <div className="container mx-auto">
                {isSearch && (
                    <h3 className="text-lg font-medium mt-5">
                        Rezultatele căutării
                    </h3>
                )}

                {allNotes.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {allNotes.map((item) => (
                            <NoteCard
                                key={item.id}
                                title={item.title}
                                content={item.content}
                                date={item.createdOn}
                                tags={item.tags}
                                isPinned={item.isPinned}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => deleteNote(item)}
                                onPinNote={() => updateIsPinned(item)}
                                onClick={() =>
                                    setOpenViewModal({ isShown: true, data: item })
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10 text-lg">
                        {isSearch
                            ? "Nu s-au găsit note pentru această căutare."
                            : "Nu există note încă. Apasă + pentru a crea una."}
                    </p>
                )}
            </div>

            <button
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() =>
                    setOpenAddEditModal({ isShown: true, type: "add", data: null })
                }
            >
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                overlayClassName="bg-black/20 fixed inset-0"
                className="w-[40%] max-h-[80%] bg-white rounded-md mx-auto mt-14 p-5 overflow-y-auto"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    onClose={() =>
                        setOpenAddEditModal({ isShown: false, type: "add", data: null })
                    }
                    showToastMessage={showToastMessage}
                    getAllNotes={getAllNotes}
                />
            </Modal>

            <Modal
                isOpen={openViewModal.isShown}
                overlayClassName="bg-black/30 fixed inset-0"
                className="w-[60%] max-h-[80%] bg-white rounded-md mx-auto mt-14 p-6 overflow-y-auto"
            >
                <ViewNote
                    note={openViewModal.data}
                    onClose={() =>
                        setOpenViewModal({ isShown: false, data: null })
                    }
                />
            </Modal>

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;
