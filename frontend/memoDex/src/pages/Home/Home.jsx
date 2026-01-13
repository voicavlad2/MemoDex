import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
// import { AddEditNotes } from "./AddEditNotes";

const Home = () => {
    return (
        <>
            <Navbar />

            <div className="container mx-auto">

                <div className="grid grid-cols-3 gap-4 mt-8">
                    <NoteCard
                        title="Metting"
                        date="3rd Apr 2026"
                        content="Meeting on 7th April"
                        tags="#Metting"
                        isPinned={true}
                        onEdit={() => { }}
                        onDelete={() => { }}
                        onPinNote={() => { }}
                    />
                </div>

            </div>

            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10 cursor-pointer" onClick={() => { }}>

                <MdAdd className="text-[32px] text-white" />

            </button>

            {/* <AddEditNotes /> */}
        </>
    )
}

export default Home;
