import axios from 'axios'


export const BASE_URLs = 'http://127.0.0.1:8000'

export const LoginApi =(data)=>{
    return axios.post(`${BASE_URLs}/login/`,data)
}



export const GetDoctorSchedulesApi = () => {
    return axios.get(`${BASE_URLs}/doctor-schedule/`);
};

// POST: Add a new schedule
export const DoctorsheduleApi = (data) => {
    return axios.post(`${BASE_URLs}/doctor-schedule/`, data);
};

// PUT: Update an existing schedule by ID
export const UpdateDoctorScheduleApi = (id, data) => {
    return axios.put(`${BASE_URLs}/doctor-schedule/${id}/`, data);
};

// DELETE: Remove a schedule by ID
export const DeleteDoctorScheduleApi = (id) => {
    return axios.delete(`${BASE_URLs}/doctor-schedule/${id}/`);
};


// ----------------------------------------
// AVAILABLE SLOTS API
// ----------------------------------------

// GET: Fetch available time slots for a specific doctor on a specific date
export const GetAvailableSlotsApi = (doctorId, date) => {
    return axios.get(`${BASE_URLs}/slots/${doctorId}/${date}/`);
};