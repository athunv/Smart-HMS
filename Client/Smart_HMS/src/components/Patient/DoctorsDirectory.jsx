import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Star, MapPin, Calendar, Clock, 
  ChevronRight, ShieldCheck, Video, Users, Heart, 
  MessageSquare, X, ArrowUpRight, CheckCircle2, Zap, HelpCircle, Loader2
} from 'lucide-react';
import { BASE_URLs, GetAvailableSlotsApi, GetDoctorListApi } from '../../apis/AllApi';

// Configuration
const API_BASE_URL = 'http://localhost:8000'; 
// Note: Ensure you have your auth token handy for the IsAuthenticated views
const getAuthToken = () => sessionStorage.getItem('access'); 

export default function DoctorsDirectory({patient}) {
  // --- STATE MANAGEMENT ---
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialists');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialties, setSpecialties] = useState(['All Specialists']);
  
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Booking State
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [bookingStatus, setBookingStatus] = useState('idle'); // idle, loading, success, error

  // --- 1. FETCH DOCTORS FROM DJANGO ---
// --- 1. FETCH DOCTORS ---
useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const res = await GetDoctorListApi();
      setDoctors(res.data);
      // Use res.data directly here, not 'data'
      const uniqueSpecialties = ['All Specialists', ...new Set(res.data.map(d => d.specialization).filter(Boolean))];
      setSpecialties(uniqueSpecialties);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoadingDoctors(false);
    }
  };
  fetchDoctors();
}, []);

