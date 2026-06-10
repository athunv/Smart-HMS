import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_urls = "http://127.0.0.1:8000";

export const fetchDepartment = createAsyncThunk(
    "department/fetchDepartment",
    async () => {
        const res = await fetch(`${Base_urls}/department/`);
        return await res.json();
    }
);

// Example fix for adddepartment (apply the same headers/stringify to updatedepartment)
export const adddepartment = createAsyncThunk(
    "department/adddepartment",
    async (department) => {
        const res = await fetch(`${Base_urls}/department/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Crucial for Django DRF
            },
            body: JSON.stringify(department), // Crucial to stringify the payload
        });
        if (!res.ok) throw new Error("department Registration Failed");
        return await res.json();
    }
);

export const updatedepartment = createAsyncThunk(
    "department/updatedepartment",
    async ({ id, department }) => {
        const res = await fetch(`${Base_urls}/department/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json", // ADD THIS
            },
            body: JSON.stringify(department), // ADD THIS
        });
        if (!res.ok) throw new Error("Update Failed");
        return await res.json();
    }
);

export const deletedepartment = createAsyncThunk(
    "department/deletedepartment",
    async (id) => {
        const res = await fetch(`${Base_urls}/department/${id}/`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to Delete");
        }

        return id;
    }
);

const departmentSlice = createSlice({
    name: "departments",
    initialState: {
        departments: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // FETCH departmentS
            .addCase(fetchDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments = action.payload;
            })
            .addCase(fetchDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // ADD department
            .addCase(adddepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(adddepartment.fulfilled, (state, action) => {
                state.loading = false;
                state.departments.push(action.payload);
            })
            .addCase(adddepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // UPDATE department
            .addCase(updatedepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(updatedepartment.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.departments.findIndex(
                    (department) => department.id === action.payload.id
                );

                if (index !== -1) {
                    state.departments[index] = action.payload;
                }
            })
            .addCase(updatedepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // DELETE department
            .addCase(deletedepartment.pending, (state) => {
                state.loading = true;
            })
            .addCase(deletedepartment.fulfilled, (state, action) => {
                state.loading = false;

                state.departments = state.departments.filter(
                    (department) => department.id !== action.payload
                );
            })
            .addCase(deletedepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default departmentSlice.reducer;