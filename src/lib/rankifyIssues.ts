import { Issue } from "../interfaces/Issue";

export default function rankifyIssues(
	issues: Issue.DbIssue[] | Issue.AppIssue[],
	sort: boolean = false
): Issue.AppIssue[] {
	const rankifiedIssues: Issue.AppIssue[] = issues.map((i) => {
		const typeRank: number = i.type.length
			? [...Issue.allowedTypeValues].reverse().indexOf(i.type) + 1 // we add + 1, because the first index of reversed array is 0
			: 0;
		const importanceRank: number = i.importance.length
			? [...Issue.allowedImportanceValues].reverse().indexOf(i.importance) + 1
			: 0;
		const urgencyRank: number = i.urgency.length
			? [...Issue.allowedUrgencyValues].reverse().indexOf(i.urgency) + 1
			: 0;
		const difficultyRank: number = i.difficulty.length
			? [...Issue.allowedDifficultyValues].indexOf(i.difficulty) // we DO NOT ADD + 1, because array starts from empty string
			: 0;
		const estimatedTimeRank: number = i.estimatedTime.length
			? [...Issue.allowedEstimatedTimeValues].indexOf(i.estimatedTime)
			: 0;

		return {
			...i,
			rank:
				typeRank * 5 +
				importanceRank * 4 +
				urgencyRank * 3 +
				difficultyRank * 2 +
				estimatedTimeRank,
		};
	});

	if (sort) {
		return rankifiedIssues.sort((a, b) => b.rank - a.rank);
	} else {
		return rankifiedIssues;
	}
}
