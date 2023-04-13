import { Link } from "react-router-dom";
import useUser from "../../context/useUser";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user } = useUser();

	return <>{user ? children : <NoUser />}</>;
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
