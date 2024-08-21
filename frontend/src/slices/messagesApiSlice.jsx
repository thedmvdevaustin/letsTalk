import { apiSlice } from './apiSlice'
const MESSAGES_URL = '/api/message'

export const messagesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        postMessage: builder.mutation({
            query: ([message, id]) => ({
                url: `${MESSAGES_URL}/${id}`,
                method: 'POST',
                body: { message }
            }),
        })
    })
})

export const { usePostMessageMutation } = messagesApiSlice