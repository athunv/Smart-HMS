import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_URLs = "http://127.0.0.1:8000";

// GET PROFILE
export const fetchProfile = createAsyncThunk(
    "profile/fetchProfile",
    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("access");

            const res = await fetch(`${Base_URLs}/profile/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return await res.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("access");

            const res = await fetch(`${Base_URLs}/profile/edit/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            return await res.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);;

const ProfileSlice = createSlice({
    name: "profile",
    initialState: {
        profile: {},
        loading: false,
        error: null,
        updateLoading: false,
        updateSuccess: false,
    },
    reducers: {
        clearUpdateStatus: (state) => {
            state.updateSuccess = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder

            // FETCH
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // UPDATE
            .addCase(updateProfile.pending, (state) => {
                state.updateLoading = true;
                state.updateSuccess = false;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;
                state.profile = action.payload;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearUpdateStatus } = ProfileSlice.actions;
export default ProfileSlice.reducer;