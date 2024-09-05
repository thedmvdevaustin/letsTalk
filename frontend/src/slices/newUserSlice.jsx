import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    newUser: null
}

const newUserSlice = createSlice({
    name: 'newUser',
    initialState,
    reducers: {
        setNewUser(state, action){
            state.newUser = action.payload
        }
    }
})

export const { setNewUser } = newUserSlice.actions

export default newUserSlice.reducer