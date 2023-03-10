export interface Issue {
	title: string;
	description: string;
	type: "bug" | "feature request" | "improvement";
  priority: "high" | "medium" | "low";
  status: "open" | "closed"
}