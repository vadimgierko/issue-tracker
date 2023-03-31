import { auth } from "../../firebaseConfig";
import {
	signOut,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	deleteUser,
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
	updateEmail,
} from "firebase/auth";
import {
	addDocumentWithCustomId,
	deleteDocument,
	updateDocument,
} from "../firestore-crud";

async function signIn(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    alert(error.message);
  }
}

/**
 * Creates a new user in Firebase Auth & adds his data to /users collection in Firestore under user's uid.
 * Returns updated user data object with the uid.
 * @param firstName user's first name
 * @param lastName user's last name
 * @param email user's email address
 * @param password user's password
 * @returns updated user data object with uid
 */
async function signUp(
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<{ uid: string; firstName: string; lastName: string; email: string }> {
  try {
    // create a new user:
    const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);

    // add user data to Firestore:
    const updatedUserDataWithUid = {
      uid: newUser.uid,
      email,
      firstName,
      lastName,
    };
    await addDocumentWithCustomId(updatedUserDataWithUid, "users", updatedUserDataWithUid.uid);

    return updatedUserDataWithUid;
  } catch (error: any) {
    alert(error.message);
    throw error;
  }
}


 /**
 * Logs the current user out.
 * @returns {void}
 */
async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    alert(error.message);
  }
}


/**
 * Put this function before any security-sensitive action
 * to force user to log in again if no passedPassword provided
 * or re-authenticate user automatically if passedPassword provided.
 */

 async function reauthenticateUser(passedPassword = "") {
	try {
		const user = auth.currentUser;

		const password = passedPassword
			? passedPassword
			: prompt(
					"This is security-sensitive action, so you need to re-authenticate yourself. Please enter your password here to continue:"
			  );

		const credential = EmailAuthProvider.credential(user.email, password);

		return reauthenticateWithCredential(user, credential);
	} catch (error) {
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
	authUser = auth.currentUser,
	oldPassword = "",
	newPassword = ""
) {
	try {
		await updatePassword(authUser, newPassword);
		alert("Your password was successfully changed!");
		return;
	} catch (error) {
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
 async function changeEmail(authUser = auth.currentUser, newEmail = "") {
	try {
		await updateEmail(authUser, newEmail);
		await updateDocument({ email: newEmail }, "users", authUser.uid);
		alert("Your email was successfully changed!");
		return;
	} catch (error) {
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
 * Deletes user account & his/her data from /users/$uid in Firestore, if user is logged.
 * If not, the function authomatically asks user to re-authenticate,
 * handles re-authentication & then tries to delete user account & data again.
 *
 * @returns {Promise<void>} A Promise that resolves when the user account & data has been successfully deleted.
 * If an error occurs, the Promise will be rejected with an error message and code.
 */

async function deleteUserAccount(authUser = auth.currentUser) {
	try {
		const deletedUserId = authUser.uid;

		if (deletedUserId) {
			console.log("Deleting user with the id", deletedUserId, "...");
			// delete user data stored in /users/[deletedUserId] in Firestore first:
			await deleteDocument(deletedUserId, "users");
			// now delete user account from Firebase Auth:
			await deleteUser(authUser);
			console.log(
				`Your user account with the id ${deletedUserId} and your data was successfully deleted.`
			);
			alert(
				`Your user account with the id ${deletedUserId} and your data was successfully deleted.`
			);
			return;
		} else {
			alert("You need to be logged, if you want to delete your user account!");
		}
	} catch (error) {
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


