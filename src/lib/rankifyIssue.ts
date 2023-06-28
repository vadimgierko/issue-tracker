import { Issue } from "../interfaces/Issue";

export default function rankifyIssue(issue: Issue.DbIssue) {
	const typeRank: number = issue.type.length
		? [...Issue.allowedTypeValues].reverse().indexOf(issue.type) + 1 // we add + 1, because the first index of reversed array is 0
		: 0;
	const importanceRank: number = issue.importance.length
		? [...Issue.allowedImportanceValues].reverse().indexOf(issue.importance) + 1
		: 0;
	const urgencyRank: number = issue.urgency.length
		? [...Issue.allowedUrgencyValues].reverse().indexOf(issue.urgency) + 1
		: 0;
	const difficultyRank: number = issue.difficulty.length
		? [...Issue.allowedDifficultyValues].indexOf(issue.difficulty) // we DO NOT ADD + 1, because array starts from empty string
		: 0;
	const estimatedTimeRank: number = issue.estimatedTime.length
		? [...Issue.allowedEstimatedTimeValues].indexOf(issue.estimatedTime)
		: 0;

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
