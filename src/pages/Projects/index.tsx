import { Link } from "react-router-dom";
import useProjects from "../../context/useProjects";
import { Button, Spinner } from "react-bootstrap";
import PageHeader from "../../components/Layout/PageHeader";
import { BsPencilSquare, BsTrash } from "react-icons/bs";

export default function Projects() {
	const { projects, loading, deleteProject } = useProjects();

	function Loading() {
		return (
			<div className="text-center">
				<Spinner />
			</div>
		);
	}

	async function handleDeleteProject(projectId: string) {
		if (!projectId)
			return alert("No project id was provided... Cannot delete project.");

		await deleteProject(projectId);
		alert(`Your project with the id ${projectId} was successfully deleted.`);
	}

	function ProjectsList() {
		return (
			<ul className="mt-3">
				{projects.map((project) => (
					<li key={project.id}>
						<Link to={"/projects/" + project.id}>{project.title}</Link>{" "}
						<Link to={"/projects/" + project.id + "/edit"}>
							<BsPencilSquare />
						</Link>{" "}
						<BsTrash
							style={{ color: "red" }}
							onClick={() => handleDeleteProject(project.id)}
						/>
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
					<Link to="/projects/add">
						<Button className="primary">Add Project</Button>
					</Link>
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
