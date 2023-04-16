import { useLocation, Navigate, Outlet, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
	const location = useLocation();
	const { login, id } = useParams();
	const { roles } = useAuth(id, login);

	const content = roles.some((role) => allowedRoles.includes(role)) ? (
		<Outlet />
	) : (
		<Navigate to="/login" state={{ from: location }} />
	);

	return content;
};

export default RequireAuth;
