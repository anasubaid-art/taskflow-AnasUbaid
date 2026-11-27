import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const savedAuth = localStorage.getItem("taskflow-auth");
const initialState = savedAuth
? JSON.parse(savedAuth)
: {
    user: null,
    loading: false,
    error: null
};

export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `http://localhost:5000/users?email=${encodeURIComponent(loginData.email)}`
            );
            if (!response.ok) {
                return rejectWithValue("Unable to connect to server");
            }
            const users = await response.json();
            const user= users.find(
                (item) => item.password === loginData.password
            );
            if (!user) {
                return rejectWithValue("Invalid email or password");
            }

            const { password, ...userData } = user;
            return userData;
        } catch {
            return rejectWithValue("Something went wrong");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null,
            state.loading = false;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.error = null;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;