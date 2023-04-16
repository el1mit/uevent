import { apiSlice } from '../../app/api/apiSlice';

export const walletApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getWallet: builder.query({
			query: () => ({
				url: '/wallet',
				method: 'GET',
			}),
			providesTags: () => [{ type: 'Wallet', id: 'LIST' }],
		}),
		depositWallet: builder.mutation({
			query: (credentials) => ({
				url: '/wallet/top-up',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: () => [{ type: 'Wallet', id: 'LIST' }],
		}),
		withdrawWallet: builder.mutation({
			query: (credentials) => ({
				url: '/wallet/withdraw',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: () => [{ type: 'Wallet', id: 'LIST' }],
		}),
	}),
});

export const {
	useGetWalletQuery,
	useDepositWalletMutation,
	useWithdrawWalletMutation,
} = walletApiSlice;
