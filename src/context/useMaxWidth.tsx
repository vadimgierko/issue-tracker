import { createContext, useContext } from "react";

const MaxWidthContext = createContext<number | undefined>(undefined);

export default function useMaxWidth() {
	return useContext(MaxWidthContext);
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
