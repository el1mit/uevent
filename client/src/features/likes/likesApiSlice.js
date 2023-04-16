import { apiSlice } from '../../app/api/apiSlice';

export const likesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createLike: builder.mutation({
			query: (eventId) => ({
				url: `/likes/${eventId}`,
				method: 'POST',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Like', id: arg.eventId },
				{ type: 'Event', id: arg.eventId },
			],
		}),
		getLike: builder.query({
			query: (eventId) => ({
				url: `/likes/${eventId}`,
				method: 'GET',
			}),
			providesTags: (result, error, arg) => [{ type: 'Like', id: arg.eventId }],
		}),
		deleteLike: builder.mutation({
			query: (eventId) => ({
				url: `/likes/${eventId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Like', id: arg.eventId },
				{ type: 'Event', id: arg.eventId },
			],
		}),
	}),
});

export const { useGetLikeQuery, useCreateLikeMutation, useDeleteLikeMutation } =
	likesApiSlice;
