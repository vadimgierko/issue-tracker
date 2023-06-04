import { useState } from "react";
import { Item } from "./interfaces/Item";

export default function DraggableItem({
	item,
	handleDragStart,
	handleDragOver,
	handleDragEnd,
}: {
	item: Item;
	handleDragEnd: () => void;
	handleDragStart: (item: Item | null) => void;
	handleDragOver: (item: Item | null) => void;
}) {
	const [className, setClassname] = useState("draggable");

	return (
		<li
			className={className}
			draggable="true"
			onDragStart={() => {
				console.log("drag start", item.id);
				handleDragStart(item);
				setClassname("draggable dragging");
			}}
			onDragEnd={() => {
				console.log("drag end", item.id);
				setClassname("draggable");
				handleDragEnd();
			}}
			onDragOver={(e) => {
				e.preventDefault();
				console.log("over", item.id);
				handleDragOver(item);
			}}
		>
			{item.id} after: {item.after ? item.after : "null"} before:{" "}
			{item.before ? item.before : "null"}{" "}
			{item.ordered ? "ordered" : "unordered"}
		</li>
	);
}
