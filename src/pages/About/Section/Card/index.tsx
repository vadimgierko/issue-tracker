import { Card as ICard } from "../../interfaces/Card";

export default function Card({
	card,
	cardStyle,
}: {
	card: ICard.Card;
	cardStyle: ICard.Style;
}) {
	if (!card) return null;

	return (
		<div className="text-center" style={cardStyle}>
			{card.icon}
			{card.header && <h5>{card.header}</h5>}
			{card.paragraph && <p>{card.paragraph}</p>}
		</div>
	);
}
