import { apiSlice } from './apiSlice';

export const auctionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAuctions: builder.query({
      query: () => ({
        url: '/api/auction/',
        method: 'GET',
      }),
      providesTags: ['Auction']
    }),

    getAuctionById: builder.query({
      query: (id) => ({
        url: `/api/auction/${id}`,
        method: 'GET',
      }),
    }),
    
    getAuctionItems: builder.query({
      query: (id) => ({
        url: `/api/item/auction/${id}`,
        method: 'GET',
      }),
    }),

    getMyAuctions: builder.query({
        query: (sellerId) => {
            console.log('Seller ID:', sellerId);
            return `/api/auction/?seller_id=${sellerId}`;
          },
      providesTags: ['Auction'],
    }),

    createAuction: builder.mutation({
      query: (body) => ({
        url: '/api/auction/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auction'],
    }),

    updateAuction: builder.mutation({
      query: ({ id, body }) => ({
        url: `/api/auction/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Auction'],
    }),

    deleteAuction: builder.mutation({
      query: (id) => ({
        url: `/api/auction/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Auction'],
    }),

    getAuctionParticipants: builder.query({
    query: (auctionId) => ({
      url: `/api/auction/participants/${auctionId}`,
      method: 'GET'
    }),
  }),

  participateInAuction: builder.mutation({
    query: (auctionId) => ({
      url: `/api/auction/participate/${auctionId}`,
      method: 'POST',
    }),
  }),

  }),
});

export const {
  useGetAuctionsQuery,
  useGetAuctionByIdQuery,
  useGetAuctionItemsQuery,
  useGetMyAuctionsQuery,
  useCreateAuctionMutation,
  useUpdateAuctionMutation,
  useDeleteAuctionMutation,
  useGetAuctionParticipantsQuery,
  useParticipateInAuctionMutation,
} = auctionApiSlice;
