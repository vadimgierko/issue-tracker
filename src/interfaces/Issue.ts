export type IssueType = "bug" | "feature request" | "improvement";
export const issueTypes: IssueType[] = ["bug", "feature request", "improvement"];

export type IssuePriority = "high" | "medium" | "low";
export const issuePriorities: IssuePriority[] = ["high", "medium", "low"];

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

export interface IssuesFilterFormData {
	type: IssueType | ""
	priority: IssuePriority | ""
};

export interface IssuesFilterData extends IssuesFilterFormData {
  status: IssueTableTabStatus | ""
};


