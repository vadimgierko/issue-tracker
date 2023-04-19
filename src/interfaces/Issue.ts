export type IssueType = "bug" | "feature request" | "improvement";
export const issueTypes: IssueType[] = ["bug", "feature request", "improvement"];

export type IssuePriority = "high" | "medium" | "low";
export const issuePriorities: IssuePriority[] = ["high", "medium", "low"];

// NOTE: I will not use "closed" status, because it doesn't provide specific info
export type IssueStatus = "open" | "in progress" | "resolved" | "abandoned" | "won't fix";
export const issueStatuses: IssueStatus[] = ["open", "in progress", "resolved", "abandoned", "won't fix"];

export interface IssueData {
	title: string
	description: string
	type: IssueType
  priority: IssuePriority
  status: IssueStatus
  projectId: string
}

export interface Issue extends IssueData {
  id: string
  authorId: string
  created: number
  updated: number
}

export interface IssuesFilterData {
	type: IssueType | ""
	priority: IssuePriority | ""
};


