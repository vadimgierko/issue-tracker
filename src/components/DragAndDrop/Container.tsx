import { useEffect, useState } from "react";
import DraggableItem from "./DraggableItem";
import { Item } from "./interfaces/Item";
import convertIndexesIntoBeforeAfterRelation from "./lib/convertIndexesIntoBeforeAfterRelation";
import listifyItems from "./lib/listifyItems";

export default function Container({
	items,
	setItems,
	root,
}: {
	items: Item[];
	setItems: React.Dispatch<React.SetStateAction<Item[]>>;
	root: number | null;
}) {
	const rootItems = items.filter((i) => !i.parent || i.parent === root);
	const rootItemsOrdered = listifyItems(rootItems.filter((i) => i.ordered));
	const rootItemsUnordered = rootItems.filter((i) => !i.ordered);

	const [dragging, setDragging] = useState<Item | null>(null);
	const [over, setOver] = useState<Item | null>(null);

	// this below is only for movement direction detecting:
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

		setOver(over);

		// this is only to set direction of the movement:
		const index = items.indexOf(over);

		if (index !== current) {
			setPrev(current);
			setCurrent(index);
		}
		//=============================================//

		if (dragging.ordered && over.ordered) {
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
		} else if (dragging.ordered && !over.ordered) {
			// convert into unordered
			// do not add dragging to reorderedItems =>
			// instead add converted dragging
			const convertedIntoUnordered: Item = {
				...dragging,
				ordered: false,
				after: null,
				before: null,
			};

			const reorderedItems: Item[] = items.reduce(
				(reordered: Item[], item: Item) => {
					if (item.id === over.id) {
						return direction === "down"
							? [...reordered, over, convertedIntoUnordered]
							: [...reordered, convertedIntoUnordered, over];
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
		} else if (!dragging.ordered && over.ordered) {
			// convert dragging into ordered
			// add draging to reorderedItems below (arr length++)
			// with over index
			const convertedIntoOrdered: Item = {
				...dragging,
				ordered: true,
			};

			const reorderedItems: Item[] = items.reduce(
				(reordered: Item[], item: Item) => {
					if (item.id === over.id) {
						return direction === "down"
							? [...reordered, over, convertedIntoOrdered]
							: [...reordered, convertedIntoOrdered, over];
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

		// NOTE: there is no else for both unordered items (for now)
		// because those items will be sorted by ranking or other prop
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
		<div className="container">
			<p>
				D&D Container with ordered & unordered items | direction{" "}
				{direction ? direction : "null"}
			</p>
			<hr />
			<p>Ordered:</p>
			<ol>
				{rootItemsOrdered.map((item, i) => (
					<DraggableItem
						key={item.id}
						item={item}
						handleDragEnd={handleDragEnd}
						handleDragStart={handleDragStart}
						handleDragOver={handleDragOver}
					/>
				))}
			</ol>

			<p>Unordered:</p>
			<ul>
				{rootItemsUnordered.map((item, i) => (
					<DraggableItem
						key={item.id}
						item={item}
						handleDragEnd={handleDragEnd}
						handleDragStart={handleDragStart}
						handleDragOver={handleDragOver}
					/>
				))}
			</ul>
		</div>
	);
}
