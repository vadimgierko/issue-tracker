import { Link } from "react-router-dom";
import useProjects from "../../context/useProjects";
import useUser from "../../context/useUser";
import { Button, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

export default function Projects() {
	const { user } = useUser();
	const { value: projects, loading } = useProjects();

	if (!user)
		return (
			<>
				<Header />
				<NoUser />
			</>
		);

	if (loading)
		return (
			<>
				<Header />
				<Loading />
			</>
		);

	if (!projects || !projects.length)
		return (
			<>
				<Header />
				<NoProjects />
			</>
		);

	return (
		<>
			<Header />
			<ul className="mt-3">
				{projects.map((project) => (
					<li key={project.id}>
						<Link to={"/projects/" + project.id}>{project.title}</Link>
					</li>
				))}
			</ul>
		</>
	);
}

function Header() {
	return (
		<header className="text-center">
			<h1 className="mb-3">Projects</h1>
			<div className="text-center">
				<LinkContainer to="/projects/add">
					<Button className="primary">Add Project</Button>
				</LinkContainer>
			</div>
			<hr />
		</header>
	);
}

function NoUser() {
	return <p className="text-center">You need to be logged!</p>;
}

function Loading() {
	return (
		<div className="text-center">
			<Spinner />
		</div>
	);
}

function NoProjects() {
	return <p className="text-center">There are no projects... Add one!</p>;
}
