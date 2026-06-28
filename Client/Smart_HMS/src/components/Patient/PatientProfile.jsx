import React, { useEffect, useState } from 'react';
import {
  Menu, X, Edit3, Trash2, User, Calendar, Pill, Activity,
  Phone, Mail, MapPin, Star, Video, MessageCircle, ChevronRight,
  Heart, ShieldCheck, Plus, Clock, Eye, AlertCircle, Loader2, Save
} from 'lucide-react';
import { BASE_URLs, GetDoctorListApi, GetMyAppoinmentsApi, GetPrescriptionsApi, MyProfileApi, MyProfileEditApi } from '../../apis/AllApi';
import { toast } from 'react-toastify';
import DoctorsDirectory from './DoctorsDirectory';

export default function PatientProfile() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab,setActiveTab]  = useState('Dashboard')

  const [patient, setPatient] = useState({});
  const [editData, setEditData] = useState({});
  const [doctorsData, setDoctorsData] = useState([]);
  const [myAppoinments, setAppoinments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  // Data Fetching
  const fetchProfile = async () => {
    try {
      const res = await MyProfileApi();
      setPatient(res.data);
      // Pre-fill edit data from fetched profile
      setEditData({
        first_name: res.data?.user?.first_name || '',
        last_name: res.data?.user?.last_name || '',
        phone: res.data?.user?.phone || '',
        address: res.data?.user?.address || '',
        gender: res.data?.gender || '',
        DOB: res.data?.DOB || '',
        blood_group: res.data?.blood_group || '',
        weight: res.data?.weight || '',
        height: res.data?.height || '',
      
      });
    } catch (err) {
      console.log(err);
      toast.error("Error Fetching Profile Data");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await GetDoctorListApi();
      setDoctorsData(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppoinments = async () => {
    try {
      const res = await GetMyAppoinmentsApi();
      setAppoinments(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const res = await GetPrescriptionsApi();
      setPrescriptions(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Load all data concurrently
    Promise.all([
      fetchProfile(),
      fetchDoctors(),
      fetchAppoinments(),
      fetchPrescriptions()
    ]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    const payload = {
      user: {
        first_name: editData.first_name,
        last_name: editData.last_name,
        phone: editData.phone,
        address: editData.address,
      },
      gender: editData.gender,
      DOB: editData.DOB,
      blood_group: editData.blood_group,
    };

    MyProfileEditApi(payload).then(() => {
      toast.success('Profile Updated Successfully');
      fetchProfile();
      setIsEditModalOpen(false);
    }).catch((err) => {
      console.log(err);
      toast.error('Failed to update profile');
    });
  };

  const triggerDelete = () => {
    if (window.confirm('Are you absolutely sure you want to securely clear this master medical register profile?')) {
      toast.success('Secure record clearance cycle completed successfully.');
    }
  };

  // Loading Screen Overlay
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fbf7] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#8ac857] animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Syncing Medical Vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fbf7] text-slate-900 selection:bg-[#8ac857]/30 selection:text-slate-900 antialiased pb-24">

      {/* PREMIUM GLASSMORPHIC NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Branding Shield */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#8ac857] flex items-center justify-center text-white shadow-lg shadow-[#8ac857]/30 transform hover:rotate-6 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 block">AeroHealth</span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase block -mt-1">Premium Portal</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
              {['Dashboard', 'Find Doctors', 'Treatments', 'Medical Vault'].map((link, idx) => (
                <button
          key={link}
          // 2. Dynamically check if the current link matches the activeTab state
          className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
            activeTab === link
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
          }`}
          // 3. Update the state when a button is clicked
          onClick={() => setActiveTab(link)}
        >
          {link}
        </button>
              ))}
            </div>

            {/* User Profile Summary Utility */}
            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{patient.user?.first_name} {patient.user?.last_name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{patient.patient_code}</p>
              </div>
              <img
                src={patient.user?.photo ? `${BASE_URLs}${patient.user?.photo}` : 'https://ui-avatars.com/api/?name=' + patient.user?.first_name}
                alt="Account Avatar"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#8ac857]/20"
              />
            </div>

            {/* Mobile Navigation Trigger Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsNavOpen(!isNavOpen)}
                className="p-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100 transition"
              >
                {isNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Drawer Overlay */}
        {isNavOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-4 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
           {['Dashboard', 'Find Doctors', 'Treatments', 'Medical Vault'].map((link) => (
    <button
      key={link}
      // 1. Dynamically apply styles if the mobile link matches the active state
      className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition ${
        activeTab === link
          ? 'bg-slate-100 text-slate-900' 
          : 'text-slate-700 hover:bg-slate-50'
      }`}
      // 2. Update the state when clicked
      onClick={() => setActiveTab(link)}
    >
      {link}
    </button>
  ))}
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3 px-4">
              <img src={patient.user?.photo ? `${BASE_URLs}${patient.user?.photo}` : 'https://ui-avatars.com/api/?name=User'} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-900">{patient.user?.first_name} {patient.user?.last_name}</p>
                <p className="text-xs text-slate-400 font-mono">{patient.patient_code}</p>
              </div>
            </div>
          </div>
        )}
      </nav>


      {/* DASHBOARD MODERN BENTO GRID ARCHITECTURE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {activeTab==='Dashboard'&&(
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* BLOCK 1: PATIENT COMPREHENSIVE PROFILE CARD */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#8ac857]/5 rounded-bl-full pointer-events-none"></div>

            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4 lg:gap-6">
                  <img
                    src={patient.user?.photo ? `${BASE_URLs}${patient.user?.photo}` : 'https://ui-avatars.com/api/?name=' + patient.user?.first_name}
                    alt="Master Profile Content"
                    className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-[#8ac857]/10"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1 bg-[#8ac857]/10 text-[#5f9634] font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Core Registry Record
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">{patient.user?.first_name} {patient.user?.last_name}</h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">UID: {patient.patient_code}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-[#8ac857]/10 text-slate-700 hover:text-[#5f9634] border border-slate-100 hover:border-[#8ac857]/20 rounded-xl text-xs font-bold transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                  <button
                    onClick={triggerDelete}
                    className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-100 hover:border-rose-100 rounded-xl transition-all"
                    title="Purge Profile Index"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><User className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Age Parameter</p><p className="text-sm font-semibold text-slate-800">{patient.age || 'N/A'} Years Old</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Phone className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Secure Contact</p><p className="text-sm font-semibold text-slate-800">{patient.user?.phone || 'Not Set'}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Mail className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Encrypted Email</p><p className="text-sm font-semibold text-slate-800 break-all">{patient.user?.email}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><MapPin className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Primary Residence</p><p className="text-sm font-semibold text-slate-800 truncate max-w-[240px]">{patient.user?.address || 'Not Set'}</p></div>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCK 2: VITALS TRACKER */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#8ac857]/10 rounded-full blur-2xl"></div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biometrics</span>
              <div className="px-2 py-0.5 rounded bg-[#8ac857]/20 text-[#8ac857] font-mono text-[10px] font-bold">Live Sync</div>
            </div>

            <div className="my-auto py-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Blood Factor</span>
                <span className="text-lg font-extrabold text-[#8ac857]">{patient.blood_group || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Mass (Weight)</span>
                <span className="text-lg font-extrabold">{patient.weight ? `${patient.weight} kg` : 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Stature (Height)</span>
                <span className="text-lg font-extrabold">{patient.height ? `${patient.height} cm` : 'N/A'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
              <Heart className="w-4 h-4 text-[#8ac857] mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-slate-300 leading-normal">Cardiovascular metrics synchronized automatically via localized healthcare secure bands.</p>
            </div>
          </div>

          {/* BLOCK 3: TIMELINE AND APPOINTMENT TRACKER */}
          <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-md text-slate-900 tracking-tight">Latest Consultations</h3>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              </div>

              <div className="space-y-3">
                {myAppoinments.length > 0 ? myAppoinments.slice(0, 2).map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-2xl transition group">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {item.appointment_date}
                      </span>
                      <span className={`px-2 py-0.5 font-bold rounded-md uppercase tracking-wider text-[9px] ${item.status === 'confirmed' ? 'bg-[#8ac857]/10 text-[#5f9634]' : 'bg-amber-100 text-amber-700'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                    {/* Assuming doctor object might be populated or just showing ID for now */}
                    <p className="text-sm font-bold text-slate-900 mt-2 group-hover:text-[#8ac857] transition-colors">Doctor ID: {item.doctor}</p>
                    <p className="text-xs text-slate-400 font-medium">Token: #{item.token_number}</p>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 text-center py-4">No recent appointments found.</p>
                )}
              </div>
            </div>

            <button className="w-full mt-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-100 transition-all">
              Manage Appointment Calendar
            </button>
          </div>

          {/* BLOCK 4: MEDICAL PRESCRIPTIONS LISTING */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/50 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-bold text-md text-slate-900 tracking-tight">Prescription Registry</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Active pharmacotherapy cycles and instructions</p>
                </div>
                <button className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:text-[#8ac857] border border-slate-100 hover:border-[#8ac857]/20 transition">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prescriptions.length > 0 ? prescriptions.map((med) => (
                  <div key={med.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition duration-200 flex gap-4 items-start">
                    <div className="p-2.5 bg-[#8ac857]/10 text-[#5f9634] rounded-xl flex-shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{med.medicine_name} <span className="text-xs font-mono text-slate-400 font-normal">({med.dosage})</span></h4>
                      <p className="text-[11px] text-slate-600 font-semibold mt-1">Duration: {med.duration}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-400 col-span-2">No active prescriptions available.</p>
                )}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-normal">Dosage alterations require explicit credential signatures from medical administrators.</p>
            </div>
          </div>

          {/* COMPONENT ROW: DOCTORS LISTING (3 Items max + View More) */}
          <div className="md:col-span-3 bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/50 shadow-sm mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">Consult Medical Faculty</h3>
                <p className="text-xs text-slate-400 mt-0.5">Schedule on-demand video metrics review or clinic procedures</p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-500 self-start">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8ac857]"></span> Verified Providers Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctorsData.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="group border border-slate-100 hover:border-[#8ac857]/30 rounded-2xl p-5 bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <img
                        src={doc.image || 'https://ui-avatars.com/api/?name=' + doc.doctor_name}
                        alt={doc.doctor_name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#5f9634] transition-colors">{doc.doctor_name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{doc.department_name} - {doc.specialization}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center my-4 bg-slate-50/70 p-2.5 rounded-xl text-[11px] font-medium border border-slate-100">
                      <div><p className="text-slate-400 text-[10px]">Tenure</p><p className="font-bold text-slate-800">{doc.qualification}</p></div>
                      <div><p className="text-slate-400 text-[10px]">Rate/Session</p><p className="font-bold text-slate-800">₹{doc.con_fee}</p></div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedDoctor(doc);
                      setIsModalOpen(true);
                    }}
                    className="w-full mt-2 py-3 bg-[#8ac857] hover:bg-[#77b247] text-white font-bold text-xs rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect Faculty Profile
                  </button>
                </div>
              ))}
            </div>

            {/* View More Button */}
            {doctorsData.length > 3 && (
              <div className="mt-6 text-center">
                <button className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all">
                  View More Medical Faculties
                </button>
              </div>
            )}
          </div>

        </div>
        )}

        {activeTab==='Find Doctors'&&(
          <DoctorsDirectory patient={patient}/>
        )}


      </main>

      {/* MODAL OVERLAY: EDIT PROFILE */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Refine Medical Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 bg-white hover:bg-slate-100 rounded-full shadow-sm border border-slate-200 transition-all"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
              <form id="editProfileForm" onSubmit={handleEdit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">First Name</label>
                  <input type="text" name="first_name" value={editData.first_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Last Name</label>
                  <input type="text" name="last_name" value={editData.last_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Phone</label>
                  <input type="number" name="phone" value={editData.phone} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Gender</label>
                  <select name="gender" value={editData.gender} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition">
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Address</label>
                  <textarea name="address" value={editData.address} onChange={handleChange} rows="2" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition"></textarea>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Date of Birth</label>
                  <input type="date" name="DOB" value={editData.DOB} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Blood Group</label>
                  <input type="text" name="blood_group" value={editData.blood_group} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Weight (kg)</label>
                  <input type="number" name="weight" value={editData.weight} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Height (cm)</label>
                  <input type="number" name="height" value={editData.height} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#8ac857]/30 focus:border-[#8ac857] outline-none transition" />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition">Cancel</button>
              <button form="editProfileForm" type="submit" className="px-5 py-2.5 flex items-center gap-2 text-xs font-bold text-white bg-[#8ac857] hover:bg-[#77b247] rounded-xl shadow-md transition">
                <Save className="w-3.5 h-3.5" /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL OVERLAY: DETAILED DOCTOR INSIGHTS */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="relative h-44 bg-gradient-to-br from-[#8ac857]/10 via-slate-50 to-white p-6 flex items-end border-b border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 rounded-full shadow-sm border border-slate-100 transition-all"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.image || 'https://ui-avatars.com/api/?name=' + selectedDoctor.doctor_name}
                  alt={selectedDoctor.doctor_name}
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedDoctor.doctor_name}</h3>
                  <p className="text-xs font-semibold text-slate-500">{selectedDoctor.specialization}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Focus & Qualifications</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedDoctor.department_name} Specialist with {selectedDoctor.qualification}.</p>
              </div>

              <div className="grid grid-cols-3 gap-2 my-5">
                <button className="py-2.5 bg-slate-50 hover:bg-[#8ac857]/5 hover:text-[#5f9634] border border-slate-100 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-700 transition">
                  <Phone className="w-3.5 h-3.5 text-[#8ac857]" /> Audio Voice
                </button>
                <button className="py-2.5 bg-slate-50 hover:bg-[#8ac857]/5 hover:text-[#5f9634] border border-slate-100 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-700 transition">
                  <Video className="w-3.5 h-3.5 text-[#8ac857]" /> Live Video
                </button>
                <button className="py-2.5 bg-slate-50 hover:bg-[#8ac857]/5 hover:text-[#5f9634] border border-slate-100 rounded-xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-700 transition">
                  <MessageCircle className="w-3.5 h-3.5 text-[#8ac857]" /> Secure text
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Consultation Fee</p>
                  <p className="text-2xl font-black text-slate-900">₹{selectedDoctor.con_fee}</p>
                </div>
                <button
                  onClick={() => {
                    toast.success(`Appointment pipeline confirmed perfectly with ${selectedDoctor.doctor_name}.`);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Finalize Booking Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}