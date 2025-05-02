import { apiSlice } from './apiSlice';

export const itemApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createItem: builder.mutation({
      query: (itemData) => ({
        url: '/api/item',
        method: 'POST',
        body: itemData,
      }),
      invalidatesTags: ['Auction'],
    }),

    addItemToAuction: builder.mutation({
      query: ({ auctionId, itemId }) => ({
        url: `/api/item/auction/${auctionId}/item/${itemId}`,
        method: 'POST',
      }),
      invalidatesTags: ['Auction'],
    }),

    getItemById: builder.query({
      query: (itemId) => ({
        url: `/api/item/${itemId}`,
        method: 'GET',
      }),
    }),

    getAllItems: builder.query({
      query: (itemId) => ({
        url: `/api/item/`,
        method: 'GET',
      }),
    }),

    deleteItem: builder.mutation({
      query: (itemId) => ({
        url: `/api/item/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Item'],
    }),
  }),
});

export const {
  useCreateItemMutation,
  useAddItemToAuctionMutation,
  useGetItemByIdQuery,
  useGetAllItemsQuery,
  useDeleteItemMutation,
} = itemApiSlice;
