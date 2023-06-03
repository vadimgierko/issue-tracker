import { BsArrowUpCircle } from "react-icons/bs";

export default function ScrollToTop() {
	return (
		<BsArrowUpCircle
			className="scroll-to-top do-not-display-when-print" // style & position is defined in index.css
			size={40}
			onClick={() => window.scrollTo({ top: 0 })}
		/>
	);
}
