import { firestore as db } from "../../firebaseConfig";
import {
	doc,
	setDoc,
	addDoc,
	collection,
	getDoc,
	getDocs,
	query,
	where,
	updateDoc,
	deleteDoc,
  QueryDocumentSnapshot,
  DocumentReference
} from "firebase/firestore";

interface Document {
  [key: string]: any; // Replace `any` with your document fields
}

async function addDocumentWithCustomId(
  document: Document,
  collectionName: string,
  customId: string
): Promise<void> {
  try {
    await setDoc(doc(db, collectionName, customId), document);
  } catch (err: any) {
    console.error(err.message);
  }
}

async function addDocument(
  document: Document,
  collectionName: string
): Promise<null | { id: string }> {
  try {
    const docRef = await addDoc(collection(db, collectionName), document);
    console.log("Document written with ID: ", docRef.id);
    return docRef;
  } catch (err: any) {
    console.error(err.message);
    return null;
  }
}

interface Updates {
  [key: string]: any; // Replace `any` with your update fields
}

async function updateDocument(
  updates: Updates,
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, updates);
    console.log(
      "Document with the id",
      documentId,
      "was updated successfully."
    );
  } catch (err: any) {
    console.error(err.message);
  }
}


/**
 * Adds a new empty document with a generated id
 */

async function createNewDocReference(collectionName: string): Promise<DocumentReference<Document>> {
  const newRef = doc(collection(db, collectionName));
  return newRef;
}


async function fetchDocument(
  collectionName: string,
  documentId: string
): Promise<Document | null> {
  try {
    console.log("fetching document...");
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const fetchedDocument = docSnap.data() as Document;
      console.log("Document data:", fetchedDocument);
      return fetchedDocument;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document:", documentId);
      return null;
    }
  } catch (err: any) {
    console.error(err.message);
    return null;
  }
}

async function fetchCollection(
  collectionName: string
): Promise<Document[] | null> {
  try {
    console.log("fetching collection...");
    const querySnapshot = await getDocs(collection(db, collectionName));
    console.log("querySnapshot:", querySnapshot);
    const fetchedCollection = querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot) => doc.data() as Document
    );
    console.log(
      "collection",
      collectionName,
      "was fetched:",
      fetchedCollection
    );
    return fetchedCollection;
  } catch (err: any) {
    console.error(err.message);
    return null;
  }
}

async function fetchDocsByIdFromCollection(
  docsIds: string[],
  collectionName: string
): Promise<(Document | null)[]> {
  if (Array.isArray(docsIds)) {
    try {
      console.log("fetching docs with particular ids from collection...");
      const filteredDocs = await Promise.all(
        docsIds.map((id) => fetchDocument(collectionName, id))
      );
      console.log(
        "docs with ids",
        docsIds,
        "from collection",
        collectionName,
        "were fetched:",
        filteredDocs
      );
      return filteredDocs;
    } catch (err: any) {
      console.error(err.message);
      return [];
    }
  } else {
    console.error("passed docIds are not array... can not fetch docs...");
    return [];
  }
}



async function deleteDocument(docId: string, collectionName: string): Promise<void> {
  try {
    console.log(`deleting document ${docId} from collection ${collectionName}`);
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`document ${docId} from collection ${collectionName} was successfully deleted.`);
  } catch (err: any) {
    console.error(err.message);
  }
}


export {
	addDocumentWithCustomId,
	addDocument,
	updateDocument,
	createNewDocReference,
	fetchDocument,
	fetchCollection,
	fetchDocsByIdFromCollection,
	deleteDocument,
};
