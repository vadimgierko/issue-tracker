import { Dropdown } from "react-bootstrap";
import { Issue } from "../../../../interfaces/Issue";
import listifyIssues from "../../../../lib/listifyIssues";
import useIssues from "../../../../context/useIssues";
import { Link, useNavigate } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../lib/createAddIssueLinkWithParams";

export default function RecursiveList({
	issuesToList,
	root,
}: {
	issuesToList: Issue.AppIssue[]; // open & in progress project issues only
	root: string | null;
}) {
	const navigate = useNavigate();

	const { updateIssue } = useIssues();

	const rootIssues = issuesToList.filter((i) => !i.parent || i.parent === root);
	const rootIssuesOrdered = listifyIssues(rootIssues.filter((i) => i.ordered));
	const rootIssuesUnordered = rootIssues.filter((i) => !i.ordered);

	async function convertIntoOrdered(issueId: string) {
		const lastOrderedIssue =
			rootIssuesOrdered && rootIssuesOrdered.length
				? rootIssuesOrdered[rootIssuesOrdered.length - 1]
				: null;

		const issueToConvert = rootIssues.find((i) => i.id === issueId);

		if (issueToConvert) {
			const convertedIssue = {
				...issueToConvert,
				ordered: true,
				after: lastOrderedIssue ? lastOrderedIssue.id : null,
				before: null,
			};

			try {
				await updateIssue(convertedIssue);
				console.log("issue was converted into ordered succsessfully!");
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		}
	}

	async function convertIntoUnordered(issueId: string) {
		const issueToConvert = rootIssues.find((i) => i.id === issueId);

		if (issueToConvert) {
			const convertedIssue = {
				...issueToConvert,
				ordered: false,
				after: null,
				before: null,
			};

			try {
				await updateIssue(convertedIssue);
				console.log("issue was converted into unordered succsessfully!");
			} catch (error: any) {
				console.error(error);
				alert(error);
			}
		}
	}

	function RecursiveListItem({ i }: { i: Issue.AppIssue }) {
		return (
			<li>
				<div style={{ display: "flex" }}>
					<Link to={"/issues/" + i.id} className="me-1">
						{i.title}
					</Link>
					<span>{i.rank}/90</span>
					<Dropdown className="ms-2">
						<Dropdown.Toggle as="a" variant="outline-secondary" />

						<Dropdown.Menu>
							{i.ordered && (
								<Dropdown.Item
									onClick={() =>
										navigate(
											createAddIssueLinkWithParams(
												i.projectId,
												i.ordered ? i.ordered : false,
												i.id,
												i.before ? i.before : null
											)
										)
									}
								>
									+ add after
								</Dropdown.Item>
							)}

							{!i.ordered && (
								<Dropdown.Item onClick={() => convertIntoOrdered(i.id)}>
									transform into ordered
								</Dropdown.Item>
							)}
							{i.ordered && (
								<Dropdown.Item onClick={() => convertIntoUnordered(i.id)}>
									transform into unordered
								</Dropdown.Item>
							)}
						</Dropdown.Menu>
					</Dropdown>
					{i.children && i.children.length ? (
						<RecursiveList
							issuesToList={
								i.children
									.map((id) => issuesToList.find((iss) => iss.id === id))
									.filter((f) => f !== undefined) as Issue.AppIssue[]
							}
							root={i.id}
						/>
					) : null}
				</div>
			</li>
		);
	}

	return (
		<>
			{rootIssuesOrdered && rootIssuesOrdered.length ? (
				<ol>
					{rootIssuesOrdered.map((i) => (
						<RecursiveListItem key={i.id} i={i} />
					))}
				</ol>
			) : (
				<p>There are no ordered issues yet... Add one!</p>
			)}

			<hr />

			{rootIssuesUnordered && rootIssuesUnordered.length ? (
				<ul>
					{rootIssuesUnordered
						.sort((a, b) => b.rank - a.rank)
						.map((i) => (
							<RecursiveListItem key={i.id} i={i} />
						))}
				</ul>
			) : (
				<p>There are no unordered issues yet... Add one!</p>
			)}
		</>
	);
}
