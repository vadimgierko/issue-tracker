import { useEffect, useState } from "react";
import DraggableItem from "./DraggableItem";
import { Item } from "./interfaces/Item";
import convertIndexesIntoBeforeAfterRelation from "./lib/convertIndexesIntoBeforeAfterRelation";

export default function Container({
	items,
	setItems,
	containerName,
}: {
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
	containerName: number;
}) {
	//const [orderedItems, setOrderedItems] = useState<Item[]>([]);

	const [dragging, setDragging] = useState<Item | null>(null);
	const [over, setOver] = useState<Item | null>(null);

	const [direction, setDirection] = useState<"down" | "up" | null>(null);
	const [prev, setPrev] = useState<number | null>(null);
	const [current, setCurrent] = useState<number | null>(null);

	function handleDragStart(item: Item | null) {
		if (!item) return;
		setDragging(item);
		const index = items.indexOf(item);
		setCurrent(index);
		setPrev(index);
	}

	function handleDragOver(over: Item | null) {
		if (!dragging || !over) return;
		if (dragging.id === over.id) return;

		console.log("handling drag...");

		setOver(over);

		const index = items.indexOf(over);

		if (index !== current) {
			setPrev(current);
			setCurrent(index);
		}

		// reorder index position:
		const reorderedItems: Item[] = items.reduce(
			(reordered: Item[], item: Item) => {
				if (item.id === over.id) {
					return direction === "down"
						? [...reordered, over, dragging]
						: [...reordered, dragging, over];
				} else if (item.id === dragging.id) {
					return reordered;
				} else {
					return [...reordered, item];
				}
			},
			[]
		);

		const convertedIntoBeforeAfter: Item[] =
			convertIndexesIntoBeforeAfterRelation(reorderedItems);
		setItems(convertedIntoBeforeAfter);
	}

	function handleDragEnd() {
		if (!dragging || !over) return;
		if (dragging.id === over.id) return;

		// clear dragging state:
		setOver(null);
		setDragging(null);
		setCurrent(null);
		setPrev(null);
	}

	useEffect(() => console.log("set over:", over), [over]);
	useEffect(() => console.log("set dragging:", dragging), [dragging]);

	useEffect(() => {
		if (prev && current) {
			if (prev !== current) {
				const dir = current > prev ? "down" : "up";
				setDirection(dir);
			} else {
				setDirection(null);
			}
		}
	}, [current, prev]);

	if (!items) return null;

	return (
		<div
			className="container"
			onDragOver={(e) => {
				e.preventDefault();
			}}
		>
			<p>
				Container {containerName} direction {direction ? direction : "null"}
			</p>
			{items.map((item, i) => (
				<DraggableItem
					key={item.id}
					item={item}
					handleDragEnd={handleDragEnd}
					handleDragStart={handleDragStart}
					handleDragOver={handleDragOver}
				/>
			))}
		</div>
	);
}
