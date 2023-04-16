import { apiSlice } from '../../app/api/apiSlice';

export const categoriesApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => ({
				url: `/categories`,
				method: 'GET',
			}),
			invalidatesTags: (result, error, arg) => [
				{ type: 'Category', id: 'LIST' },
			],
		}),
	}),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
