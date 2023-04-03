import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Projects from "./pages/Projects";
import Issues from "./pages/Issues";
import IssueForm from "./pages/Issues/IssuesForm";
import IssuesList from "./pages/Issues/IssuesList";
import ProjectsList from "./pages/Projects/ProjectsList";
import ProjectForm from "./pages/Projects/ProjectsForm";
import Project from "./pages/Projects/Project";
import { ThemeProvider } from "./context/useTheme";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { UserProvider } from "./context/useUser";
import Dashboard from "./pages/Dashboard";
import PersonalDataEdit from "./pages/PersonalDataEdit";
import EmailChange from "./pages/EmailChange";
import PasswordChange from "./pages/PasswordChange";
import PasswordReset from "./pages/PasswordReset";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			//====================== GENERAL =======================
			{
				path: "about",
				element: <About />,
			},
			//====================== AUTH / USER ====================
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
			//====================== FEATURES =======================
			{
				path: "projects",
				element: <Projects />,
				children: [
					{
						path: "add",
						element: <ProjectForm />,
					},
					{
						path: "list",
						element: <ProjectsList />,
					},
					{
						path: ":projectSlug",
						element: <Project />,
					},
				],
			},
			{
				path: "issues",
				element: <Issues />,
				children: [
					{
						path: "add",
						element: <IssueForm />,
					},
					{
						path: "list",
						element: <IssuesList />,
					},
				],
			},
		],
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<ThemeProvider>
			<UserProvider>
				<RouterProvider router={router} />
			</UserProvider>
		</ThemeProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
