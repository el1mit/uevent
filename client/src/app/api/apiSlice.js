import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.REACT_APP_API_URL,
	credentials: 'include',
	prepareHeaders: (headers, { getState }) => {
		const token = getState().auth.token;
		if (token) {
			headers.set('authorization', `Bearer ${token}`);
		}
		return headers;
	},
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 403) {
		// send refresh token to get new access token
		const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

		if (refreshResult?.data) {
			api.dispatch(setCredentials(refreshResult.data));
			result = await baseQuery(args, api, extraOptions);
		} else {
			api.dispatch(logOut());
		}
	}

	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		'User',
		'UserSubscribers',
		'UserEventsSigned',
		'UserEvents',
		'UserFollowings',
		'Event',
		'EventSubscribers',
		'Comment',
		'Category',
		'Notification',
		'Like',
	],
	endpoints: (builder) => ({}),
});
