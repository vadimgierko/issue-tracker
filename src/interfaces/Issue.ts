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
		"feature request",
		"improvement",
		"question",
		"idea",
		"documentation",
		"suggestion",
		"test",
		"security",
		"dependencies",
		"refactor",
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
	}

	export interface Issue extends Data {
		id: string;
		authorId: string;
		created: number;
		updated: number;
		inProgressFrom: number | null;
		closedAt: number | null;
	}

	export type SortValue =
		| "newest"
		| "oldest"
		| "recently updated"
		| "least recently updated"
		| "most urgent"
		| "least urgent"
		| "most important"
		| "least important"
		| "need more time"
		| "need less time"
		| "most difficult"
		| "less difficult";

	export const allowedSortValueValues: SortValue[] = [
		"newest",
		"oldest",
		"recently updated",
		"least recently updated",
		"most urgent",
		"least urgent",
		"most important",
		"least important",
		"need more time",
		"need less time",
		"most difficult",
		"less difficult",
	];

	export interface FilterFormData {
		type: Type | "";
		urgency: Urgency | "";
		importance: Importance | "";
		estimatedTime: EstimatedTime | "";
		difficulty: Difficulty | "";
	}
}
