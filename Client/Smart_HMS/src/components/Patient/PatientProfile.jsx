import React, { useState } from 'react';
import { 
  Menu, X, Edit3, Trash2, User, Calendar, Pill, Activity, 
  Phone, Mail, MapPin, Star, Video, MessageCircle, ChevronRight, 
  Heart, ShieldCheck, Plus, Clock, Eye, AlertCircle
} from 'lucide-react';

// --- PREMIUM MOCK DATA ---
const initialPatientData = {
  firstName: 'Rajesh',
  lastName: 'Kumar',
  age: 42,
  patientId: 'PT-883921',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@healthmail.com',
  address: '123 Palm Avenue, Kochi, Kerala, India',
  bloodGroup: 'O+',
  weight: '75 kg',
  height: '178 cm',
  photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256'
};

const doctorsData = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Medicine Specialist',
    rating: 4.9,
    reviews: '2.8k+',
    patients: '3.5k+',
    experience: '8 Years',
    fee: '$84',
    about: 'Dr. Sarah is dedicated to comprehensive long-term health management and proactive metabolic preventative care.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 2,
    name: 'Dr. Thomas Micheal',
    specialty: 'Cardiologist',
    rating: 4.8,
    reviews: '1.9k+',
    patients: '5k+',
    experience: '12 Years',
    fee: '$120',
    about: 'A world-class cardiologist specializing in advanced non-invasive vascular diagnostics and cardiovascular longevity.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 3,
    name: 'Dr. Priya Garh',
    specialty: 'General Surgery',
    rating: 4.7,
    reviews: '1.2k+',
    patients: '2k+',
    experience: '10 Years',
    fee: '$95',
    about: 'Highly focused on minimally invasive laproscopic surgical options offering brief downtime intervals.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&q=80&w=256&h=256'
  }
];

const medicalTimeline = [
  { id: 1, doctor: 'Dr. Padma Jignesh', spec: 'Orthopedic', date: 'Wed Jun 24', time: '8:00 AM', status: 'Confirmed' },
  { id: 2, doctor: 'Dr. Sakshi Sinha', spec: 'Obstetrician', date: 'Thu Jun 25', time: '9:30 AM', status: 'Pending' }
];

const prescriptionsList = [
  { id: 1, name: 'Amoxicillin', dose: '500mg', routine: 'Twice daily', timing: 'After meals' },
  { id: 2, name: 'Lisinopril', dose: '10mg', routine: 'Once daily', timing: 'Morning window' }
];

