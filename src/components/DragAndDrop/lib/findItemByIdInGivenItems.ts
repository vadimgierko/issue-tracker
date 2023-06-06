import { Item } from "../interfaces/Item";

export default function findItemByIdInGivenItems(
	id: number | null,
	items: Item[] = []
) {
	if (!id) return null;
	const item = items.find((i) => i.id === id);
	if (!item) return null;
	return item;
}
