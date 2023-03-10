import React, { useState } from "react";
import "./App.css";
import IssueForm from "./components/IssueForm";
import { Issue } from "./interfaces/Issue";

function App() {
	const [issues, setIssues] = useState<Issue[]>([]);

	function addIssue(e: React.FormEvent<HTMLFormElement>, issue: Issue) {
		e.preventDefault();
		setIssues([...issues, issue]);
	}

	return (
		<div className="App">
			<header style={{ textAlign: "center" }}>
				<h1>Issue Tracker</h1>
			</header>

			<IssueForm onSubmit={addIssue} />

			<div className="issues">
				<h2 style={{ textAlign: "center" }}>Issues</h2>
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
			</div>
		</div>
	);
}

export default App;
