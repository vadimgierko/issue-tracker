import { useState } from "react";
import { Issue } from "../../interfaces/Issue";

interface IssueFormProps {
	onSubmit: (e: React.FormEvent<HTMLFormElement>, issue: Issue) => void;
}

export default function IssueForm({ onSubmit }: IssueFormProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [type, setType] = useState<"bug" | "feature request" | "improvement">(
		"bug"
	);
	const [priority, setPriority] = useState<"high" | "medium" | "low">("high");
	const [status, setStatus] = useState<"open" | "closed">("open");

	function clearForm() {
		setTitle("");
		setDescription("");
		setType("bug");
		setPriority("high");
		setStatus("open");
	}

	return (
		<div className="add-issue-form">
			<h2 style={{ textAlign: "center" }}>Add Issue</h2>
			<form
				onSubmit={(e) => {
					const issue: Issue = { title, description, type, priority, status };
					onSubmit(e, issue);

					clearForm();
				}}
			>
				<label>
					Title:
					<br />
					<input
						value={title}
						placeholder="type issue title here"
						onChange={(e) => setTitle(e.target.value)}
					/>
				</label>
				<br />

				<label>
					Description:
					<br />
					<textarea
						value={description}
						placeholder="type issue description here"
						onChange={(e) => setDescription(e.target.value)}
					/>
				</label>
				<br />

				<label>
					Type:
					<br />
					<select
						value={type}
						onChange={(e) =>
							setType(
								e.target.value as "bug" | "feature request" | "improvement"
							)
						}
					>
						{["bug", "feature request", "improvement"].map((type) => (
							<option value={type} key={type}>
								{type}
							</option>
						))}
					</select>
				</label>
				<br />

				<label>
					Priority:
					<br />
					<select
						value={priority}
						onChange={(e) =>
							setPriority(e.target.value as "high" | "medium" | "low")
						}
					>
						{["high", "medium", "low"].map((priority) => (
							<option value={priority} key={priority}>
								{priority}
							</option>
						))}
					</select>
				</label>
				<br />

				<button>open issue</button>
			</form>
			<hr />
		</div>
	);
}
