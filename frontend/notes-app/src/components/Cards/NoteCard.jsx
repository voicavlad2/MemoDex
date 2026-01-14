import moment from "moment";
import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
	title,
	date,
	content,
	tags,
	isPinned,
	onEdit,
	onDelete,
	onPinNote,
	onClick,
}) => {
	return (
		<div
			onClick={onClick}
			className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out cursor-pointer"
		>
			<div className="flex items-center justify-between">
				<div>
					<h6 className="text-sm font-medium">{title}</h6>
					<span className="text-xs text-slate-500">
						{date ? moment(date).format("Do MMM YYYY") : "-"}
					</span>
				</div>

				<MdOutlinePushPin
					className={`icon-btn ${isPinned ? "text-primary" : "text-slate-300"
						}`}
					onClick={(e) => {
						e.stopPropagation();
						onPinNote();
					}}
				/>
			</div>

			<p className="text-xs text-slate-600 mt-2">
				{content
					? content.replace(/[#_*`>-]/g, "").slice(0, 80)
					: ""}
				{content?.length > 80 && "..."}
			</p>

			<div className="flex items-center justify-between mt-2">
				<div className="text-xs text-slate-500">
					{tags.map((item, index) => (
						<span key={index}>#{item} </span>
					))}
				</div>

				<div className="flex items-center gap-2">
					<MdCreate
						className="icon-btn hover:text-green-600"
						onClick={(e) => {
							e.stopPropagation();
							onEdit();
						}}
					/>
					<MdDelete
						className="icon-btn hover:text-red-500"
						onClick={(e) => {
							e.stopPropagation();
							onDelete();
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default NoteCard;
