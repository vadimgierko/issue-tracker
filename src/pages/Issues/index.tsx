import { useState, useEffect } from "react";
import useIssues from "../../context/useIssues";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";
import PageHeader from "../../components/Layout/PageHeader";
import IssuesTable from "./IssuesTable";
import IssuesFilterForm from "./IssuesFilterForm";
import { IssuesFilterData } from "../../interfaces/Issue";

export default function Issues() {
	const { issues, loading } = useIssues();
	const [filteredIssues, setFilteredIssues] = useState(issues);

	function filterIssues(filterData: IssuesFilterData) {
		const filteredItems = issues.filter((item) => {
			return (
				(!filterData.priority || item.priority === filterData.priority) &&
				(!filterData.status || item.status === filterData.status) &&
				(!filterData.type || item.type === filterData.type)
			);
		});

		setFilteredIssues(filteredItems);
	}

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

	function NoFilteredIssues() {
		return (
			<p className="text-center">
				No issues are found that match the filter criteria...
			</p>
		);
	}

	useEffect(() => {
		if (loading) return;

		setFilteredIssues(issues);
	}, [issues, loading]);

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
				<>
					<IssuesFilterForm onSubmit={filterIssues} />
					{filteredIssues && filteredIssues.length ? (
						<IssuesTable issues={filteredIssues} />
					) : (
						<NoFilteredIssues />
					)}
				</>
			) : (
				<NoIssues />
			)}
		</>
	);
}