export default function PatientProfile() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patient, setPatient] = useState(initialPatientData);

  const triggerEdit = () => {
    alert('Refined interactive profile editing overlay triggered.');
  };

  const triggerDelete = () => {
    if (confirm('Are you absolutely sure you want to securely clear this master medical register profile?')) {
      alert('Secure record clearance cycle completed successfully.');
    }
  };

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
                  className={`px-5 py-2 text-xs font-semibold rounded-xl transition-all duration-300 ${
                    idx === 0 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  {link}
                </button>
              ))}
            </div>

            {/* User Profile Summary Utility */}
            <div className="hidden md:flex items-center gap-4 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800">{patient.firstName} {patient.lastName}</p>
                <p className="text-[10px] text-slate-400 font-mono">{patient.patientId}</p>
              </div>
              <img 
                src={patient.photo} 
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

        {/* Responsive Drawer Overlay for Mobile Screens */}
        {isNavOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-200 p-4 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-4 duration-200">
            {['Dashboard', 'Find Doctors', 'Treatments', 'Medical Vault'].map((link) => (
              <button 
                key={link} 
                className="w-full text-left px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                {link}
              </button>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100 flex items-center gap-3 px-4">
              <img src={patient.photo} alt="Avatar" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-sm font-bold text-slate-900">{patient.firstName} {patient.lastName}</p>
                <p className="text-xs text-slate-400 font-mono">{patient.patientId}</p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* DASHBOARD MODERN BENTO GRID ARCHITECTURE */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Bento Grid Gridset layout rules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BLOCK 1: PATIENT COMPREHENSIVE PROFILE CARD (Spans 2 columns on desktop layout) */}
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glow Effect */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#8ac857]/5 rounded-bl-full pointer-events-none"></div>
            
            <div>
              {/* Profile Card Header Actions line */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4 lg:gap-6">
                  <img 
                    src={patient.photo} 
                    alt="Master Profile Content" 
                    className="w-20 h-20 rounded-2xl object-cover shadow-md ring-4 ring-[#8ac857]/10"
                  />
                  <div>
                    <div className="inline-flex items-center gap-1 bg-[#8ac857]/10 text-[#5f9634] font-bold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" /> Core Registry Record
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1.5">{patient.firstName} {patient.lastName}</h2>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">UID: {patient.patientId}</p>
                  </div>
                </div>

                {/* Micro Action Button Cluster Controls */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button 
                    onClick={triggerEdit}
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

              {/* Patient Profile Multi-Column Specifications Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><User className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Age Parameter</p><p className="text-sm font-semibold text-slate-800">{patient.age} Years Old</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Phone className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Secure Contact</p><p className="text-sm font-semibold text-slate-800">{patient.phone}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><Mail className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Encrypted Email</p><p className="text-sm font-semibold text-slate-800 break-all">{patient.email}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400"><MapPin className="w-4 h-4" /></div>
                  <div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Primary Residence</p><p className="text-sm font-semibold text-slate-800 truncate max-w-[240px]">{patient.address}</p></div>
                </div>
              </div>
            </div>

            {/* Corporate/Hospital Infrastructure Footnote identifier */}
            <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
              <span className="font-medium">Primary Hub: Metro General Clinic Infrastructure Panel</span>
              <span className="font-mono text-slate-300">Data Status Check: Verified 2026</span>
            </div>
          </div>

          {/* BLOCK 2: VITALS TRACKER GRID CONTAINER (Premium high-contrast solid card) */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between shadow-xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#8ac857]/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Biometrics Snapshot</span>
              <div className="px-2 py-0.5 rounded bg-[#8ac857]/20 text-[#8ac857] font-mono text-[10px] font-bold">Live Sync</div>
            </div>

            <div className="my-auto py-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Blood Factor</span>
                <span className="text-lg font-extrabold text-[#8ac857]">{patient.bloodGroup}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <span className="text-xs text-slate-400 font-medium">Mass (Weight)</span>
                <span className="text-lg font-extrabold">{patient.weight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Stature (Height)</span>
                <span className="text-lg font-extrabold">{patient.height}</span>
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
                <h3 className="font-bold text-md text-slate-900 tracking-tight">Active Consultations</h3>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              </div>

              <div className="space-y-3">
                {medicalTimeline.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50/70 hover:bg-slate-50 border border-slate-100 rounded-2xl transition group">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                      <span className={`px-2 py-0.5 font-bold rounded-md uppercase tracking-wider text-[9px] ${
                        item.status === 'Confirmed' ? 'bg-[#8ac857]/10 text-[#5f9634]' : 'bg-amber-100 text-amber-700'
                      }`}>{item.status}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-2 group-hover:text-[#8ac857] transition-colors">{item.doctor}</p>
                    <p className="text-xs text-slate-400 font-medium">{item.spec}</p>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full mt-5 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs rounded-xl border border-slate-100 transition-all">
              Manage Appointment Calendar
            </button>
          </div>

          {/* BLOCK 4: MEDICAL PRESCRIPTIONS LISTING (Spans 2 columns on desktop) */}
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
                {prescriptionsList.map((med) => (
                  <div key={med.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition duration-200 flex gap-4 items-start">
                    <div className="p-2.5 bg-[#8ac857]/10 text-[#5f9634] rounded-xl flex-shrink-0">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{med.name} <span className="text-xs font-mono text-slate-400 font-normal">({med.dose})</span></h4>
                      <p className="text-xs text-slate-600 font-semibold mt-1">{med.routine}</p>
                      <p className="text-[11px] text-slate-400 mt-1 italic">Timing: {med.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <p className="text-[10px] text-slate-400 leading-normal">Dosage alterations require explicit credential signatures from medical administrators.</p>
            </div>
          </div>

          {/* COMPONENT ROW: GENERAL CLINIC & VERIFIED DOCTORS LISTING */}
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

            {/* Doctors Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {doctorsData.map((doc) => (
                <div 
                  key={doc.id} 
                  className="group border border-slate-100 hover:border-[#8ac857]/30 rounded-2xl p-5 bg-white transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4">
                      <img 
                        src={doc.image} 
                        alt={doc.name} 
                        className="w-14 h-14 rounded-xl object-cover border border-slate-100"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#5f9634] transition-colors">{doc.name}</h4>
                        <p className="text-xs text-slate-400 font-medium">{doc.specialty}</p>
                        <div className="flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-600">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {doc.rating} <span className="text-slate-300 font-normal">({doc.reviews})</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center my-4 bg-slate-50/70 p-2.5 rounded-xl text-[11px] font-medium border border-slate-100">
                      <div><p className="text-slate-400 text-[10px]">Tenure</p><p className="font-bold text-slate-800">{doc.experience}</p></div>
                      <div><p className="text-slate-400 text-[10px]">Rate/Session</p><p className="font-bold text-slate-800">{doc.fee}</p></div>
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
          </div>

        </div>
      </main>

      {/* MODAL OVERLAY: DETAILED DOCTOR INSIGHTS & INSTANT BOOKING SELECTION */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Hero Banner section */}
            <div className="relative h-44 bg-gradient-to-br from-[#8ac857]/10 via-slate-50 to-white p-6 flex items-end border-b border-slate-100">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 rounded-full shadow-sm border border-slate-100 transition-all"
              >
                <X className="w-4 h-4 text-slate-700" />
              </button>
              <div className="flex items-center gap-4">
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name} 
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{selectedDoctor.name}</h3>
                  <p className="text-xs font-semibold text-slate-500">{selectedDoctor.specialty}</p>
                </div>
              </div>
            </div>

            {/* Modal Dynamic Workspace Body */}
            <div className="p-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinical Focus</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{selectedDoctor.about}</p>
              </div>

              {/* Communication Channel Options Matrix */}
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

              {/* Date Scheduler Selector Grid block */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Date Window</h4>
                  <span className="text-xs font-semibold text-slate-600 flex items-center">June 2026 <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" /></span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {['24 Wed', '25 Thu', '26 Fri', '27 Sat'].map((slot, index) => (
                    <div 
                      key={index} 
                      className={`flex-shrink-0 w-14 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                        index === 0 
                          ? 'bg-[#8ac857] text-white shadow-lg shadow-[#8ac857]/20 border border-transparent' 
                          : 'border border-slate-200 text-slate-600 hover:border-[#8ac857] bg-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wide">{slot.split(' ')[1]}</span>
                      <span className="text-base font-extrabold -mt-0.5">{slot.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submission Action Layer footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Consultation Fee</p>
                  <p className="text-2xl font-black text-slate-900">{selectedDoctor.fee}</p>
                </div>
                <button 
                  onClick={() => {
                    alert(`Appointment pipeline confirmed perfectly with ${selectedDoctor.name}.`);
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