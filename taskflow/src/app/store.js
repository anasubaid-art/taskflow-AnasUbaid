import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import uiReducer from "../features/ui/uiSlice";

import { api } from "./api";
import persistMiddleware from "./persistMiddleware";

const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
    [api.reducerPath]: api.reducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            api.middleware,
            persistMiddleware
        )
});

export default store;