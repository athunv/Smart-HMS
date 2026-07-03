import axios from 'axios'


export const BASE_URLs = 'http://127.0.0.1:8000'

export const LoginApi = (data) => {
    return axios.post(`${BASE_URLs}/login/`, data)
}

export const GetDoctorListApi = () => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/doctors/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export const GetDoctorDetailsApi = (id) => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/doctor-details/${id}/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export const GetMyAppoinmentsApi = (id) => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/appointments/my/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}


export const GetPrescriptionsApi = (id) => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/patient/prescriptions/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}
export const MyProfileApi = () => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/profile/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export const MyProfileEditApi = (data) => {
    const access = sessionStorage.getItem('access')
    return axios.put(`${BASE_URLs}/profile/edit/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
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


// Create Staff
export const StaffCreateApi = (data) => {
    const access = sessionStorage.getItem('access')
    return axios.post(`${BASE_URLs}/staff/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

// Update Staff
export const StaffUpdateApi = (data, id) => {
    const access = sessionStorage.getItem('access')
    return axios.put(`${BASE_URLs}/staff/${id}/`, data, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

// Get Staff List
export const GetStaffListApi = () => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/staff/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

// Delete Staff
export const DeleteStaffApi = (id) => {
    const access = sessionStorage.getItem('access')
    return axios.delete(`${BASE_URLs}/staff/${id}/`, {
        headers: {
            Authorization: `Bearer ${access}`
        }
    })
}

export const fetchAvailableSlotAPi = () => {
    const access = sessionStorage.getItem('access')
    return axios.get(`${BASE_URLs}/slots/${selectedDoctor.id}/${selectedDate}/`, {
        headers: { Authorization: `Barear ${access}` }
    })
}

// In AllApi.js
export const GetAvailableSlotsApi = (doctorId, date) => {
    const access = sessionStorage.getItem('access');
    return axios.get(`${BASE_URLs}/slots/${doctorId}/${date}/`, {
        headers: { Authorization: `Bearer ${access}` }
    });
};

export const GetDoctorAppoinmentsApi = (doctorId, date) => {
    const access = sessionStorage.getItem('access');
    return axios.get(`${BASE_URLs}/appointments/`, {
        headers: { Authorization: `Bearer ${access}` }
    });
};