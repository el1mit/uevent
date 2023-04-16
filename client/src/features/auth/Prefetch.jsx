import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { store } from '../../app/store';
import { usersApiSlice } from '../users/usersApiSlice';
import { eventsApiSlice } from '../events/eventsApiSlice';

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(
			usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true })
		);
		store.dispatch(
			eventsApiSlice.util.prefetch('getEvents', 'eventsList', { force: true })
		);
	}, []);

	return <Outlet />;
};

export default Prefetch;
