import { Badge, Dropdown, Form } from "react-bootstrap";
import {
	BsArrowDown,
	BsArrowReturnRight,
	BsArrowRight,
	BsArrowUp,
	BsCheck2Square,
	BsDot,
	BsEye,
	BsPencilSquare,
	BsPlus,
	BsRocketTakeoff,
	BsTrash,
} from "react-icons/bs";
import RecursiveList from "..";
import { VscIssueReopened } from "react-icons/vsc";
import { Issue } from "../../../../../interfaces/Issue";
import useTheme from "../../../../../context/useTheme";
import useIssues from "../../../../../context/useIssues";
import { useNavigate, useParams } from "react-router-dom";
import createAddIssueLinkWithParams from "../../../../../lib/createAddIssueLinkWithParams";
import { AiOutlineDrag } from "react-icons/ai";
import { useState } from "react";

type RecursiveListItemProps = {
	i: Issue.AppIssue;
	addChildOrdered: (parentId: string) => Promise<void>;
	addChildUnordered: (parentId: string) => Promise<void>;
	moveDown: (issueId: string) => Promise<void>;
	moveUp: (issueId: string) => Promise<void>;
	convertIntoOrdered: (issueId: string) => Promise<void>;
	convertIntoUnordered: (issueId: string) => Promise<void>;
	//=================== D&D =============================//
	handleDragEnd: () => void;
	handleDragStart: (i: Issue.AppIssue | null) => void;
	handleDragOver: (i: Issue.AppIssue | null) => void;
};

