import { apiSlice } from './apiSlice';

export const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/notify/bid/notification',
    }),
    notifyBid: builder.mutation({
      query: (payload) => ({
        url: '/notify/bid/notify',
        method: 'POST',
        body: payload,
      }),
    }),
  })
});

export const {
  useGetNotificationsQuery,
  useNotifyBidMutation
} = notificationApiSlice;
