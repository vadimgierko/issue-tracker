import { Item } from "../interfaces/Item";

export default function convertIndexesIntoBeforeAfterRelation(items: Item[]) {
	if (!items) return [];

	const orderedItems: Item[] = items.filter((i) => i.ordered === true);
	const unorderedItems: Item[] = items.filter((i) => i.ordered === false);

	const orderedItemsConverted: Item[] = orderedItems.map((item, index) =>
		index === 0
			? { ...item, after: null, before: orderedItems[index + 1].id }
			: index === orderedItems.length - 1
			? { ...item, before: null, after: orderedItems[index - 1].id }
			: {
					...item,
					after: orderedItems[index - 1].id,
					before: orderedItems[index + 1].id,
			  }
	);

	const all: Item[] = [...orderedItemsConverted, ...unorderedItems];

	return all;
}
