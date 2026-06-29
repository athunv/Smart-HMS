import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const Base_urls = "http://127.0.0.1:8000";

export const fetchDoctor = createAsyncThunk("doctor/fetchDoctor", async () => {
  const res = await fetch(`${Base_urls}/doctor/`);
  if (!res.ok) throw new Error("Failed to fetch doctors");
  return await res.json();
});

export const addDoctor = createAsyncThunk("doctor/addDoctor", async (doctorFormData) => {
  const res = await fetch(`${Base_urls}/doctor/`, {
    method: "POST",
    // Do NOT set Content-Type manually. Fetch handles the multipart/form-data boundary automatically.
    body: doctorFormData, 
  });
  if (!res.ok) throw new Error("Doctor Registration Failed");
  return await res.json();
});

export const updateDoctor = createAsyncThunk("doctor/updateDoctor", async ({ id, doctor }) => {
  const res = await fetch(`${Base_urls}/doctor/${id}/`, {
    method: "PUT",
    body: doctor, // doctor is FormData
  });
  if (!res.ok) throw new Error("Update Failed");
  return await res.json();
});

export const deleteDoctor = createAsyncThunk("doctor/deleteDoctor", async (id) => {
  const res = await fetch(`${Base_urls}/doctor/${id}/`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to Delete");
  return id;
});

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
      // FETCH
      .addCase(fetchDoctor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchDoctor.fulfilled, (state, action) => { state.loading = false; state.doctors = action.payload; })
      .addCase(fetchDoctor.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // ADD
      .addCase(addDoctor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addDoctor.fulfilled, (state, action) => { state.loading = false; state.doctors.push(action.payload); })
      .addCase(addDoctor.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // UPDATE
      .addCase(updateDoctor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateDoctor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.doctors.findIndex((doc) => doc.id === action.payload.id);
        if (index !== -1) state.doctors[index] = action.payload;
      })
      .addCase(updateDoctor.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      
      // DELETE
      .addCase(deleteDoctor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteDoctor.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = state.doctors.filter((doc) => doc.id !== action.payload);
      })
      .addCase(deleteDoctor.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export default doctorSlice.reducer;