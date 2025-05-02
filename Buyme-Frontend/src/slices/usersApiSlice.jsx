import { apiSlice } from './apiSlice';
const USERS_URL = '/api';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth/login`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: (data) => {
        console.log('Logout API called with data:', data)
        return{
        url: `${USERS_URL}/auth/logout`,
        method: 'POST',
        body: data
      }},
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/user`,
        method: 'POST',
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),

    getAllUsers: builder.query({
      query: () => ({
        url: `/api/user`,
        method: 'GET'
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useGetAllUsersQuery 
} = userApiSlice;