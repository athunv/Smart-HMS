import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Star, MapPin, Calendar, Clock, 
  ChevronRight, ShieldCheck, Video, Users, Heart, 
  MessageSquare, X, ArrowUpRight, CheckCircle2, Zap, HelpCircle
} from 'lucide-react';

// --- PREMIUM UPGRADED DATA ROSTER ---
const specialties = ['All Specialists', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const directoryDoctors = [
  {
    id: 99,
    name: 'Dr. Evelyn Sinclair',
    specialty: 'Neurology',
    rating: 4.95,
    reviews: '4.2k',
    experience: '15 Yrs',
    fee: '$150',
    hospital: 'Aura Advanced Brain Institute',
    nextSlot: 'Today, 04:30 PM',
    languages: 'English, French',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Medicine Specialist',
    rating: 4.9,
    reviews: '2.8k',
    experience: '8 Yrs',
    fee: '$84',
    hospital: 'Metro General Clinic',
    nextSlot: 'Tomorrow, 09:00 AM',
    languages: 'English, Spanish',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 2,
    name: 'Dr. Thomas Micheal',
    specialty: 'Cardiology',
    rating: 4.8,
    reviews: '1.9k',
    experience: '12 Yrs',
    fee: '$120',
    hospital: 'Vascular Longevity Hub',
    nextSlot: 'Mon, 11:30 AM',
    languages: 'English, German',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 3,
    name: 'Dr. Priya Garh',
    specialty: 'General Surgery',
    rating: 4.7,
    reviews: '1.2k',
    experience: '10 Yrs',
    fee: '$95',
    hospital: 'Kochi Medical Square',
    nextSlot: 'Today, 06:15 PM',
    languages: 'English, Hindi, Malayalam',
    image: 'https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 4,
    name: 'Dr. Marcus Vance',
    specialty: 'Dermatology',
    rating: 4.9,
    reviews: '3.1k',
    experience: '9 Yrs',
    fee: '$110',
    hospital: 'Skin & Laser Pavilion',
    nextSlot: 'Wed, 10:00 AM',
    languages: 'English',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    id: 5,
    name: 'Dr. Alisha Patel',
    specialty: 'Pediatrics',
    rating: 4.92,
    reviews: '2.4k',
    experience: '11 Yrs',
    fee: '$90',
    hospital: 'Kindred Childrens Center',
    nextSlot: 'Tomorrow, 02:00 PM',
    languages: 'English, Gujarati',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?auto=format&fit=crop&q=80&w=256&h=256'
  }
];

export default function DoctorsDirectory() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialists');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  // Master Filter Engine
  const filteredDoctors = directoryDoctors.filter(doc => {
    const matchesSpecialty = selectedSpecialty === 'All Specialists' || doc.specialty === selectedSpecialty;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f9fbf7] text-slate-900 antialiased pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PREMIUM FILTER DECK & INTUITIVE SEARCH OVERLAY */}
        <div className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-200/60 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Find Your Specialist</h1>
              <p className="text-sm text-slate-400 mt-1">Book elite medical consultants with instant diagnostic routing.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search doctor name, medical domain..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8ac857]/40 focus:bg-white transition-all"
                />
              </div>
              <button className="px-5 py-3.5 bg-slate-900 text-white font-bold text-xs rounded-2xl hover:bg-slate-800 transition flex items-center justify-center gap-2">
                <SlidersHorizontal className="w-4 h-4" /> Refine Filter
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pt-6 border-t border-slate-100 mt-6 scrollbar-none">
            {specialties.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all duration-200 ${
                  selectedSpecialty === spec
                    ? 'bg-[#8ac857] text-white shadow-md shadow-[#8ac857]/20'
                    : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-100'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* MODERN REconfigured BENTO GRID WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* NEW NEW NEW: REPLACED SPOTLIGHT SECTION WITH LIVE CLINIC STATUS HUB */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between shadow-xl shadow-slate-900/20 relative overflow-hidden min-h-[460px]">
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#8ac857]/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8ac857]/20 text-[#8ac857] font-bold text-[10px] uppercase tracking-wider rounded-md">
                <Zap className="w-3.5 h-3.5" /> Platform Operations Live
              </div>
              
              <h2 className="text-xl font-extrabold tracking-tight mt-6 text-white">Telehealth Telemetry</h2>
              <p className="text-xs text-slate-400 mt-1">Realtime system intervals for digital care tracks.</p>

              {/* System Metric Data Stacks */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs text-slate-400">Average Room Queue</span>
                  <span className="text-xs font-bold text-[#8ac857]">12 Minutes Max</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="text-xs text-slate-400">Digital Pharmacy Desk</span>
                  <span className="text-xs font-bold text-white">Fully Operational</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Insurance Approvals</span>
                  <span className="text-xs font-bold text-white">Instant API Match</span>
                </div>
              </div>
            </div>

            {/* Quick Action Support Grid Embedded */}
            <div className="mt-8">
              <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2.5">Need immediate triage?</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition cursor-pointer">
                  <p className="text-xs font-bold text-[#8ac857]">Emergency Hub</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Direct Voice Hotlines</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center hover:bg-white/10 transition cursor-pointer">
                  <p className="text-xs font-bold text-white">AI Symptom Scan</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Pre-Diagnose Tool</p>
                </div>
              </div>

              <div className="p-3 bg-white/5 border border-white/5 rounded-2xl flex items-start gap-2.5 text-[11px] text-slate-400">
                <HelpCircle className="w-4 h-4 text-[#8ac857] flex-shrink-0 mt-0.5" />
                <p>All virtual matching schedules comply strictly with healthcare encrypted security profiles.</p>
              </div>
            </div>
          </div>

          {/* MAIN DIRECTORY DOCTORS ARCHITECTURE (Spans 2 balanced desktop columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400">Available Professionals</h3>
              <p className="text-xs font-mono text-slate-400">{filteredDoctors.length} results active</p>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-medium">No medical experts match your selected parameters.</p>
                <button onClick={() => { setSelectedSpecialty('All Specialists'); setSearchQuery(''); }} className="mt-3 text-xs font-bold text-[#8ac857] underline">Reset filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDoctors.map((doc) => (
                  <div 
                    key={doc.id}
                    className="bg-white rounded-[2rem] p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Identity Row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={doc.image} 
                            alt={doc.name} 
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 ring-2 ring-transparent group-hover:ring-[#8ac857]/20 transition-all duration-300"
                          />
                          <div>
                            <div className="inline-flex items-center gap-0.5 bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold tracking-tight">
                              <ShieldCheck className="w-3 h-3 text-[#8ac857]" /> Verified Practitioner
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-900 mt-1 group-hover:text-[#5f9634] transition-colors">{doc.name}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{doc.specialty} Department</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-0.5 text-[11px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {doc.rating}
                        </div>
                      </div>

                      {/* Location & Facility specs */}
                      <p className="text-xs text-slate-500 font-medium mt-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.hospital}
                      </p>

                      {/* Immediate Availability block */}
                      <div className="mt-3 p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Calendar Window:</span>
                        <span className="font-bold text-slate-700">{doc.nextSlot}</span>
                      </div>
                    </div>

                    {/* Pricing Summary Row & Call to Action trigger */}
                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Session Charge</p>
                        <p className="text-sm font-extrabold text-slate-900">{doc.fee}</p>
                      </div>
                      <button 
                        onClick={() => handleOpenModal(doc)}
                        className="px-4 py-2.5 bg-slate-50 group-hover:bg-[#8ac857] text-slate-700 group-hover:text-white font-bold text-xs rounded-xl transition-all duration-300 flex items-center gap-1 border border-slate-100 group-hover:border-transparent"
                      >
                        Book Appointment <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* COMPREHENSIVE COMPONENT MODAL DRAWER OVERLAY */}
      {isModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Image & Title Head */}
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
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md w-fit">
                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {selectedDoctor.rating} ({selectedDoctor.reviews} reviews)
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">{selectedDoctor.name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedDoctor.specialty} Specialist</p>
                </div>
              </div>
            </div>

            {/* Core Interaction Workspace Content */}
            <div className="p-6">
              
              <div className="grid grid-cols-2 gap-3 mb-5 text-center text-xs">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-slate-400 font-semibold">Seniority Track</p>
                  <p className="font-extrabold text-slate-800 text-sm mt-0.5">{selectedDoctor.experience} Practice</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-slate-400 font-semibold">Active Languages</p>
                  <p className="font-extrabold text-slate-800 text-xs mt-1 truncate">{selectedDoctor.languages.split(',')[0]} Only</p>
                </div>
              </div>

              {/* Consultation Channel Selection row */}
              <div className="space-y-2.5 mb-5">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Available Streams</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-2.5 bg-[#8ac857]/5 rounded-xl text-xs font-bold text-[#5f9634]">
                    <Video className="w-4 h-4 text-[#8ac857]" /> HD Tele-Video
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-[#8ac857]/5 rounded-xl text-xs font-bold text-[#5f9634]">
                    <MessageSquare className="w-4 h-4 text-[#8ac857]" /> Encrypted Text
                  </div>
                </div>
              </div>

              {/* Grid Selector for Appointment Slots */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Session Date</h4>
                  <span className="text-xs font-semibold text-slate-600 flex items-center">June 2026 <ChevronRight className="w-3.5 h-3.5 ml-0.5 text-slate-400" /></span>
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {['14 Sun', '15 Mon', '16 Tue', '17 Wed'].map((slot, index) => (
                    <div 
                      key={index} 
                      className={`py-3 rounded-xl flex flex-col items-center justify-center cursor-pointer border transition-all ${
                        index === 0 
                          ? 'bg-[#8ac857] text-white shadow-lg shadow-[#8ac857]/20 border-transparent' 
                          : 'border-slate-200 text-slate-600 hover:border-[#8ac857] bg-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wide">{slot.split(' ')[1]}</span>
                      <span className="text-base font-extrabold -mt-0.5">{slot.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Insurance check callout */}
              <div className="mt-5 flex items-center gap-3 p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-[11px] text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-[#8ac857] flex-shrink-0" />
                <p className="leading-tight">Co-pay waiver applicable. Claims handled seamlessly via system networks.</p>
              </div>

              {/* Final submission layer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Total Due</p>
                  <p className="text-2xl font-black text-slate-900">{selectedDoctor.fee}</p>
                </div>
                <button 
                  onClick={() => {
                    alert(`Booking workflow successfully completed with ${selectedDoctor.name}. Confirmation sent to your portal logs.`);
                    setIsModalOpen(false);
                  }}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm Scheduled Session
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}