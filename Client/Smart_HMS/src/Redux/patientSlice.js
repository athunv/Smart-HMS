import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_URLs = "http://127.0.0.1:8000";

// Helper to prepare headers and body dynamically
const prepareRequestBody = (data) => {
    const isFormData = data instanceof FormData;
    return {
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? data : JSON.stringify(data)
    };
};

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
    async (patient, { rejectWithValue }) => {
        try {
            const { headers, body } = prepareRequestBody(patient);
            const res = await fetch(`${Base_URLs}/patient/`, {
                method: "POST",
                headers,
                body,
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// UPDATE PATIENT
export const updatePatient = createAsyncThunk(
    "patients/updatePatient",
    async ({ id, patient }, { rejectWithValue }) => {
        try {
            const { headers, body } = prepareRequestBody(patient);
            const res = await fetch(`${Base_URLs}/patient/${id}/`, {
                method: "PUT",
                headers,
                body,
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data);
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// DELETE PATIENT
export const deletePatient = createAsyncThunk(
    "patients/deletePatient",
    async (id, { rejectWithValue }) => {
        try {
            const res = await fetch(`${Base_URLs}/patient/${id}/`, {
                method: "DELETE",
            });

            if (!res.ok) {
                const data = await res.json();
                return rejectWithValue(data);
            }

            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
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
            .addCase(fetchPatient.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed To Load Patients";
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