import { Container } from "react-bootstrap";

export default function Footer() {
	const currentYear: number = new Date().getFullYear();

	return (
		<Container
			as="footer"
			style={{
				color: "grey",
			}}
		>
			<hr />
			<p className="text-center mb-0 pb-3">
				&copy;{" "}
				{currentYear === 2023
					? currentYear.toString()
					: "2023-" + currentYear.toString()}{" "}
				<a
					href="https://github.com/vadimgierko"
					target="_blank"
					rel="noreferrer"
					style={{ textDecoration: "none" }}
				>
					Vadim Gierko
				</a>{" "}
				<a
					href="https://github.com/vadimgierko/issue-tracker"
					target="_blank"
					rel="noreferrer"
					style={{ textDecoration: "none" }}
				>
					[app's code]
				</a>
			</p>
		</Container>
	);
}
