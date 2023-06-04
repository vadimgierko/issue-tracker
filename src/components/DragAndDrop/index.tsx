import { useEffect, useState } from "react";
import Container from "./Container";
import { Item } from "./interfaces/Item";

const initItems: Item[] = [
	{ id: 1, parent: null, after: null, before: 2, ordered: true },
	{ id: 2, parent: null, after: 1, before: 3, ordered: true },
	{ id: 3, parent: null, after: 2, before: 4, ordered: true },
	{ id: 4, parent: null, after: 3, before: 5, ordered: true },
	{ id: 5, parent: null, after: 4, before: 6, ordered: true },
	{ id: 6, parent: null, after: 5, before: null, ordered: true },
	{ id: 7, parent: null, after: null, before: null, ordered: false },
	{ id: 8, parent: null, after: null, before: null, ordered: false },
	{ id: 9, parent: null, after: null, before: null, ordered: false },
	{ id: 10, parent: null, after: null, before: null, ordered: false },
	{ id: 11, parent: null, after: null, before: null, ordered: false },
];

export default function DragAndDropContainer() {
	const [items, setItems] = useState<Item[]>([]);

	useEffect(() => setItems(initItems), []);

	return <Container root={null} items={items} setItems={setItems} />;
}
