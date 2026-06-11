import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminDashboard from './components/Admin/AdminDashboard'

import store from './Redux/store'
import { Provider } from 'react-redux'
import Login from './components/Auth/Login'
import DoctorDashboard from './components/Doctor/DoctorDashboard'
import PatientProfile from './components/Patient/PatientProfile'
import DoctorsDirectory from './components/Patient/DoctorsDirectory'


function App() {
  return (
    <Provider store={store}>
      <div>
      <BrowserRouter>
      <Routes>
        <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
        <Route path='' element={<Login/>}/>
        <Route path='doctor-dashboard' element={<DoctorDashboard/>}/>
        <Route path='patient-dashboard' element={<PatientProfile/>}/>

        <Route path='patient/doctors' element={<DoctorsDirectory/>}/>


      </Routes>
      </BrowserRouter>
    </div>
    </Provider>
    
  )
}

export default App