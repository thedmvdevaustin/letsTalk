import { apiSlice } from './apiSlice'
const AUTH_URL = '/api'
// const CONVERSATIONS_URL = '/api/conversations'
// import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

// const usersAdapter = createEntityAdapter({
//     selectId: state => state._id
// })

// const usersInitialState = usersAdapter.getInitialState()



export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (user) => ({
                url: `${AUTH_URL}/register`,
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['Chats', 'Messages', 'Users']
        }),
        login: builder.mutation({
            query: (user) => ({
                url: `${AUTH_URL}/`,
                method: 'POST',
                body: user
            }),
            invalidatesTags: ['Chats', 'Messages']
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${AUTH_URL}/logout`,
                method: 'POST',
            })
        }),
        // getAllUser: builder.query({
        //     query: () => ({
        //         url: `${CONVERSATIONS_URL}/users`
        //     }),
        //     transformResponse: responseData => {
        //         return usersAdapter.setAll(usersInitialState, responseData)
        //     },
        //     providesTags: ['Users']
        // }),
    })
})

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApiSlice 

