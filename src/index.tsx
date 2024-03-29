import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { UserProvider } from "./context/useUser";
import { ThemeProvider } from "./context/useTheme";
import { ProjectsProvider } from "./context/useProjects";
import { MaxWidthProvider } from "./context/useMaxWidth";
import { IssuesProvider } from "./context/useIssues";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);

const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
	? "dark"
	: "light";

root.render(
	<React.StrictMode>
		<ThemeProvider preferredTheme={preferredTheme}>
			<MaxWidthProvider>
				<UserProvider>
					<IssuesProvider>
						<ProjectsProvider>
							<App />
						</ProjectsProvider>
					</IssuesProvider>
				</UserProvider>
			</MaxWidthProvider>
		</ThemeProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
