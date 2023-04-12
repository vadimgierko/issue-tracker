export interface Issue {
  id: string
	title: string
	description: string
  authorId: string
  projectId: string
	type: IssueType
  priority: IssuePriority
  status: IssueStatus
  created: number
  updated: number
}

export type IssueType = "bug" | "feature request" | "improvement"

export type IssuePriority = "high" | "medium" | "low"

// NOTE: I will not use "closed" status, because it doesn't provide specific info
export type IssueStatus = "open" | "in progress" | "resolved" | "abandoned" | "won't fix";

export interface IssueData {
	title: string
	description: string
	type: IssueType
  priority: IssuePriority
  status: IssueStatus
}
