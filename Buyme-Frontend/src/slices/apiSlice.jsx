import { createApi,fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: '',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.userInfo?.data;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
      },
});

export const apiSlice= createApi({
    baseQuery,
    endpoints: (builder) =>({}),
    tagTypes: ['User', 'Auction']
})