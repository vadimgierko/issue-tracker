import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Link } from "react-router-dom";
import scrollToTop from "../../lib/scrollToTop";
import rehypeHighlight from "rehype-highlight";

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
			remarkPlugins={[remarkGfm]}
			rehypePlugins={[
				// enables rendering HTML tags:
				rehypeRaw,
				// enables code highlighting:
				// ❗WARNING!❗
				// to enable ✅ correct highlighting 👉 fetch css styles & always define language for code blocks
				// in this project I fetch CSS styles in <Layout /> !!!
				rehypeHighlight,
			]}
			components={{ a: ReactRouterLink }}
		>
			{markdown}
		</ReactMarkdown>
	);
}
