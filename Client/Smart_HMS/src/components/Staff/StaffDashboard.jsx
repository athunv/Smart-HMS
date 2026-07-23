import React, { useState } from 'react';
import {
  Bell, ChevronDown, Calendar, Menu, X, CheckCircle2, 
  UserPlus, Clock, Stethoscope, Pill, CalendarCheck,
  MoreHorizontal, Download, Search, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Placeholder Subcomponents (Replace with your actual components) ---
import PatientManagement from '../Admin/PatientManagement';
import StaffProfile from './StaffProfile';
import MedicineManagement from './MedicineManagement';
const AppointmentManagement = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Book & Manage Appointments Content</h2></div>;
const DoctorSchedules = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Doctor Duty Roster & Schedules Content</h2></div>;
const PharmacyManagement = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Medicine Inventory & Prescriptions Content</h2></div>;
const ProfileSettings = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Staff Account Settings</h2></div>;
const PageTitle = ({ title }) => null; 

// --- Mock Staff Operational Data ---
const upcomingAppointments = [
  { id: 1, patient: 'Rahul Sharma', doctor: 'Dr. Athun V', time: '09:30 AM', type: 'General Checkup', status: 'Waiting', color: 'bg-orange-100 text-orange-600' },
  { id: 2, patient: 'Priya Patel', doctor: 'Dr. Sarah Jenkins', time: '10:00 AM', type: 'Consultation', status: 'Checked In', color: 'bg-blue-100 text-blue-600' },
  { id: 3, patient: 'Amit Kumar', doctor: 'Dr. Marcus Vance', time: '10:15 AM', type: 'Follow-up', status: 'Scheduled', color: 'bg-gray-100 text-gray-600' },
  { id: 4, patient: 'Sneha Reddy', doctor: 'Dr. Athun V', time: '10:45 AM', type: 'Vaccination', status: 'Scheduled', color: 'bg-gray-100 text-gray-600' },
];

const doctorAvailability = [
  { doctor: 'Dr. Athun V', dept: 'Cardiology', shift: '08:00 AM - 04:00 PM', status: 'Available', color: 'text-green-600 bg-green-50' },
  { doctor: 'Dr. Sarah Jenkins', dept: 'Orthopedics', shift: '09:00 AM - 05:00 PM', status: 'With Patient', color: 'text-amber-600 bg-amber-50' },
  { doctor: 'Dr. Marcus Vance', dept: 'General Med', shift: '08:00 AM - 02:00 PM', status: 'On Break', color: 'text-gray-600 bg-gray-100' },
  { doctor: 'Dr. Neha Gupta', dept: 'Pediatrics', shift: '12:00 PM - 08:00 PM', status: 'Off Duty', color: 'text-red-500 bg-red-50' },
];

// --- Dropdown Wrapper ---
const DropdownWrapper = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-2"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Aligned with Staff Roles: Patient Reg, Booking, Doctor Schedules, Medicine
  const navItems = ['Dashboard', 'Patients', 'Appointments', 'Schedules', 'Pharmacy'];

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  return (
    <div className="min-h-screen bg-[#F9FAFB]/90 text-slate-900 font-sans">
      <PageTitle title={`${activeTab} - Smart-HMS Staff`} />
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 p-6 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900">Smart-HMS</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map(item => (
                  <button
                    key={item}
                    onClick={() => { setActiveTab(item); setIsMobileMenuOpen(false); }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${
                      activeTab === item ? 'bg-[#C1E1A6] text-slate-900 shadow-sm' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#F9FAFB]/80 backdrop-blur-md px-4 md:px-8 py-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" className="w-8 h-auto object-contain sm:block hidden" alt="Logo" />
              <span className="text-2xl font-black font-serif tracking-tight text-slate-900">Smart-HMS</span>
            </div>
          </div>

          {/* Responsive Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center bg-white border border-gray-100 rounded-full px-2 py-1 shadow-sm">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === item ? 'bg-[#8ac857] text-slate-900 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* User Profile Action Set */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative">
              <button
                onClick={() => toggleDropdown('notif')}
                className={`p-2.5 rounded-xl transition-colors ${activeDropdown === 'notif' ? 'bg-orange-50 text-orange-500' : 'text-gray-400 hover:bg-white hover:shadow-sm'}`}
              >
                <Bell size={20} />
              </button>
              <DropdownWrapper isOpen={activeDropdown === 'notif'}>
                <p className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Staff Alerts</p>
                <div className="space-y-1 p-2">
                  <p className="text-sm text-gray-600">No new notifications</p>
                </div>
              </DropdownWrapper>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-3 pl-2 md:pl-4 focus:outline-none"
              >
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#8ac857] text-white flex items-center justify-center font-bold border border-gray-200">
                  SD
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-none">Staff Desk</p>
                  <p className="text-xs text-gray-500 mt-1">Receptionist</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownWrapper isOpen={activeDropdown === 'profile'}>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setActiveTab('Account'); setActiveDropdown(null) }} className="w-full text-left p-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">My Account</button>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">Log Out</button>
                </div>
              </DropdownWrapper>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container Views */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pb-12 relative">
        {activeTab === 'Dashboard' && (
          <>
            <header className="flex flex-col md:flex-row md:items-center justify-between my-8 gap-4">
              <div>
                <h1 className="sm:text-4xl text-2xl font-serif italic font-bold tracking-tight">Staff Overview</h1>
                <p className="text-gray-600 mt-2 text-sm italic">Manage patient registrations, appointments, and doctor schedules.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setActiveTab('Patients')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                  <UserPlus size={16} /> New Patient
                </button>
                <button onClick={() => setActiveTab('Appointments')} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#8ac857] text-slate-900 border border-transparent rounded-xl text-sm font-semibold shadow-sm hover:bg-[#7ebd4e] transition-colors">
                  <CalendarCheck size={16} /> Book Appointment
                </button>
              </div>
            </header>

            {/* Daily Staff KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard title="Today's Appointments" value="48" change="12 Remaining" changeColor="text-blue-600" icon={Calendar} />
              <StatCard title="New Registrations" value="14" change="+3 from yesterday" changeColor="text-green-600" icon={UserPlus} />
              <StatCard title="Doctors on Shift" value="12" change="View Schedules" changeColor="text-orange-500" icon={Stethoscope} />
              <StatCard title="Pharmacy Requisitions" value="5" change="Pending updates" changeColor="text-red-500" icon={Pill} />
            </div>

            {/* Layout Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Upcoming Appointments Queue */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Appointment Queue</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Upcoming patients for today</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><Search size={20} /></button>
                </div>

                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-2 rounded-xl text-sm font-bold flex flex-col items-center justify-center ${apt.color}`}>
                          <span>{apt.time.split(' ')[0]}</span>
                          <span className="text-[10px] uppercase">{apt.time.split(' ')[1]}</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{apt.patient}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{apt.type} • <span className="font-medium text-gray-700">{apt.doctor}</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${apt.status === 'Waiting' ? 'bg-orange-100 text-orange-700' : apt.status === 'Checked In' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'}`}>
                          {apt.status}
                        </span>
                        <button className="text-gray-400 hover:text-[#8ac857] transition-colors"><CheckCircle2 size={20}/></button>
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('Appointments')} className="w-full mt-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  View All Appointments
                </button>
              </motion.div>

              {/* Doctor Availability Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Doctor Status</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Current shift availability</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><Clock size={20} /></button>
                </div>

                <div className="flex flex-col gap-3 flex-1">
                  {doctorAvailability.map((doc, idx) => (
                    <div key={idx} className="flex flex-col p-3 rounded-xl border border-gray-50 hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-gray-900">{doc.doctor}</p>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide ${doc.color}`}>{doc.status}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500">{doc.dept}</p>
                        <p className="text-[11px] text-gray-400 font-medium">{doc.shift}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => setActiveTab('Schedules')} className="w-full mt-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                  Manage Schedules
                </button>
              </motion.div>

            </div>
          </>
        )}

        {/* Dynamic Nav-Tab Routing Directives */}
        {activeTab === 'Patients' && <PatientManagement />}
        {activeTab === 'Appointments' && <AppointmentManagement />}
        {activeTab === 'Schedules' && <DoctorSchedules />}
        {activeTab === 'Pharmacy' && <MedicineManagement />}
        {activeTab === 'Account' && <StaffProfile />}
      </main>
    </div>
  );
}

// Consistent Global Reusable KPI Cards
function StatCard({ title, value, change, changeColor, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-gray-500 font-medium text-sm">{title}</span>
        <div className="p-2 bg-gray-50 rounded-full text-slate-600">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
        <p className={`text-xs mt-2 font-medium ${changeColor}`}>
          {change}
        </p>
      </div>
    </motion.div>
  );
}