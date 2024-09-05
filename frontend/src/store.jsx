import { configureStore } from '@reduxjs/toolkit'
import authSliceReducer from './slices/authSlice'
import newUserSliceReducer from './slices/newUserSlice'
import { apiSlice } from './slices/apiSlice'
const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        newUser: newUserSliceReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true
})

export default store