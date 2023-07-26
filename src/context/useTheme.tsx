import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
	switchTheme: () => void;
} | null>(null);

export default function useTheme() {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("useTheme has to be used within <ThemeContext.Provider>");
	}

	return context;
}

type ThemeProviderProps = {
	children: React.ReactNode;
	preferredTheme: Theme; // is set in index.tsx before the <App /> mounts
};

export function ThemeProvider({
	children,
	preferredTheme,
}: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>(preferredTheme);

	const switchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
			document.documentElement.setAttribute("data-bs-theme", "light");
		} else {
			setTheme("dark");
			document.documentElement.setAttribute("data-bs-theme", "dark");
		}
	};

	const value = {
		theme,
		setTheme,
		switchTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
