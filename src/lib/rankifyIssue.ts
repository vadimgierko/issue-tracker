import { Issue } from "../interfaces/Issue";

export default function rankifyIssue(issue: Issue.DbIssue) {
	const typeRank: number =
		[...Issue.allowedTypeValues].reverse().indexOf(issue.type) + 1;
	const importanceRank: number =
		[...Issue.allowedImportanceValues].reverse().indexOf(issue.importance) + 1;
	const urgencyRank: number =
		[...Issue.allowedUrgencyValues].reverse().indexOf(issue.urgency) + 1;
	const difficultyRank: number =
		[...Issue.allowedDifficultyValues].indexOf(issue.difficulty) + 1;
	const estimatedTimeRank: number =
		[...Issue.allowedEstimatedTimeValues].indexOf(issue.estimatedTime) + 1;

	const rankifiedIssue: Issue.AppIssue = {
		...issue,
		rank:
			typeRank * 5 +
			importanceRank * 4 +
			urgencyRank * 3 +
			difficultyRank * 2 +
			estimatedTimeRank,
	};

	return rankifiedIssue;
}
