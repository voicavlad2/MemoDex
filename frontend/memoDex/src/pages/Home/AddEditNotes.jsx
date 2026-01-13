import React from "react";

const AddEditNotes = () => {
    return (
        <>
           <div className="flex flex-col gap=2">
                <label className="input-label">TITLE</label>
                <input type="text" className="text-2xt text-slate-950 outline-none" placeholder=""></input>
           </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea type="text" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded" placeholder="content" rows={10}></textarea>
            </div>
            <div className="mt-3">
                <label className="input-label">TAGS</label>
            </div>
            <button className="btn-primary font-medium mt-5 p-3" onClick={() => {}}>
                ADD
            </button>
        </>
    );
};

export default AddEditNotes;