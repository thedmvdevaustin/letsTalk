import { apiSlice } from './apiSlice'
const USERS_URL = '/api/users'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchUser: builder.query({
            query: (user) => {
                //remember when you get a query parameter from a form
                //it is sometimes 
                //received as a URLSearchParams object so you have
                //to change it to a string first to get the value you 
                //sent from the form. check it with console.log() on 
                //the frontend and backend
                return `${USERS_URL}/search?name=${user.toString()}`
            }
        }),
        accessOneUser: builder.query({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}`
            })
        })
    })
})
// whenever you don't want to perform the query hook call when
// the component mounts and you want to perform the call inside
// an event handler you can use the useLazyQuery hook which 
// gives you a function for triggering the query

export const { useSearchUserQuery, useLazySearchUserQuery, useAccessOneUserQuery, useLazyAccessOneUserQuery } = usersApiSlice