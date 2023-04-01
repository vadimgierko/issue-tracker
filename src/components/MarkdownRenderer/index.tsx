import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import scrollToTop from "../../lib/scrollToTop";

/**
 *
 * @returns `<Link />` from react-router-dom if the link is internal or `<a>` redirecting to a new tab if the link is external
 */
function ReactRouterLink(props: any) {
	return props.href.match(/^(https?:)?\/\//) ? (
		<a href={props.href} target="_blank" rel="noreferrer">
			{props.children}
		</a>
	) : (
		<Link to={props.href} onClick={scrollToTop}>
			{props.children}
		</Link>
	);
}

interface MarkdownRendererProps {
	markdown: string;
}

export default function MarkdownRenderer({ markdown }: MarkdownRendererProps) {
	if (!markdown) return null;

	return (
		<ReactMarkdown
			children={markdown}
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[rehypeRaw]} // enables rendering HTML tags
			components={{ a: ReactRouterLink }}
		/>
	);
}
