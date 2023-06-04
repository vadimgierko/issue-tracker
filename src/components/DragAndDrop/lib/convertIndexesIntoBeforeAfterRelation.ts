import { Item } from "../interfaces/Item";

export default function convertIndexesIntoBeforeAfterRelation(items: Item[]) {
	if (!items) return [];

	const converted: Item[] = items.map((item, index) =>
		index === 0
			? { ...item, after: null, before: items[index + 1].id }
			: index === items.length - 1
			? { ...item, before: null, after: items[index - 1].id }
			: { ...item, after: items[index - 1].id, before: items[index + 1].id }
	);

	return converted;
}
