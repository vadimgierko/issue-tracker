import "./App.css";
import Layout from "./components/Layout";
import {
	createBrowserRouter,
	RouterProvider,
	RouteObject,
} from "react-router-dom";
import Projects from "./pages/Projects";
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
import ProtectedRoute from "./components/Layout/ProtectedRoute";
import ProjectEdit from "./pages/ProjectEdit";
import Issues from "./pages/Issues";
import IssuesAdd from "./pages/IssuesAdd";
import IssueEdit from "./pages/IssueEdit";
import Issue from "./pages/Issue";
import ProjectIssues from "./pages/Project/ProjectIssues";
import ProjectDetails from "./pages/Project/ProjectDetails";
import ProjectIssuesOrdered from "./pages/Project/ProjectIssuesOrdered";

const privateRoutes: RouteObject[] = [
	//====================== AUTH / USER ====================//
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
		children: [
			{
				path: "issues",
				element: <ProjectIssues />,
			},
			{
				path: "details",
				element: <ProjectDetails />,
			},
			{
				path: "issues-ordered",
				element: <ProjectIssuesOrdered />,
			},
		],
	},
	{
		path: "projects/:projectId/edit",
		element: <ProjectEdit />,
	},
	{
		path: "projects/:projectId/add-issue",
		element: <IssuesAdd />,
	},

	//====================== ISSUES ==========================//
	{
		path: "issues",
		element: <Issues />,
	},
	{
		path: "issues/add",
		element: <IssuesAdd />,
	},
	{
		path: "issues/:issueId",
		element: <Issue />,
	},
	{
		path: "issues/:issueId/edit",
		element: <IssueEdit />,
	},
];

function protectRoutes(privateRoutes: RouteObject[]): RouteObject[] {
	const protectedRoutes = privateRoutes.map((r) => ({
		...r,
		element: <ProtectedRoute>{r.element}</ProtectedRoute>,
	}));

	return protectedRoutes;
}

const protectedRoutes = protectRoutes(privateRoutes);

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			//===================== PUBLIC ROUTES ====================//

			//======================== GENERAL =======================//
			{
				path: "about",
				element: <About />,
			},
			//====================== AUTH / USER =====================//
			{
				path: "signin",
				element: <SignIn />,
			},
			{
				path: "signup",
				element: <SignUp />,
			},
			//================== PRIVATE / PROTECTED ROUTES ==========//
			...protectedRoutes,
		],
	},
]);

function App() {
	return <RouterProvider router={router} />;
}

export default App;
