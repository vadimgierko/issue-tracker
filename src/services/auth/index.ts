import { auth, firestore } from "../../firebaseConfig";
import {
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
	updateEmail,
	User as FirebaseUser,
	UserCredential,
	sendEmailVerification,
} from "firebase/auth";
import { updateDocument } from "../firestore-crud";
import { User } from "../../interfaces/User";
import { doc, writeBatch } from "firebase/firestore";
import logError from "../../lib/logError";
import { Project } from "../../interfaces/Project";
import { Issue } from "../../interfaces/Issue";

async function signIn(email: string, password: string): Promise<void> {
	try {
		await logOut();
		await signInWithEmailAndPassword(auth, email, password);
	} catch (error: any) {
		logError(error.message);
	}
}

/**
 * Creates a new user in Firebase Auth &
 * adds his data to /users collection in Firestore under user's uid,
 * init user-projects & user-issues docs with empty [] for project/issues ids.
 * Returns updated user data object with the uid.
 */
async function signUp(
	firstName: string,
	lastName: string,
	email: string,
	password: string
): Promise<User> {
	try {
		// create a new user:
		const { user: newUser } = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// init batch to update multiply docs:
		const batch = writeBatch(firestore);

		// add user data to Firestore:
		const updatedUserDataWithUid: User = {
			uid: newUser.uid,
			email,
			firstName,
			lastName,
		};

		const userRef = doc(firestore, "users", newUser.uid);
		batch.set(userRef, updatedUserDataWithUid);

		// init /user-projects collection:
		const userProjectsRef = doc(firestore, "user-projects", newUser.uid);
		batch.set(userProjectsRef, {});

		// init /user-issues collection:
		const userIssuesRef = doc(firestore, "user-issues", newUser.uid);
		batch.set(userIssuesRef, {});

		// Commit the batch
		await batch.commit();

		// send verification email:
		await sendEmailVerification(newUser);

		return updatedUserDataWithUid;
	} catch (error: any) {
		logError(error.message);
		throw error;
	}
}

async function logOut(): Promise<void> {
	try {
		await signOut(auth);
	} catch (error: any) {
		logError(error.message);
	}
}

/**
 * Put this function before any security-sensitive action
 * to force user to log in again if no passedPassword provided
 * or re-authenticate user automatically if passedPassword provided.
 */
async function reauthenticateUser(
	passedPassword?: string
): Promise<UserCredential | undefined> {
	try {
		const user: FirebaseUser | null = auth.currentUser;

		if (!user) {
			throw new Error("User is not signed in.");
		}

		const password = passedPassword
			? passedPassword
			: prompt(
					"This is security-sensitive action, so you need to re-authenticate yourself. Please enter your password here to continue:"
			  );

		if (!password) {
			throw new Error("Password not provided...");
		}

		const email = user.email;

		if (!email) {
			throw new Error("User email is not available.");
		}

		const credential = EmailAuthProvider.credential(email, password);

		return reauthenticateWithCredential(user, credential);
	} catch (error: any) {
		console.error(
			`Error message in reauthenticateUser(): ${error.message}. Error code: ${error.code}`
		);
		alert(
			`Error message reauthenticateUser(): ${error.message}. Error code: ${error.code}`
		);
	}
}

/**
 * Changes the password for the current user using Firebase Authentication.
 * If the user is not currently authenticated, the function will attempt to reauthenticate
 * the user using their old password before changing their password.
 *
 * @returns {Promise<void>} A Promise that resolves when the password has been successfully changed.
 * If an error occurs, the Promise will be rejected with an error message and code.
 */
async function changePassword(
	authUser: FirebaseUser | null = auth.currentUser,
	oldPassword: string = "",
	newPassword: string = ""
): Promise<void> {
	try {
		if (!authUser)
			throw new Error(
				"User is not passed to changePassword() or is not signed in."
			);
		await updatePassword(authUser, newPassword);
		alert("Your password was successfully changed!");
		return;
	} catch (error: any) {
		if (error.code === "auth/requires-recent-login") {
			console.log(
				"User needs to re-authenticate to update password. Re-authenticate automatically using passed old password..."
			);
			// Require user to sign in again:
			await reauthenticateUser(oldPassword);
			// then try to change password:
			return changePassword(authUser, oldPassword, newPassword);
		} else {
			console.error(
				`Error message changePassword(): ${error.message}. Error code: ${error.code}`
			);
			// return Promise.reject() allows the caller of the function
			// to handle the error using a try-catch block or a .catch() method call:
			return Promise.reject(
				`Error message changePassword(): ${error.message}. Error code: ${error.code}`
			);
		}
	}
}

