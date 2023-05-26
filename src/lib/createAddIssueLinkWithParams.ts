// NOTE: REMEMBER TO UPDATE /issues/add/* ROUTER LINK WHEN UPDATE THIS FUNCTION !!!

export default function createAddIssueLinkWithParams(
	projectId: string | null,
	ordered: boolean,
	after: string | null,
	before: string | null,
	parent: string | null
) {
	return `/issues/add/${projectId}/${ordered}/${after}/${before}/${parent}`;
}
