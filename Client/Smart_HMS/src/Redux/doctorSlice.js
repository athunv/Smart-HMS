import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_urls = "http://127.0.0.1:8000";

export const fetchDoctor = createAsyncThunk(
    "doctor/fetchDoctor",
    async () => {
        const res = await fetch(`${Base_urls}/doctor/`);
        return await res.json();
    }
);

// Example fix for addDoctor (apply the same headers/stringify to updateDoctor)
export const addDoctor = createAsyncThunk(
    "doctor/addDoctor",
    async (doctor) => {
        const res = await fetch(`${Base_urls}/doctor/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Crucial for Django DRF
            },
            body: JSON.stringify(doctor), // Crucial to stringify the payload
        });
        if (!res.ok) throw new Error("Doctor Registration Failed");
        return await res.json();
    }
);

export const updateDoctor = createAsyncThunk(
    "doctor/updateDoctor",
    async ({ id, doctor }) => {
        const res = await fetch(`${Base_urls}/doctor/${id}/`, {
            method: "PUT",
            body: doctor,
        });

        if (!res.ok) {
            throw new Error("Update Failed");
        }

        return await res.json();
    }
);

export const deleteDoctor = createAsyncThunk(
    "doctor/deleteDoctor",
    async (id) => {
        const res = await fetch(`${Base_urls}/doctor/${id}/`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to Delete");
        }

        return id;
    }
);

const doctorSlice = createSlice({
    name: "doctors",
    initialState: {
        doctors: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            // FETCH DOCTORS
            .addCase(fetchDoctor.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors = action.payload;
            })
            .addCase(fetchDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // ADD DOCTOR
            .addCase(addDoctor.pending, (state) => {
                state.loading = true;
            })
            .addCase(addDoctor.fulfilled, (state, action) => {
                state.loading = false;
                state.doctors.push(action.payload);
            })
            .addCase(addDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // UPDATE DOCTOR
            .addCase(updateDoctor.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateDoctor.fulfilled, (state, action) => {
                state.loading = false;

                const index = state.doctors.findIndex(
                    (doctor) => doctor.id === action.payload.id
                );

                if (index !== -1) {
                    state.doctors[index] = action.payload;
                }
            })
            .addCase(updateDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // DELETE DOCTOR
            .addCase(deleteDoctor.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteDoctor.fulfilled, (state, action) => {
                state.loading = false;

                state.doctors = state.doctors.filter(
                    (doctor) => doctor.id !== action.payload
                );
            })
            .addCase(deleteDoctor.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default doctorSlice.reducer;