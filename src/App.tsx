import "./App.css";
import Layout from "./components/Layout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import IssueForm from "./pages/Issues/IssuesForm";
import IssuesList from "./pages/Issues/IssuesList";
import Project from "./pages/Project";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import PersonalDataEdit from "./pages/PersonalDataEdit";
import EmailChange from "./pages/EmailChange";
import PasswordChange from "./pages/PasswordChange";
import PasswordReset from "./pages/PasswordReset";
import ProjectsAdd from "./pages/ProjectsAdd";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			//====================== GENERAL =======================//
			{
				path: "about",
				element: <About />,
			},
			//====================== AUTH / USER ====================//
			{
				path: "signin",
				element: <SignIn />,
			},
			{
				path: "signup",
				element: <SignUp />,
			},
			{
				path: "dashboard",
				element: <Dashboard />,
			},
			{
				path: "personal-data-edit",
				element: <PersonalDataEdit />,
			},
			{
				path: "email-change",
				element: <EmailChange />,
			},
			{
				path: "password-change",
				element: <PasswordChange />,
			},
			{
				path: "password-reset",
				element: <PasswordReset />,
			},
			//====================== FEATURES =======================//

			//====================== PROJECTS =======================//
			{
				path: "projects",
				element: <Projects />,
			},
			{
				path: "projects/add",
				element: <ProjectsAdd />,
			},
			{
				path: "projects/:projectId",
				element: <Project />,
			},
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
