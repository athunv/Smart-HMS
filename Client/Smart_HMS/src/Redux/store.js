import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "../Redux/patientSlice";
import doctorReducer from '../Redux/doctorSlice'
import departmentReducer from '../Redux/departmentSlice'
const store = configureStore({
    reducer:{
        patients : patientReducer,
        doctors:doctorReducer,
        departments:departmentReducer,
    }
})

export default store