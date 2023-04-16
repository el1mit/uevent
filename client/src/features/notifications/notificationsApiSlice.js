import { apiSlice } from '../../app/api/apiSlice';

export const notificationsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: (params) => ({
				url: `/notifications`,
				method: 'GET',
				params,
			}),
			providesTags: (result, error, arg) => [
				{ type: 'Notification', id: 'LIST' },
			],
		}),
	}),
});

export const { useGetNotificationsQuery } = notificationsApiSlice;
