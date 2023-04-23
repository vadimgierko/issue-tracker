export type IssueType = "bug" | "feature request" | "improvement" | "question" | "idea" | "documentation" | "suggestion" | "test" | "security" | "dependencies" | "refactor" | "other"
export const issueTypes: IssueType[] = ["bug", "feature request", "improvement", "question", "idea", "documentation", "suggestion", "test", "security", "dependencies", "refactor", "other"];

export type IssueImportance = "high" | "medium" | "low";
export const issueImportance: IssueImportance[] = ["high", "medium", "low"];

export type IssueUrgency = "high" | "medium" | "low";
export const issueUrgency: IssueUrgency[] = ["high", "medium", "low"];

export type IssueEstimatedTime = "high" | "medium" | "low";
export const issueEstimatedTime: IssueEstimatedTime[] = ["high", "medium", "low"];

export type IssueDifficulty = "high" | "medium" | "low";
export const issueDifficulty: IssueDifficulty[] = ["high", "medium", "low"];

// NOTE:
// I will not use "closed" status, because it doesn't provide specific info;
// Instead all not "open" & not "in progress" issues are closed
// if we select "closed" tab in issue table (see IssueTableTabStatus type below)
export type IssueStatus = "open" | "in progress" | "resolved" | "abandoned" | "won't fix";
export const issueStatuses: IssueStatus[] = ["open", "in progress", "resolved", "abandoned", "won't fix"];

// IssueTableTabStatus is used to filter issues after selecting a tab in issue table,
// so IssueTableTabStatus is the name of each possible tab,
// where "closed" means all not "open" & not "in progress" issues:
export type IssueTableTabStatus = "open" | "in progress" | "closed" | "all"

export interface IssueData {
  projectId: string
	title: string
	description: string
	type: IssueType
  urgency: IssueUrgency
  importance: IssueImportance
  estimatedTime: IssueEstimatedTime
  difficulty: IssueDifficulty
  status: IssueStatus
}

export interface Issue extends IssueData {
  id: string
  authorId: string
  created: number
  updated: number
  inProgressFrom: number | null
  closedAt: number | null
}

export interface IssuesFilterFormData {
	type: IssueType | ""
  urgency: IssueUrgency | ""
  importance: IssueImportance | ""
  estimatedTime: IssueEstimatedTime | ""
  difficulty: IssueDifficulty | ""
};

export interface IssuesFilterData extends IssuesFilterFormData {
  status: IssueTableTabStatus | ""
};


