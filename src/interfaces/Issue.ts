export interface Issue {
	title: string
	description: string
  id: string
  authorId: string
  projectId: string
	type: IssueType
  priority: IssuePriority
  status: IssueStatus
}

export type IssueType = "bug" | "feature request" | "improvement"

export type IssuePriority = "high" | "medium" | "low"

export type IssueStatus = "open" | "closed"