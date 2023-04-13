import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

// type ThemeContextType = {
// 	value: Theme;
// 	set: (theme: Theme) => void;
// 	switch: () => void;
// };

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
};

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>("dark");

	const switchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
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
