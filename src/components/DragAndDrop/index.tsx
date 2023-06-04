import { useEffect, useState } from "react";
import Container from "./Container";
import { Item } from "./interfaces/Item";
import listifyItems from "./lib/listifyItems";

const initItems: Item[] = [
	{ id: 1, parent: 1, after: null, before: 2 },
	{ id: 2, parent: 1, after: 1, before: 3 },
	{ id: 3, parent: 1, after: 2, before: 4 },
	{ id: 4, parent: 1, after: 3, before: 5 },
	{ id: 5, parent: 1, after: 4, before: 6 },
	{ id: 6, parent: 1, after: 5, before: null },
];

export default function DragAndDropContainer() {
	const [items, setItems] = useState<Item[]>([]);

	// listify initial items before sent them to d&d,
	// after that they will be always listified:
	useEffect(() => setItems(listifyItems(initItems)), []);

	return <Container containerName={1} items={items} setItems={setItems} />;
}
