import { createContext, useContext, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
	value: Theme;
	set: (theme: Theme) => void;
	switch: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function useTheme() {
	return useContext(ThemeContext);
}

interface ThemeProviderProps {
	children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
	const [theme, setTheme] = useState<Theme>("dark");

	const switchTheme = () => {
		if (theme === "dark") {
			setTheme("light");
		} else {
			setTheme("dark");
		}
	};

	const value: ThemeContextType = {
		value: theme,
		set: setTheme,
		switch: switchTheme,
	};

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}
