import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const usersAdapter = createEntityAdapter({});
const initialState = usersAdapter.getInitialState();

export const usersApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUsers: builder.query({
			query: (params) => ({
				url: '/users',
				method: 'GET',
				params,
			}),
			transformResponse: (responseData) => {
				return {
					...usersAdapter.setAll(initialState, responseData.users),
					total: responseData.total,
				};
			},
			providesTags: (result) => {
				if (result?.ids) {
					return [
						{ type: 'User', id: 'LIST' },
						...result.ids.map((id) => ({ type: 'User', id })),
					];
				} else return [{ type: 'User', id: 'LIST' }];
			},
		}),
		getUser: builder.query({
			query: (userLogin) => ({
				url: `/users/${userLogin}`,
				method: 'GET',
			}),
			providesTags: (result) => [{ type: 'User', id: result.id }],
		}),
		editUser: builder.mutation({
			query: (credentials) => ({
				url: `/users/${credentials.userLogin}`,
				method: 'PUT',
				body: credentials.body,
			}),
			invalidatesTags: (result) => [{ type: 'User', id: 'LIST' }],
		}),
		editUserPhoto: builder.mutation({
			query: (credentials) => {
				const formData = new FormData();
				formData.append('file', credentials.file, credentials.file.name);

				const config = {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				};

				return {
					url: `/users/${credentials.userLogin}/photo`,
					method: 'PUT',
					body: formData,
					config,
				};
			},
			invalidatesTags: (result) => [{ type: 'User', id: 'LIST' }],
		}),
		deleteUserPhoto: builder.mutation({
			query: (userLogin) => ({
				url: `/users/${userLogin}/photo`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [{ type: 'User', id: 'LIST' }],
		}),
		deleteUser: builder.mutation({
			query: (userLogin) => ({
				url: `/users/${userLogin}`,
				method: 'DELETE',
			}),
			providesTags: (result) => [{ type: 'User', id: 'LIST' }],
		}),
		getUserSubscribers: builder.query({
			query: (login) => ({
				url: `/users/${login}/subscribers`,
				method: 'GET',
			}),
			providesTags: (result, error, arg) => [
				{ type: 'UserSubscribers', id: 'LIST' },
			],
		}),
		getUserFollowings: builder.query({
			query: (login) => ({
				url: `/users/${login}/followings`,
				method: 'GET',
			}),
			providesTags: (result, error, arg) => [
				{ type: 'UserFollowings', id: 'LIST' },
			],
		}),
		getUserEvents: builder.query({
			query: (credentials) => ({
				url: `/users/${credentials.login}/events`,
				method: 'GET',
				params: credentials.params,
			}),
			providesTags: (result, error, arg) => [
				{ type: 'UserEvents', id: 'LIST' },
			],
		}),
		getUserEventsSigned: builder.query({
			query: (credentials) => ({
				url: `/users/${credentials.login}/events/signed`,
				method: 'GET',
				params: credentials.params,
			}),
			providesTags: (result, error, arg) => [
				{ type: 'UserEventsSigned', id: 'LIST' },
			],
		}),
		userSubscibe: builder.mutation({
			query: (credentials) => ({
				url: `/users/${credentials.login}/subscribe`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'User', id: arg.id },
				{ type: 'UserSubscribers', id: 'LIST' },
			],
		}),
		userUnsubscibe: builder.mutation({
			query: (credentials) => ({
				url: `/users/${credentials.login}/unsubscribe`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'User', id: arg.id },
				{ type: 'UserSubscribers', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetUsersQuery,
	useGetUserQuery,
	useEditUserMutation,
	useEditUserPhotoMutation,
	useDeleteUserMutation,
	useDeleteUserPhotoMutation,
	useGetUserSubscribersQuery,
	useGetUserFollowingsQuery,
	useGetUserEventsQuery,
	useGetUserEventsSignedQuery,
	useUserSubscibeMutation,
	useUserUnsubscibeMutation,
} = usersApiSlice;

// returns the query result object
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select();

// creates memoized selector
const selectUsersData = createSelector(
	selectUsersResult,
	(usersResult) => usersResult.data
	// normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllUsers,
	selectById: selectUserById,
	selectIds: selectUserIds,
	// Pass in a selector that returns the users slice of state
} = usersAdapter.getSelectors(
	(state) => selectUsersData(state) ?? initialState
);
