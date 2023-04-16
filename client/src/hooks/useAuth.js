import { useSelector } from 'react-redux';
import {
	selectCurrentToken,
	selectCurrentUser,
} from '../features/auth/authSlice';
import useCheckEventAuthor from './useCheckEventAuthor';

const useAuth = (eventId, userLogin) => {
	const token = useSelector(selectCurrentToken);
	const user = useSelector(selectCurrentUser);
	const { eventAuthorLogin } = useCheckEventAuthor(eventId);

	let isAdmin = false;
	let isAuth = false;
	let isOwner = false;

	if (token && user) {
		let roles = [];
		roles.push('user');

		if (user.role === 'admin') {
			roles.push('admin');
			isAdmin = true;
		}

		if (user.login === userLogin || user.login === eventAuthorLogin) {
			roles.push('owner');
			isOwner = true;
		}

		return {
			id: user.id,
			login: user.login,
			firstname: user.firstname,
			lastname: user.lastname,
			email: user.email,
			official: user.official,
			description: user.description,
			subscribers: user.subscribers,
			roles,
			isAdmin,
			isOwner,
			isAuth: true,
		};
	}

	return {
		id: '',
		login: '',
		firstname: '',
		lastname: '',
		email: '',
		official: '',
		description: '',
		subscribers: [],
		roles: [],
		isAdmin,
		isAuth,
	};
};

export default useAuth;
