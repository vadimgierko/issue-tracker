export namespace Issue {
	export type Type =
		| "bug"
		| "feature request"
		| "improvement"
		| "question"
		| "idea"
		| "documentation"
		| "suggestion"
		| "test"
		| "security"
		| "dependencies"
		| "refactor"
		| "other";

	export const allowedTypeValues: Type[] = [
		"bug",
		"security",
		"dependencies",
		"feature request",
		"improvement",
		"refactor",
		"documentation",
		"suggestion",
		"test",
		"question",
		"idea",
		"other",
	];

	//===================== helper type: ============================//

	export type Level = "high" | "medium" | "low";
	export const allowedLevels: Level[] = ["high", "medium", "low"];

	//===============================================================//

	export type Importance = Level;
	export const allowedImportanceValues = allowedLevels;

	export type Urgency = Level;
	export const allowedUrgencyValues = allowedLevels;

	export type EstimatedTime = Level;
	export const allowedEstimatedTimeValues = allowedLevels;

	export type Difficulty = Level;
	export const allowedDifficultyValues = allowedLevels;

	// NOTE:
	// I will not use "closed" status, because it doesn't provide specific info;
	// Instead all not "open" & not "in progress" issues are closed
	// if we select "closed" tab in issue table (see IssueTableTabStatus type below)
	export type Status =
		| "open"
		| "in progress"
		| "resolved"
		| "abandoned"
		| "won't fix";

	export const allowedStatuses: Status[] = [
		"open",
		"in progress",
		"resolved",
		"abandoned",
		"won't fix",
	];

	// IssueTableTabStatus is used to filter issues after selecting a tab in issue table,
	// so IssueTableTabStatus is the name of each possible tab,
	// where "closed" means all not "open" & not "in progress" issues:
	export type TableTabStatus = "open" | "in progress" | "closed" | "all";

	// this is what forms use:
	export interface Data {
		projectId: string;
		title: string;
		description: string;
		type: Type;
		urgency: Urgency;
		importance: Importance;
		estimatedTime: EstimatedTime;
		difficulty: Difficulty;
		status: Status;
		feature?: string;
		page?: string;
		component?: string;
	}

	export interface Issue extends Data {
		id: string;
		authorId: string;
		created: number;
		updated: number;
		inProgressFrom: number | null;
		closedAt: number | null;
	}

	export interface RankedIssue extends Issue {
		rank: number;
	}

	export type SortValue =
		| "newest"
		| "oldest"
		| "recently updated"
		| "least recently updated"
		| "highest ranked"
		| "lowest ranked"
		| "most important"
		| "least important"
		| "most urgent"
		| "least urgent"
		| "most difficult"
		| "less difficult"
		| "need more time"
		| "need less time";

	export const allowedSortValueValues: SortValue[] = [
		"newest",
		"oldest",
		"recently updated",
		"least recently updated",
		"highest ranked",
		"lowest ranked",
		"most important",
		"least important",
		"most urgent",
		"least urgent",
		"most difficult",
		"less difficult",
		"need more time",
		"need less time",
	];

	export interface FilterFormData {
		type: Type | "";
		urgency: Urgency | "";
		importance: Importance | "";
		estimatedTime: EstimatedTime | "";
		difficulty: Difficulty | "";
		feature: string | "";
		page: string | "";
		component: string | "";
	}
}
