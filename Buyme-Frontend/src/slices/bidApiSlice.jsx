import { apiSlice } from './apiSlice';

export const bidApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    placeBid: builder.mutation({
      query: ({ itemId, bidData }) => ({
        url: `/api/bid/${itemId}`,
        method: 'POST',
        body: bidData,
      }),
    }),

    getBidsByItem: builder.query({
        query: (itemId) => ({
          url: `/api/bid/${itemId}`,
          method: 'GET',
        }),
      }),
  }),
});

export const { 
    usePlaceBidMutation,
    useGetBidsByItemQuery 
} = bidApiSlice;
