import useIssues from "../../context/useIssues";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import IssuesFilterableTable from "./IssuesFilterableTable";
import { AiOutlinePlusSquare } from "react-icons/ai";
import createAddIssueLinkWithParams from "../../lib/createAddIssueLinkWithParams";

export default function Issues() {
	const { issues, loading } = useIssues();

	function Loading() {
		return (
			<div className="text-center">
				<Spinner />
			</div>
		);
	}

	function NoIssues() {
		return <p className="text-center">There are no issues... Add one!</p>;
	}

	return (
		<>
			<PageHeader
				pageTitle={
					<span>
						Issues ({issues.length}){" "}
						<Link
							to={createAddIssueLinkWithParams(null, false, null, null, null)}
						>
							<AiOutlinePlusSquare />
						</Link>
					</span>
				}
			></PageHeader>

			{loading ? (
				<Loading />
			) : issues && issues.length ? (
				<IssuesFilterableTable issues={issues} />
			) : (
				<NoIssues />
			)}
		</>
	);
}
