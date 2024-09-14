import { apiSlice } from './apiSlice'
const CHAT_URL = '/api/chat'
import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'

const chatAdapter = createEntityAdapter({
    selectId: state => state._id,
    // sortComparer: (a,b) => b.updatedAt.localeCompare(a.date)
})

const chatInitialState = chatAdapter.getInitialState()

export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query({
            query: () => ({
                url: `${CHAT_URL}/`,
            }),
            transformResponse: responseData => {
                return chatAdapter.setAll(chatInitialState, responseData)
            },
            providesTags: ['Chats']
        }),
        accessChat: builder.query({
            query: (id) => ({
                url: `${CHAT_URL}/${id}`
            })
        }),
        createChat: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}/create`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Chats']
        }),
        addMember: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}/${data.id}/add`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Chats']
        }),
        removeMember: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}/${data.id}/remove`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Chats']
        }),
        renameChat: builder.mutation({
            query: (data) => ({
                url: `${CHAT_URL}/${data.id}/rename`,
                method: 'PUT',
                body: data
            }),
            invalidatesTags: ['Chats']
        })
    })
})

export const { useGetChatsQuery, useAccessChatQuery, useCreateChatMutation, useAddMemberMutation, useRemoveMemberMutation, useRenameChatMutation } = chatApiSlice

export const getChatsData = chatApiSlice.endpoints.getChats.select()

const getChatsResults = createSelector(
    getChatsData,
    chatResult => chatResult.data
)

export const {
    selectAll: selectChats,
    selectById: selectChatsById,
    selectIds: selectChatsId
} = chatAdapter.getSelectors(state => getChatsResults(state) ?? chatInitialState)