import { createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';

const eventsAdapter = createEntityAdapter({});
const initialState = eventsAdapter.getInitialState();

export const eventsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getEvents: builder.query({
			query: (params) => ({
				url: '/events',
				method: 'GET',
				params,
			}),
			transformResponse: (responseData) => {
				return {
					...eventsAdapter.setAll(initialState, responseData.events),
					total: responseData.total,
				};
			},
			providesTags: (result) => {
				if (result?.ids) {
					return [
						{ type: 'Event', id: 'LIST' },
						...result.ids.map((id) => ({ type: 'Event', id })),
					];
				} else return [{ type: 'Event', id: 'LIST' }];
			},
		}),
		getEventsIp: builder.query({
			query: (credentials) => ({
				url: `/events/ip/${credentials.ip}`,
				method: 'GET',
				params: credentials.params,
			}),
			transformResponse: (responseData) => {
				console.log(responseData);
				return {
					...eventsAdapter.setAll(initialState, responseData.events),
					total: responseData.total,
				};
			},
			providesTags: (result) => {
				if (result?.ids) {
					return [
						{ type: 'Event', id: 'LIST' },
						...result.ids.map((id) => ({ type: 'Event', id })),
					];
				} else return [{ type: 'Event', id: 'LIST' }];
			},
		}),
		getEvent: builder.query({
			query: (id) => ({
				url: `/events/${id}`,
				method: 'GET',
			}),
			providesTags: (result) => [{ type: 'Event', id: result.id }],
		}),
		getEventPhoto: builder.query({
			query: (id) => ({
				url: `/events/${id}/photo`,
				method: 'GET',
			}),
			validateStatus: (result) => {
				console.log(result);
				return result.status === 200;
			},
		}),
		createEvent: builder.mutation({
			query: (credentials) => ({
				url: '/events',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Event', id: 'LIST' }],
		}),
		editEvent: builder.mutation({
			query: (credentials) => ({
				url: `/events/${credentials.id}`,
				method: 'PUT',
				body: credentials.body,
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Event', id: arg.id }],
		}),
		editEventPhoto: builder.mutation({
			query: (credentials) => {
				const formData = new FormData();
				formData.append('file', credentials.file, credentials.file.name);

				const config = {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				};

				return {
					url: `/events/${credentials.eventId}/photo`,
					method: 'PUT',
					body: formData,
					config,
				};
			},
			invalidatesTags: (result) => [{ type: 'Event', id: 'LIST' }],
		}),
		deleteEventPhoto: builder.mutation({
			query: (eventId) => ({
				url: `/events/${eventId}/photo`,
				method: 'DELETE',
			}),
			invalidatesTags: (result) => [{ type: 'Event', id: 'LIST' }],
		}),
		deleteEvent: builder.mutation({
			query: (id) => ({
				url: `/events/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, arg) => [{ type: 'Event', id: 'LIST' }],
		}),
		getEventSubscribers: builder.query({
			query: (credentials) => ({
				url: `/events/${credentials.eventId}/subscribers`,
				method: 'GET',
				params: credentials.params,
			}),
			providesTags: (result) => [{ type: 'EventSubscribers', id: 'LIST' }],
		}),
		eventSubscibe: builder.mutation({
			query: (id) => ({
				url: `/events/${id}/subscribe`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Event', id: arg.id },
				{ type: 'EventSubscribers', id: 'LIST' },
				{ type: 'UserEventsSigned', id: 'LIST' },
			],
		}),
		eventUnsubscibe: builder.mutation({
			query: (id) => ({
				url: `/events/${id}/unsubscribe`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Event', id: arg.id },
				{ type: 'EventSubscribers', id: 'LIST' },
				{ type: 'UserEventsSigned', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetEventsQuery,
	useGetEventsIpQuery,
	useGetEventQuery,
	useGetEventPhotoQuery,
	useCreateEventMutation,
	useEditEventMutation,
	useEditEventPhotoMutation,
	useDeleteEventPhotoMutation,
	useDeleteEventMutation,
	useGetEventSubscribersQuery,
	useEventSubscibeMutation,
	useEventUnsubscibeMutation,
} = eventsApiSlice;

// returns the query result object
export const selectEventsResult = eventsApiSlice.endpoints.getEvents.select();

// creates memoized selector
const selectEventsData = createSelector(
	selectEventsResult,
	(eventsResult) => eventsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
	selectAll: selectAllEvents,
	selectById: selectEventById,
	selectIds: selectEventIds,
	// Pass in a selector that returns the events slice of state
} = eventsAdapter.getSelectors(
	(state) => selectEventsData(state) ?? initialState
);
