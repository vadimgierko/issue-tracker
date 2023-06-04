import { Item } from "../interfaces/Item";
import findItemByIdInGivenItems from "./findItemByIdInGivenItems";

export default function listifyItems(items: Item[] = []) {
	const sortedItems: Item[] = [];

	if (items && items.length) {
		const rootItem = items.find((i) => i.after === null);
		console.log("root item:", rootItem);
		// add root item:
		if (!rootItem) return sortedItems;

		sortedItems.push(rootItem);

		// add remaining ordered items based on what is next for prev item:
		for (let i = 0; i < items.length - 1; i++) {
			const item = sortedItems[sortedItems.length - 1];
			const itemAfter = findItemByIdInGivenItems(item.before, items);
			if (itemAfter) {
				sortedItems.push(itemAfter);
			}
		}
	}
	console.log("sorted items in listifyItems:", sortedItems);
	return sortedItems;
}
