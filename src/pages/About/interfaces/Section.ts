import { Card } from "./Card";

export namespace Section {
	export interface Section {
		header: string;
		cardsList: Card.Card[];
		cardStyle: Card.Style;
	}
}