/**
 * Changes the email address for the current user using Firebase Authentication and Firestore.
 * If the user is not currently authenticated, the function will attempt to reauthenticate
 * the user before changing their email address.
 *
 * @returns {Promise<void>} A Promise that resolves when the email address has been successfully changed.
 * If an error occurs, the Promise will be rejected with an error message and code.
 */
async function changeEmail(
	authUser: FirebaseUser | null = auth.currentUser,
	newEmail: string = ""
): Promise<void> {
	try {
		if (!authUser)
			throw new Error(
				"User is not passed to changeEmail() or is not signed in."
			);

		await updateEmail(authUser, newEmail);
		await updateDocument({ email: newEmail }, "users", authUser!.uid);
		alert("Your email was successfully changed!");
		return;
	} catch (error: any) {
		if (error.code === "auth/requires-recent-login") {
			console.log("User needs to re-authenticate to update email.");
			// Require user to sign in again:
			await reauthenticateUser();
			// then try to change password:
			return changeEmail(authUser, newEmail);
		} else {
			console.error(
				`Error message changeEmail(): ${error.message}. Error code: ${error.code}`
			);
			// return Promise.reject() allows the caller of the function
			// to handle the error using a try-catch block or a .catch() method call:
			return Promise.reject(
				`Error message changeEmail(): ${error.message}. Error code: ${error.code}`
			);
		}
	}
}

/**
 * Deletes user account & all of his/her data from Firestore, if user is logged.
 * If not, the function authomatically asks user to re-authenticate,
 * handles re-authentication & then tries to delete user account & data again.
 *
 * @returns {Promise<void>} A Promise that resolves when the user account & data has been successfully deleted.
 * If an error occurs, the Promise will be rejected with an error message and code.
 */

async function deleteUserAccount(
	authUser: FirebaseUser | null = auth.currentUser
): Promise<void> {
	try {
		if (!authUser) {
			throw new Error("You need to be logged in to delete your user account!");
		}

		const deletedUserId = authUser.uid;

		console.log(`Deleting user with the id ${deletedUserId} initiated...`);

		//===================================== DELETE ALL OF YOUR USER DATA ================//
		const batch = writeBatch(firestore);

		// delete user data stored in /users/[deletedUserId] in Firestore first:
		const userRef = doc(firestore, "users", deletedUserId);
		batch.delete(userRef);

		// delete /user-projects collection:
		const userProjectsRef = doc(firestore, "user-projects", deletedUserId);
		batch.delete(userProjectsRef);

		// delete /user-issues collection:
		const userIssuesRef = doc(firestore, "user-issues", deletedUserId);
		batch.delete(userIssuesRef);

		await batch.commit();

		//===================================== DELETE USER  ==================================//
		await deleteUser(authUser);

		console.log(
			`Your user account with the id ${deletedUserId} and your data was successfully deleted.`
		);
		alert(
			`Your user account with the id ${deletedUserId} and your data was successfully deleted.`
		);
	} catch (error: any) {
		if (error.code === "auth/requires-recent-login") {
			// Require user to sign in again:
			await reauthenticateUser();
			// then try to delete user account:
			return deleteUserAccount(authUser);
		} else {
			console.error(
				`Error message deleteUserAccount(): ${error.message}. Error code: ${error.code}`
			);
			// return Promise.reject() allows the caller of the function
			// to handle the error using a try-catch block or a .catch() method call:
			return Promise.reject(
				`Error message deleteUserAccount(): ${error.message}. Error code: ${error.code}`
			);
		}
	}
}

export {
	signIn,
	signUp,
	logOut,
	deleteUserAccount,
	reauthenticateUser,
	changePassword,
	changeEmail,
};
