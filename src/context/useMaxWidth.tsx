import { createContext, useContext } from "react";

const MaxWidthContext = createContext<number>(940);

export default function useMaxWidth() {
	const context = useContext(MaxWidthContext);

	if (!context) {
		throw new Error(
			"useMaxWidth has to be used within <MaxWidthContext.Provider>"
		);
	}

	return context;
}

type MaxWidthProviderProps = {
	children: React.ReactNode;
};

export function MaxWidthProvider({ children }: MaxWidthProviderProps) {
	const maxWidth = 940; // here you can define max width for layout, Navbar & Footer container

	return (
		<MaxWidthContext.Provider value={maxWidth}>
			{children}
		</MaxWidthContext.Provider>
	);
}
