import { apiSlice } from '../../app/api/apiSlice';

export const commentsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getComments: builder.query({
			query: (credentials) => ({
				url: `/comments/${credentials.eventId}`,
				method: 'GET',
				params: credentials.params,
			}),
			providesTags: (result) => {
				if (result) {
					return [
						{ type: 'Comment', id: 'LIST' },
						...result.comments.map((comment) => ({
							type: 'Comment',
							id: comment.id,
						})),
					];
				} else return [{ type: 'Event', id: 'LIST' }];
			},
		}),
		createComment: builder.mutation({
			query: (credentials) => ({
				url: `/comments/${credentials.eventId}`,
				method: 'POST',
				body: { content: credentials.content },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Comment', id: 'LIST' },
			],
		}),
		editComment: builder.mutation({
			query: (credentials) => ({
				url: `/comments/${credentials.commentId}`,
				method: 'PUT',
				body: { content: credentials.content },
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Comment', id: arg.commentId },
			],
		}),
		deleteComment: builder.mutation({
			query: (credentials) => ({
				url: `/comments/${credentials.commentId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Comment', id: 'LIST' },
			],
		}),
	}),
});

export const {
	useGetCommentsQuery,
	useCreateCommentMutation,
	useEditCommentMutation,
	useDeleteCommentMutation,
} = commentsApiSlice;
