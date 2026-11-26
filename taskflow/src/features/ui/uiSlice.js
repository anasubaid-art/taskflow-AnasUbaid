import { createSlice } from "@reduxjs/toolkit";

const savedTheme = localStorage.getItem("taskflow-theme");
const initialState = {
    theme: savedTheme || "dark",
    modal: null,
    toasts: []
};

const uiSlice = createSlice({
    name: "ui",
    initialState,

    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem("taskflow-theme", action.payload);
        },

        openModal: (state, action) => {
            state.modal = action.payload;
        },
        closeModal: (state) => {
            state.modal = null;
        },
        addToast: (state, action) => {
            state.toasts.push({
                id: Date.now(),
                message: action.payload
            });
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(
                (toast) => toast.id !== action.payload
            );
        }
    }
});

export const {
    setTheme,
    openModal,
    closeModal,
    addToast,
    removeToast
} = uiSlice.actions;
export default uiSlice.reducer;