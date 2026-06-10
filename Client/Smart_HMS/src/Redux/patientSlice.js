import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_URLs = "http://127.0.0.1:8000";


// GET ALL PATIENTS
export const fetchPatient = createAsyncThunk(
    "patients/fetchPatient",
    async () => {
        const res = await fetch(`${Base_URLs}/patient/`);
        return await res.json();
    }
);


// CREATE PATIENT
export const addPatient = createAsyncThunk(
    "patients/addPatient",
    async (patient) => {
        const res = await fetch(`${Base_URLs}/patient/`, {
            method: "POST",
            body: patient, // FormData
        });

        if (!res.ok) {
            throw new Error("Patient Registration Failed");
        }

        return await res.json();
    }
);


// UPDATE PATIENT
export const updatePatient = createAsyncThunk(
    "patients/updatePatient",
    async ({ id, patient }) => {
        const res = await fetch(`${Base_URLs}/patient/${id}/`, {
            method: "PUT",
            body: patient,
        });

        if (!res.ok) {
            throw new Error("Update Failed");
        }

        return await res.json();
    }
);


// DELETE PATIENT
export const deletePatient = createAsyncThunk(
    "patients/deletePatient",
    async (id) => {
        const res = await fetch(`${Base_URLs}/patient/${id}/`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Delete Failed");
        }

        return id;
    }
);


const patientSlice = createSlice({
    name: "patients",

    initialState: {
        patients: [],
        loading: false,
        error: null,
    },

    reducers: {},

    extraReducers: (builder) => {

        builder

            .addCase(fetchPatient.pending, (state) => {
                state.loading = true;
            })

            .addCase(fetchPatient.fulfilled, (state, action) => {
                state.loading = false;
                state.patients = action.payload;
            })

            .addCase(fetchPatient.rejected, (state) => {
                state.loading = false;
                state.error = "Failed To Load Patients";
            })

            .addCase(addPatient.fulfilled, (state, action) => {
                state.patients.push(action.payload);
            })

            .addCase(updatePatient.fulfilled, (state, action) => {

                const index = state.patients.findIndex(
                    patient => patient.id === action.payload.id
                );

                if (index !== -1) {
                    state.patients[index] = action.payload;
                }
            })

            .addCase(deletePatient.fulfilled, (state, action) => {
                state.patients = state.patients.filter(
                    patient => patient.id !== action.payload
                );
            });
    }
});

export default patientSlice.reducer;