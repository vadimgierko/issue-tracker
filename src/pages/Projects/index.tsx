import { Link } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { Button, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import PageHeader from "../../components/Layout/PageHeader";
import { BsPencilSquare } from "react-icons/bs";

export default function Projects() {
	const { value: projects, loading } = useProjects();

	function Loading() {
		return (
			<div className="text-center">
				<Spinner />
			</div>
		);
	}

	function ProjectsList() {
		return (
			<ul className="mt-3">
				{projects.map((project) => (
					<li key={project.id}>
						<Link to={"/projects/" + project.id}>{project.title}</Link>{" "}
						<Link to={"/projects/" + project.id + "/edit"}>
							<BsPencilSquare />
						</Link>
					</li>
				))}
			</ul>
		);
	}

	function NoProjects() {
		return <p className="text-center">There are no projects... Add one!</p>;
	}

	return (
		<>
			<PageHeader pageTitle="Projects">
				<div className="text-center my-3">
					<LinkContainer to="/projects/add">
						<Button className="primary">Add Project</Button>
					</LinkContainer>
				</div>
			</PageHeader>

			{loading ? (
				<Loading />
			) : projects && projects.length ? (
				<ProjectsList />
			) : (
				<NoProjects />
			)}
		</>
	);
}
