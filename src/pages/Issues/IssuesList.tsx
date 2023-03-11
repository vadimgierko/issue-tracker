import { useState } from "react";
import { Issue } from "../../interfaces/Issue";
import { getLocalStorageItem } from "../../lib/localStorage";

export default function IssuesList() {
	const [issues, setIssues] = useState<Issue[]>(getIssues());

	function getIssues() {
		const storedIssues = getLocalStorageItem("issues");

		if (storedIssues) return storedIssues;

		return [];
	}

	if (!issues || (issues && !issues.length))
		return <p>There are no issues stored in local storage. Add one!</p>;

	return (
		<ul>
			{issues.map((i) => (
				<li key={i.title}>
					<h3>
						{i.title} (<span style={{ color: "blue" }}>{i.type}</span> |{" "}
						<span style={{ color: "red" }}>{i.priority}</span>)
					</h3>
					<p>{i.description}</p>
					<hr />
				</li>
			))}
		</ul>
	);
}
