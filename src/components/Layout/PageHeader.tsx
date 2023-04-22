type PageHeaderProps = {
	pageTitle: string | JSX.Element | React.ReactNode;
	children?: React.ReactNode;
};

/**
 * A page header component that displays a title and optional child elements under the title/ <h1> tag.
 * @param pageTitle - The title for the page header or React Element
 * @param children - Optional child elements to be included in the page header under the title/ <h1> tag.
 * @returns The PageHeader component
 */
export default function PageHeader({ pageTitle, children }: PageHeaderProps) {
	return (
		<header>
			<h1 className="text-center">{pageTitle}</h1>
			{children && children}
			<hr />
		</header>
	);
}
