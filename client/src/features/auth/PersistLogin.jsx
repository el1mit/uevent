import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin } from 'antd';
import { useRefreshMutation } from './authApiSlice';
import usePersist from '../../hooks/usePersist';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from './authSlice';

const PersistLogin = () => {
	const [persist] = usePersist();
	const token = useSelector(selectCurrentToken);
	const [trueSuccess, setTrueSuccess] = useState(false);

	const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
		useRefreshMutation();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
				setTrueSuccess(true);
			} catch (err) {
				console.error(err);
			}
		};

		if (!token && persist) verifyRefreshToken();

		// eslint-disable-next-line
	}, []);

	let content;
	if (!persist) {
		content = <Outlet />;
	} else if (isLoading) {
		content = <Spin text="Loading..." />;
	} else if (isError) {
		console.log(error?.data?.message);
		content = <Outlet />;
	} else if (isSuccess && trueSuccess) {
		content = <Outlet />;
	} else if (token && isUninitialized) {
		content = <Outlet />;
	}

	return content;
};

export default PersistLogin;
