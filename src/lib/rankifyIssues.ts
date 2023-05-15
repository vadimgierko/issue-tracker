import { Issue } from "../interfaces/Issue";

export default function rankifyIssues(
	issues: Issue.Issue[],
	sort: boolean = false
) {
	const rankifiedIssues: Issue.RankedIssue[] = issues.map((i) => {
		const typeRank: number =
			[...Issue.allowedTypeValues].reverse().indexOf(i.type) + 1;
		const importanceRank: number =
			[...Issue.allowedImportanceValues].reverse().indexOf(i.importance) + 1;
		const urgencyRank: number =
			[...Issue.allowedUrgencyValues].reverse().indexOf(i.urgency) + 1;
		const difficultyRank: number =
			[...Issue.allowedDifficultyValues].indexOf(i.difficulty) + 1;
		const estimatedTimeRank: number =
			[...Issue.allowedEstimatedTimeValues].indexOf(i.estimatedTime) + 1;
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