export default function RecursiveListItem({
	i,
	addChildOrdered,
	addChildUnordered,
	moveDown,
	moveUp,
	convertIntoOrdered,
	convertIntoUnordered,
	//================= D&D ====================//
	handleDragStart,
	handleDragOver,
	handleDragEnd,
}: RecursiveListItemProps) {
	const { theme } = useTheme();
	const navigate = useNavigate();

	const [className, setClassname] = useState("draggable");

	const {
		issues,
		deleteIssue,
		reopenIssue,
		resolveIssue,
		setToInProgressIssue,
		showRank,
		findAllIssueChidrenRecursively,
		updateIssues,
	} = useIssues();

	const { projectId } = useParams();
	const projectIssues = issues.filter((i) => i.projectId === projectId);

	async function addAsAchildTo(newParentId: string) {
		const updatedIssue: Issue.AppIssue = {
			...i,
			parent: newParentId,
			ordered: false,
			after: null,
			before: null,
		};

		const beforeIssue = projectIssues.find((i) => i.id === i.after);

		const afterIssue = projectIssues.find((i) => i.id === i.before);

		const newParent = projectIssues.find(
			(i) => i.id === newParentId
		) as Issue.AppIssue;

		const updatedNewParent: Issue.AppIssue = {
			...newParent,
			children: newParent.children
				? [...newParent.children, updatedIssue.id]
				: [updatedIssue.id],
		};

		const updatedBefore: Issue.AppIssue | null = beforeIssue
			? { ...beforeIssue, before: i.before }
			: null;
		const updatedAfter: Issue.AppIssue | null = afterIssue
			? { ...afterIssue, after: i.after }
			: null;

		const updatedIssues = [
			updatedIssue,
			updatedNewParent,
			...(updatedBefore ? [updatedBefore] : []),
			...(updatedAfter ? [updatedAfter] : []),
		];

		updateIssues({ update: updatedIssues });
	}

	return (
		<li>
			<div style={{ display: "flex" }}>
				{i.ordered && (
					<span
						className={className + " mx-2"}
						draggable="true"
						onDragStart={() => {
							console.log("drag start", i.id);
							handleDragStart(i);
							setClassname("draggable dragging");
						}}
						onDragEnd={() => {
							console.log("drag end", i.id);
							setClassname("draggable");
							handleDragEnd();
						}}
						onDragOver={(e) => {
							e.preventDefault();
							console.log("over", i.id);
							handleDragOver(i);
						}}
					>
						<AiOutlineDrag />
					</span>
				)}
				<span
					style={{
						textDecoration: i.closedAt ? "line-through" : "",
						backgroundColor:
							i.status === "in progress" ? "rgb(50, 140, 113)" : "",
						color: i.status === "in progress" ? "white" : "",
					}}
				>
					{i.title}
				</span>{" "}
				{i.children && i.children.length ? (
					<Badge
						bg={theme === "dark" ? "light" : "dark"}
						className={`ms-1 text-${theme}`}
					>
						{
							findAllIssueChidrenRecursively(i).filter(
								(child) =>
									child.status !== "open" && child.status !== "in progress"
							).length
						}
						/{findAllIssueChidrenRecursively(i).length}
					</Badge>
				) : (
					""
				)}
				{showRank && <span className="ms-1">({i.rank}/90)</span>}
				<Dropdown className="ms-2">
					<Dropdown.Toggle as="a" variant="outline-secondary" />

					<Dropdown.Menu>
						{i.ordered && (
							<>
								<Dropdown.Item
									onClick={() =>
										navigate(
											createAddIssueLinkWithParams(
												i.projectId,
												true,
												i.id,
												i.before ? i.before : null,
												i.parent ? i.parent : null
											)
										)
									}
								>
									<BsArrowDown />
									<BsPlus /> add after
								</Dropdown.Item>

								<Dropdown.Item
									onClick={() =>
										navigate(
											createAddIssueLinkWithParams(
												i.projectId,
												true,
												i.after ? i.after : null,
												i.id,
												i.parent ? i.parent : null
											)
										)
									}
								>
									<BsArrowUp />
									<BsPlus /> add before
								</Dropdown.Item>

								<Dropdown.Divider />

								<Dropdown.Item onClick={() => moveUp(i.id)}>
									<BsArrowUp /> move up
								</Dropdown.Item>
								<Dropdown.Item onClick={() => moveDown(i.id)}>
									<BsArrowDown /> move down
								</Dropdown.Item>

								<Dropdown.Divider />

								<Dropdown.Item onClick={() => convertIntoUnordered(i.id)}>
									1. <BsArrowRight />
									<BsDot /> convert into unordered
								</Dropdown.Item>
							</>
						)}

						{!i.ordered && (
							<Dropdown.Item onClick={() => convertIntoOrdered(i.id)}>
								<BsDot />
								<BsArrowRight /> 1. convert into ordered
							</Dropdown.Item>
						)}

						<Dropdown.Divider />

						<Form.Select
							onChange={(e) => {
								console.log(e.target.value);

								const newParentId = e.target.value;

								addAsAchildTo(newParentId);
							}}
						>
							<option value="">add as a child to:</option>
							{projectIssues.map((i) => (
								<option value={i.id} key={i.id}>
									{i.title}
								</option>
							))}
						</Form.Select>

						<Dropdown.Divider />

						<Dropdown.Item onClick={() => addChildOrdered(i.id)}>
							<BsArrowReturnRight />
							<BsPlus /> 1. add ordered child
						</Dropdown.Item>

						<Dropdown.Item onClick={() => addChildUnordered(i.id)}>
							<BsArrowReturnRight />
							<BsPlus /> <BsDot /> add unordered child
						</Dropdown.Item>

						<Dropdown.Divider />

						{i.status && i.status === "open" && (
							<Dropdown.Item onClick={() => setToInProgressIssue(i)}>
								<BsRocketTakeoff />{" "}
								<span className="text-primary">in progress...</span>
							</Dropdown.Item>
						)}

						{i.status && (i.status === "open" || i.status === "in progress") ? (
							<Dropdown.Item onClick={() => resolveIssue(i)}>
								<BsCheck2Square className="text-success" />{" "}
								<span className="text-success">resolve</span>
							</Dropdown.Item>
						) : (
							<Dropdown.Item onClick={() => reopenIssue(i)}>
								<VscIssueReopened /> <span>reopen</span>
							</Dropdown.Item>
						)}

						<Dropdown.Divider />

						<Dropdown.Item onClick={() => navigate("/issues/" + i.id)}>
							<BsEye /> view
						</Dropdown.Item>

						<Dropdown.Item
							onClick={() => navigate("/issues/" + i.id + "/edit")}
						>
							<BsPencilSquare /> edit
						</Dropdown.Item>

						<Dropdown.Item onClick={() => deleteIssue(i)}>
							<BsTrash className="text-danger" />{" "}
							<span className="text-danger">delete</span>
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
			{i.children && i.children.length ? (
				<RecursiveList
					issuesToList={
						i.children
							.map((id) => issues.find((iss) => iss.id === id))
							.filter((f) => f !== undefined) as Issue.AppIssue[]
					}
					root={i.id}
				/>
			) : null}
		</li>
	);
}
