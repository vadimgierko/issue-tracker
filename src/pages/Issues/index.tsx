import useIssues from "../../context/useIssues";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import IssuesTable from "./IssuesTable";

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
			<PageHeader pageTitle="Issues">
				<div className="text-center my-3">
					<Link to="/issues/add">
						<Button className="primary">Add Issue</Button>
					</Link>
				</div>
			</PageHeader>

			{loading ? (
				<Loading />
			) : issues && issues.length ? (
				<IssuesTable issues={issues} />
			) : (
				<NoIssues />
			)}
		</>
	);
}
