import { useEffect, useState } from "react";
import { collection, getDocs, DocumentData } from "firebase/firestore";
import { firestore as db } from "../firebaseConfig";

export default function useCollection(collectionName: string) {
	const [data, setData] = useState<DocumentData[]>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	// FETCH COLLECTION:
	useEffect(() => {
		async function fetchCollection(collectionName: string) {
			try {
				const querySnapshot = await getDocs(collection(db, collectionName));
				const docs = querySnapshot.docs.map((doc) => doc.data());
				setData(docs);
				setLoading(false);
			} catch (error: any) {
				if (error.code === 'not-found') {
					// Handle case where collection doesn't exist
					setData([]);
					console.error(error.message);
					setError(error.message);
				} else {
					// Handle other errors
					console.error(error.message);
					setError(error.message);
				}
			}
		}

		fetchCollection(collectionName);
	}, [collectionName]);

	return { data, loading, error };
}
