import { Link, useNavigate } from "react-router-dom";
import useUser from "../../context/useUser";
import { Button } from "react-bootstrap";
import { User, sendEmailVerification } from "firebase/auth";
import { logOut } from "../../services/auth";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { firebaseUser } = useUser();

	return (
		<>
			{firebaseUser ? (
				firebaseUser.emailVerified ? (
					children
				) : (
					<NonVerifiedUser firebaseUser={firebaseUser} />
				)
			) : (
				<NoUser />
			)}
		</>
	);
}

function NoUser() {
	return (
		<div className="text-center">
			<p>
				You need to be logged to have an access to this page...{" "}
				<Link to="/signin">Sign in!</Link>
			</p>
		</div>
	);
}

function NonVerifiedUser({ firebaseUser }: { firebaseUser: User }) {
	const navigate = useNavigate();

	return (
		<div className="text-center">
			<p>
				Your account is not verified yet... Confirm your email address via the
				link we've sent you when you've signed up to have an access to this
				page.
			</p>
			<Button
				variant="primary"
				onClick={async () => {
					await sendEmailVerification(firebaseUser);
					alert(
						"We've sent a verification email again, so confirm you're email address & then come back & sign in!"
					);
					await logOut();
					navigate("/signin");
				}}
			>
				Log out & send verification email again
			</Button>
		</div>
	);
}
