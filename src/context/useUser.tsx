import { createContext, useContext, useState, useEffect } from "react";
import { auth, firestore } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { User } from "../interfaces/User";
import { User as FirebaseUser } from "firebase/auth";

const UserContext = createContext<{
	firebaseUser: FirebaseUser | null;
	user: User | null;
}>({ firebaseUser: null, user: null });

export default function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser has to be used within <UserContext.Provider>");
	}

	return context;
}

interface UserProviderProps {
	children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
	const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (u) => {
			if (u) {
				setFirebaseUser(u);
			} else {
				console.log("User logged out.");
				setFirebaseUser(null);
			}
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (firebaseUser) {
			const { uid } = firebaseUser;
			console.log("User with the id", uid, "logged in. Fetching user data...");

			const unsubscribe = onSnapshot(doc(firestore, "users", uid), (doc) => {
				if (doc.exists()) {
					const fetchedData = doc.data() as User;
					console.log("Current logged user data: ", fetchedData);
					if (fetchedData) {
						const { uid, email, firstName, lastName } = fetchedData;
						if (uid && email && firstName && lastName) {
							setUser({ ...fetchedData });
						}
					}
				} else {
					console.warn(
						"User with the id",
						uid,
						"is logged, but there is no user's data in Firestore..."
					);
				}
			});

			return () => unsubscribe();
		} else {
			setUser(null);
		}
	}, [firebaseUser]);

	const value = {
		firebaseUser,
		user,
	};

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
