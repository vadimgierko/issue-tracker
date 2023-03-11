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

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
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
		<RouterProvider router={router} />
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
