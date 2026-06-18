import React, { useState } from 'react';
import {
  Bell, ChevronDown, Users, RotateCcw, MoreHorizontal, Download, 
  Calendar, Menu, X, Check, Activity, ShieldAlert, HeartPulse, 
  Stethoscope, BedDouble, Pill
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientManagement from './PatientManagement';
import DepartmentManagement from './DepartmentManagement';
import DoctorManagement from './DoctorManagement';


// --- Placeholder Hospital Subcomponents ---
// Replace these paths with your actual components later
const NurseManagement = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Nursing Staff Allocations Content</h2></div>;
const MedicineInventory = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Pharmacy Stock & Medicine Inventory Content</h2></div>;
const ProfileSettings = () => <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6"><h2>Account & Hospital Profile Settings</h2></div>;
const PageTitle = ({ title }) => null; // Handles document titles natively if used elsewhere

// --- Mock Medical Operational Data ---
const activeERAlerts = [
  { id: 1, type: 'Trauma Code Blue', location: 'ER - Bay 3', time: 'Just now', severity: 'bg-red-100 text-red-600' },
  { id: 2, type: 'Critical Lab Result', location: 'ICU - Bed 12', time: '4 mins ago', severity: 'bg-orange-100 text-orange-600' },
  { id: 3, type: 'Ambulance Inbound', location: 'Triage Entry', time: '12 mins ago', severity: 'bg-blue-100 text-blue-600' },
];

const theaterStatus = [
  { room: 'Operating Theater 01', procedure: 'Cardiovascular Surgery', doctor: 'Dr. Athun V', status: 'In Progress', color: 'text-amber-500 bg-amber-50' },
  { room: 'Operating Theater 02', procedure: 'Orthopedic Arthroplasty', doctor: 'Dr. Sarah Jenkins', status: 'Pre-Op Setup', color: 'text-blue-500 bg-blue-50' },
  { room: 'Operating Theater 03', procedure: 'Emergency Appendectomy', doctor: 'Dr. Marcus Vance', status: 'In Progress', color: 'text-amber-500 bg-amber-50' },
  { room: 'Operating Theater 04', procedure: 'Sterilization Cycle', doctor: 'N/A', status: 'Available', color: 'text-green-500 bg-green-50' },
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

  // Updated navigation links per request
  const navItems = ['Dashboard', 'Patient', 'Doctor', 'Nurse', 'Medicine','Department'];

  const toggleDropdown = (name) => setActiveDropdown(activeDropdown === name ? null : name);

  return (
    <div className="min-h-screen bg-[#F9FAFB]/90 text-slate-900 font-sans">
      <PageTitle title={`${activeTab} - Smart-HMS Med`} />
      
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
                  <span className="text-xl font-bold tracking-tight text-slate-900">Smart-HMS </span>
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
                <p className="p-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Clinical Alerts</p>
                <div className="space-y-1">
                  {activeERAlerts.map(alert => (
                    <div key={alert.id} className="flex gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${alert.severity}`}><Activity size={14} /></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{alert.type}</p>
                        <p className="text-xs text-gray-500">{alert.location} • {alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownWrapper>
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('profile')}
                className="flex items-center gap-3 pl-2 md:pl-4 focus:outline-none"
              >
                <img src="https://i.pravatar.cc/150?u=hospitaladmin" alt="Avatar" className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 object-cover" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold leading-none">Athun V</p>
                  <p className="text-xs text-gray-500 mt-1">Chief Administrator</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${activeDropdown === 'profile' ? 'rotate-180' : ''}`} />
              </button>
              <DropdownWrapper isOpen={activeDropdown === 'profile'}>
                <div className="p-2 space-y-1">
                  <button onClick={() => { setActiveTab('Account'); setActiveDropdown(null) }} className="w-full text-left p-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Hospital Settings</button>
                  <button className="w-full text-left p-3 text-sm font-medium hover:bg-gray-50 rounded-xl transition-colors">Staff Logs</button>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left p-3 text-sm font-medium text-red-500 hover:bg-red-50 rounded-xl transition-colors">System Log Out</button>
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
                <h1 className="sm:text-4xl text-2xl font-serif italic font-bold tracking-tight">Welcome back, Director Athun</h1>
                <p className="text-gray-600 mt-2 text-sm italic">Real-time status overview of hospital admissions, clinic rosters, and unit capacities.</p>
              </div>
              <div className="flex gap-3">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                  <Calendar size={16} /> Shift Schedule
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
                  <Download size={16} /> Census Report
                </button>
              </div>
            </header>

            {/* Medical KPI Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard title="Active Inpatients" value="1,248" change="84% Bed Occupancy" changeColor="text-blue-600" icon={BedDouble} />
              <StatCard title="On-Duty Physicians" value="42 Staff" change="3 Emergency Leads" changeColor="text-orange-500" icon={Stethoscope} />
              <StatCard title="ER Waiting Queue" value="14 Cases" change="-4 Avg triage load" changeColor="text-green-600" icon={HeartPulse} />
              <StatCard title="Critical Drug Stock" value="98.2%" change="2 Items require re-order" changeColor="text-red-500" icon={Pill} />
            </div>

            {/* Layout Panels: Replaced charts with contextual operational lists */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Emergency Department Alerts */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }}
                className="lg:col-span-2 bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">Critical ER / Trauma Central Feed</h3>
                    <p className="text-xs text-gray-400 mt-0.5">High priority action notifications</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>

                <div className="space-y-4">
                  {activeERAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${alert.severity}`}>
                          <ShieldAlert size={20} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{alert.type}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Location deployment: <span className="font-semibold">{alert.location}</span></p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-400">{alert.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Operating Theater Trackers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-[20px] border border-gray-100 shadow-sm flex flex-col"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Operating Theater Status</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Surgical unit monitors</p>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={20} /></button>
                </div>

                <div className="flex flex-col gap-4 flex-1 justify-center">
                  {theaterStatus.map((room, idx) => (
                    <div key={idx} className="flex flex-col p-3 rounded-xl border border-gray-50 hover:shadow-sm transition-all">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-900">{room.room}</p>
                        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${room.color}`}>{room.status}</span>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs text-gray-500 max-w-[70%] truncate">{room.procedure}</p>
                        <p className="text-[11px] text-gray-400 italic">{room.doctor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

            </div>
          </>
        )}

        {/* Dynamic Nav-Tab Routing Directives */}
        {activeTab === 'Patient' && <PatientManagement/>}
        {activeTab === 'Department' && <DepartmentManagement/>}
        {activeTab === 'Doctor' && <DoctorManagement />}
        {activeTab === 'Nurse' && <NurseManagement />}
        {activeTab === 'Medicine' && <MedicineInventory />}
        {activeTab === 'Account' && <ProfileSettings />}
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