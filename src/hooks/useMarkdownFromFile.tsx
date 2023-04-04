import { useState, useEffect } from "react";

/**

Custom hook for loading/ fetching Markdown from .md file located in /public folder.
@param {string} filePath a path to the location of .md file in /public folder, for example: "public/content/About.md"
@returns {{value: string, loading: boolean}} An object containing value prop, which contains markdown loaded from the .md file & loading prop, which is true if markdown is fetched.
*/
const useMarkdownFromFile = (
	filePath: string
): { value: string; loading: boolean } => {
	const [md, setMd] = useState<string>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		if (loading) {
			const getMd = async (filePath: string) => {
				if (!filePath)
					return console.error(
						"Cannot fetch markdown, because no file path passed..."
					);

				try {
					const res = await fetch(filePath);
					const mdText = await res.text();
					setLoading(false);
					setMd(mdText);
				} catch (err) {
					console.error(err);
				}
			};

			getMd(filePath);
		}
	}, [filePath, loading]);

	return { value: md || "", loading };
};

export default useMarkdownFromFile;