// --- 3. FETCH AVAILABLE SLOTS ---
useEffect(() => {
  if (!selectedDoctor || !selectedDate) return;

  const fetchSlots = async () => {
    setLoadingSlots(true);
    try {
      // Pass the IDs/Dates as arguments
      const res = await GetAvailableSlotsApi(selectedDoctor.id, selectedDate);
      setAvailableSlots(res.data.available_slots || []);
    } catch (error) {
      console.error("Error fetching slots:", error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  fetchSlots();
}, [selectedDoctor, selectedDate]);

  // --- 2. DYNAMIC DATE GENERATION FOR MODAL ---
  const getNextFourDays = () => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        fullDate: date.toISOString().split('T')[0], // YYYY-MM-DD for backend
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate()
      });
    }
    return dates;
  };
  const bookingDates = getNextFourDays();

  // --- 3. FETCH AVAILABLE SLOTS ---
 


  // --- 4. SUBMIT APPOINTMENT ---
  const handleBooking = async () => {
    if (!selectedToken || !selectedDate) {
      alert("Please select a date and time slot.");
      return;
    }

    setBookingStatus('loading');
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          doctor: selectedDoctor.id,
          appointment_date: selectedDate,
          token_number: selectedToken,
          patient: patient.id
        })
      });

    if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    alert(JSON.stringify(errorData));
    return;
}

      setBookingStatus('success');
      
      // OPTIMISTIC UI UPDATE: Mark the slot as booked locally
      setAvailableSlots(prevSlots => 
        prevSlots.map(slot => 
          slot.token_number === selectedToken 
            ? { ...slot, is_booked: true } 
            : slot
        )
      );

      setTimeout(() => {
        setIsModalOpen(false);
        setBookingStatus('idle');
        setSelectedToken(null);
      }, 2000);

    } catch (error) {
      alert(error.message);
      setBookingStatus('error');
    }
  };

  // --- UI HANDLERS ---
  const handleOpenModal = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedDate(bookingDates[0].fullDate); // Default to today
    setAvailableSlots([]);
    setSelectedToken(null);
    setBookingStatus('idle');
    setIsModalOpen(true);
  };

  // Master Filter Engine
  const filteredDoctors = doctors.filter(doc => {
    // Note: Assuming your backend serializer returns 'first_name', 'last_name', and 'specialization'
    const docName = `${doc.user?.first_name || ''} ${doc.user?.last_name || ''}`;
    const matchesSpecialty = selectedSpecialty === 'All Specialists' || doc.specialization === selectedSpecialty;
    const matchesSearch = docName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (doc.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  if (loadingDoctors) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f9fbf7]"><Loader2 className="w-8 h-8 animate-spin text-[#8ac857]" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#f9fbf7] text-slate-900 antialiased pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* PREMIUM FILTER DECK */}
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

        {/* WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LIVE CLINIC STATUS HUB */}
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-6 lg:p-8 flex flex-col justify-between shadow-xl shadow-slate-900/20 relative overflow-hidden min-h-[460px]">
            <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-[#8ac857]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#8ac857]/20 text-[#8ac857] font-bold text-[10px] uppercase tracking-wider rounded-md">
                <Zap className="w-3.5 h-3.5" /> Platform Operations Live
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mt-6 text-white">Telehealth Telemetry</h2>
              <p className="text-xs text-slate-400 mt-1">Realtime system intervals for digital care tracks.</p>

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

          {/* DOCTORS ARCHITECTURE */}
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
                  <div key={doc.id} className="bg-white rounded-[2rem] p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          <img 
                           src={`${BASE_URLs}${doc.profile}`}
                            alt="Doctor Profile" 
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-100 ring-2 ring-transparent group-hover:ring-[#8ac857]/20 transition-all duration-300"
                          />
                          <div>
                            <div className="inline-flex items-center gap-0.5 bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-500 font-bold tracking-tight">
                              <ShieldCheck className="w-3 h-3 text-[#8ac857]" /> Verified Practitioner
                            </div>
                            <h4 className="font-extrabold text-sm text-slate-900 mt-1 group-hover:text-[#5f9634] transition-colors">
                               Dr. {doc.doctor_name}
                            </h4>
                            <p className="text-xs text-slate-400 font-semibold">{doc.specialization} Department</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-medium mt-4 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.department?.dep_name || 'Main Campus'}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Session Charge</p>
                        <p className="text-sm font-extrabold text-slate-900">${doc.con_fee}</p>
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
            
            <div className="relative h-44 bg-gradient-to-br from-[#8ac857]/10 via-slate-50 to-white p-6 flex items-end border-b border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 bg-white hover:bg-slate-50 rounded-full shadow-sm border border-slate-100 transition-all">
                <X className="w-4 h-4 text-slate-700" />
              </button>
              
              <div className="flex items-center gap-4">
                <img 
                  src={`${BASE_URLs}${selectedDoctor.profile}`} 
                  alt="Doctor Profile" 
                  className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white shadow-md"
                />
                <div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">Dr. {selectedDoctor.doctor_name}</h3>
                  <p className="text-xs font-bold text-slate-500">{selectedDoctor.specialization} • {selectedDoctor.qualification}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Select Session Date */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Session Date</h4>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {bookingDates.map((dateObj) => (
                    <div 
                      key={dateObj.fullDate} 
                      onClick={() => setSelectedDate(dateObj.fullDate)}
                      className={`py-3 rounded-xl flex flex-col items-center justify-center cursor-pointer border transition-all ${
                        selectedDate === dateObj.fullDate 
                          ? 'bg-[#8ac857] text-white shadow-lg shadow-[#8ac857]/20 border-transparent' 
                          : 'border-slate-200 text-slate-600 hover:border-[#8ac857] bg-white'
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wide">{dateObj.dayName}</span>
                      <span className="text-base font-extrabold -mt-0.5">{dateObj.dayNumber}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Select Time Slot */}
              {/* Select Time Slot */}
<div className="mb-5">
  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
    Available Tokens (Times)
  </h4>
  {loadingSlots ? (
    <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
  ) : (
    <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
      {availableSlots.map((slot) => (
        <button
          key={slot.token_number}
          disabled={slot.is_booked} // Prevent clicking if booked
          onClick={() => setSelectedToken(slot.token_number)}
          className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
            slot.is_booked
              ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed' // Visually greyed out
              : selectedToken === slot.token_number
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
          }`}
        >
          {slot.time}
          <span className="block text-[8px] opacity-70 font-normal">
            {slot.is_booked ? 'Booked' : `Token ${slot.token_number}`}
          </span>
        </button>
      ))}
    </div>
  )}
</div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-slate-400">Total Due</p>
                  <p className="text-2xl font-black text-slate-900">${selectedDoctor.con_fee}</p>
                </div>
                <button 
                  onClick={handleBooking}
                  disabled={bookingStatus === 'loading' || bookingStatus === 'success' || !selectedToken}
                  className={`flex-1 py-3.5 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                    bookingStatus === 'success' ? 'bg-emerald-500 text-white' : 
                    !selectedToken ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  {bookingStatus === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                  {bookingStatus === 'success' ? 'Booking Confirmed!' : 'Confirm Scheduled Session'}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}