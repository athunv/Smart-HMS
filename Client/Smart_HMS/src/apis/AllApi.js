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


// # Category URLs
//     path('categories/', views.MedicineCategoryListCreateView.as_view(), name='category-list-create'),
//     path('categories/<int:pk>/', views.MedicineCategoryDetailView.as_view(), name='category-detail'),

//     # Medicine URLs
//     path('medicines/', views.MedicineListCreateView.as_view(), name='medicine-list-create'),
//     path('medicines/<int:pk>/', views.MedicineDetailView.as_view(), name='medicine-detail'),

//     # Batch URLs
//     path('batches/', views.MedicineBatchListCreateView.as_view(), name='batch-list-create'),
//     path('batches/<int:pk>/', views.MedicineBatchDetailView.as_view(), name='batch-detail'),

export const AddMeddicineCategoryApi=(data)=>{
    return axios.post(`${BASE_URLs}/med/categories/`,data)
}
export const GetMeddicineCategoryApi=()=>{
    return axios.get(`${BASE_URLs}/med/categories/`)
}

// GET: List all categories
export const GetMedicineCategoriesApi = () => {
    return axios.get(`${BASE_URLs}/med/categories/`);
};

// POST: Create a new category
export const AddMedicineCategoryApi = (data) => {
    return axios.post(`${BASE_URLs}/med/categories/`, data);
};

// GET: Retrieve a single category by ID
export const GetMedicineCategoryByIdApi = (id) => {
    return axios.get(`${BASE_URLs}/med/categories/${id}/`);
};

// PUT/PATCH: Update a category by ID
export const UpdateMedicineCategoryApi = (id, data) => {
    return axios.put(`${BASE_URLs}/med/categories/${id}/`, data);
    // Note: If you only want to update partial fields, use axios.patch instead
};

// DELETE: Delete a category by ID
export const DeleteMedicineCategoryApi = (id) => {
    return axios.delete(`${BASE_URLs}/med/categories/${id}/`);
};

// ==========================================
// 2. MEDICINE APIs
// ==========================================

// GET: List all medicines
export const GetMedicinesApi = () => {
    return axios.get(`${BASE_URLs}/medicines/`);
};

// POST: Create a new medicine
export const AddMedicineApi = (data) => {
    return axios.post(`${BASE_URLs}/medicines/`, data);
};

// GET: Retrieve a single medicine by ID
export const GetMedicineByIdApi = (id) => {
    return axios.get(`${BASE_URLs}/medicines/${id}/`);
};

// PUT/PATCH: Update a medicine by ID
export const UpdateMedicineApi = (id, data) => {
    return axios.put(`${BASE_URLs}/medicines/${id}/`, data);
};

// DELETE: Delete a medicine by ID
export const DeleteMedicineApi = (id) => {
    return axios.delete(`${BASE_URLs}/medicines/${id}/`);
};

// ==========================================
// 3. MEDICINE BATCH APIs
// ==========================================

// GET: List all batches
export const GetMedicineBatchesApi = () => {
    return axios.get(`${BASE_URLs}/med/batches/`);
};

// POST: Create a new batch
export const AddMedicineBatchApi = (data) => {
    return axios.post(`${BASE_URLs}/med/batches/`, data);
};

// GET: Retrieve a single batch by ID
export const GetMedicineBatchByIdApi = (id) => {
    return axios.get(`${BASE_URLs}/med/batches/${id}/`);
};

// PUT/PATCH: Update a batch by ID
export const UpdateMedicineBatchApi = (id, data) => {
    return axios.put(`${BASE_URLs}/med/batches/${id}/`, data);
};

// DELETE: Delete a batch by ID
export const DeleteMedicineBatchApi = (id) => {
    return axios.delete(`${BASE_URLs}/med/batches/${id}/`);
};