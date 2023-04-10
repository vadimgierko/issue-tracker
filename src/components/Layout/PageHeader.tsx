type PageHeaderProps = {
	pageTitle: string;
	children?: React.ReactNode;
};

/**
 * A page header component that displays a title and optional child elements under the title/ <h1> tag.
 * @param pageTitle - The title for the page header
 * @param children - Optional child elements to be included in the page header under the title/ <h1> tag.
 * @returns The PageHeader component
 */
export default function PageHeader({ pageTitle, children }: PageHeaderProps) {
	return (
		<header className="text-center">
			<h1>{pageTitle}</h1>
			{children && children}
			<hr />
		</header>
	);
}
