import React, { useState, useEffect } from 'react';
import { 
    Calendar, Users, Clock, ArrowRight, Search, Filter, 
    X, Phone, Mail, MapPin, Activity, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';
import { BASE_URLs, GetDoctorAppoinmentsApi } from '../../apis/AllApi';

function ViewPatients() {
    const [appointmentList, setAppointmentList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Get today's date formatted as YYYY-MM-DD
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Selected Patient for the Modal/Drawer
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const fetchAppointments = () => {
        setLoading(true);
        GetDoctorAppoinmentsApi()
            .then((res) => {
                // Ensure data is an array
                const data = Array.isArray(res.data) ? res.data : [];
                setAppointmentList(data);
            })
            .catch((err) => {
                console.error("Error fetching appointments:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments when date, search query, status, or master list changes
    useEffect(() => {
        let updatedList = [...appointmentList];

        // 1. Filter by calendar date selection (if selected)
        if (selectedDate) {
            updatedList = updatedList.filter(
                (apt) => apt.appointment_date === selectedDate
            );
        }

        // 2. Filter by status pill (all, pending, completed)
        if (statusFilter !== 'all') {
            updatedList = updatedList.filter(
                (apt) => apt.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // 3. Filter by search query (Name, Token, Code, or Phone)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim();
            updatedList = updatedList.filter((apt) => {
                const user = apt.patient_details?.user;
                const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.toLowerCase();
                const token = String(apt.token_number || '');
                const patientCode = String(apt.patient_details?.patient_code || '').toLowerCase();
                const phone = String(user?.phone || '');

                return (
                    fullName.includes(query) || 
                    token.includes(query) || 
                    patientCode.includes(query) ||
                    phone.includes(query)
                );
            });
        }

        setFilteredList(updatedList);
    }, [selectedDate, searchQuery, statusFilter, appointmentList]);

    // Counter stats for the selected date window
    const totalCount = filteredList.length;
    const pendingCount = filteredList.filter(apt => apt.status === 'pending').length;
    const completedCount = filteredList.filter(apt => apt.status === 'completed').length;

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">

            {/* Header Controls Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="text-[#8ac857]" size={22} />
                        Patient Schedule Queue
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {selectedDate ? `Showing schedule for ${selectedDate}` : "Showing all appointments"}
                    </p>
                </div>

                {/* Filter Actions Container */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search name, token, code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8ac857]/50 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Date Picker Input & Quick Clear */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:flex-none flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8ac857]/50 focus-within:bg-white transition-all">
                            <Calendar className="text-gray-400" size={16} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                            />
                        </div>

                        {selectedDate && (
                            <button 
                                onClick={() => setSelectedDate('')}
                                className="px-2.5 py-2 text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                title="Show All Dates"
                            >
                                All Dates
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Metrics & Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-6">
                <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Booked</p>
                        <p className="text-lg font-bold text-slate-900 mt-0.5">{totalCount}</p>
                    </div>
                    <div className="bg-amber-50/60 border border-amber-100 px-4 py-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending</p>
                        <p className="text-lg font-bold text-amber-700 mt-0.5">{pendingCount}</p>
                    </div>
                    <div className="bg-emerald-50/60 border border-emerald-100 px-4 py-3 rounded-xl min-w-[120px]">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Completed</p>
                        <p className="text-lg font-bold text-emerald-700 mt-0.5">{completedCount}</p>
                    </div>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
                    {['all', 'pending', 'completed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                                statusFilter === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-gray-500 hover:text-slate-900'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Patients Queue Data Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <RefreshCw className="animate-spin text-[#8ac857] mb-3" size={28} />
                    <p className="text-sm font-medium text-gray-500">Fetching patient queue...</p>
                </div>
            ) : filteredList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                <th className="py-3.5 px-4">Token</th>
                                <th className="py-3.5 px-4">Patient Details</th>
                                <th className="py-3.5 px-4">Vitals & Info</th>
                                <th className="py-3.5 px-4">Appt Date</th>
                                <th className="py-3.5 px-4 text-center">Status</th>
                                <th className="py-3.5 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {filteredList.map((appointment) => {
                                const patientUser = appointment.patient_details?.user;
                                const bloodGroup = appointment.patient_details?.blood_group || 'N/A';
                                const age = appointment.patient_details?.age;
                                const gender = appointment.patient_details?.gender;

                                return (
                                    <tr key={appointment.id} className="hover:bg-gray-50/60 transition-colors group">
                                        {/* Token Number */}
                                        <td className="py-4 px-4 font-bold text-gray-700">
                                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 font-extrabold text-slate-800 group-hover:bg-[#8ac857] group-hover:text-white transition-colors">
                                                #{appointment.token_number}
                                            </span>
                                        </td>

                                        {/* Avatar & Patient Identity Info */}
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={patientUser?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                                    alt="Profile"
                                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shadow-sm"
                                                    onError={(e) => {
                                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
                                                    }}
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-slate-900 leading-tight">
                                                        {patientUser?.first_name} {patientUser?.last_name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                                        {appointment.patient_details?.patient_code || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Blood Type & Age/Gender Badges */}
                                        <td className="py-4 px-4 font-medium text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-lg font-bold border border-red-100">
                                                    {bloodGroup}
                                                </span>
                                                {(age || gender) && (
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {gender ? `${gender}` : ''} {age ? `• ${age} yrs` : ''}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Scheduled Date */}
                                        <td className="py-4 px-4 text-gray-600 font-medium text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                {appointment.appointment_date}
                                            </div>
                                        </td>

                                        {/* Status Indicator Pill */}
                                        <td className="py-4 px-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border capitalize ${
                                                appointment.status === 'pending'
                                                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                                                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${appointment.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                                                {appointment.status}
                                            </span>
                                        </td>

                                        {/* Action Shortcuts */}
                                        <td className="py-4 px-4 text-right">
                                            <button 
                                                onClick={() => setSelectedAppointment(appointment)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-[#8ac857] bg-gray-50 hover:bg-emerald-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-200 transition-all cursor-pointer"
                                            >
                                                View File <ArrowRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 my-4">
                    <Clock className="text-gray-300 mb-2" size={36} />
                    <h3 className="text-sm font-semibold text-gray-700">No Appointments Found</h3>
                    <p className="text-xs text-gray-400 max-w-xs mt-1">
                        There are no matching patient records for the current filter criteria.
                    </p>
                </div>
            )}

            {/* Patient File Modal / Drawer */}
            {selectedAppointment && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end transition-opacity">
                    <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
                        <div>
                            {/* Modal Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-slate-900">Patient Details</h3>
                                <button 
                                    onClick={() => setSelectedAppointment(null)}
                                    className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Patient Quick Info Card */}
                            <div className="flex items-center gap-4 py-6 border-b border-gray-100">
                                <img
                                    src={selectedAppointment.patient_details?.user?.photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                                    alt="Patient"
                                    className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-50 shadow-sm"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
                                    }}
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {selectedAppointment.patient_details?.user?.first_name} {selectedAppointment.patient_details?.user?.last_name}
                                    </h3>
                                    <p className="text-xs font-mono text-gray-400 mt-0.5">
                                        {selectedAppointment.patient_details?.patient_code}
                                    </p>
                                    <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-bold bg-red-50 text-red-600 rounded-md">
                                        Blood Group: {selectedAppointment.patient_details?.blood_group || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            {/* Vitals Summary */}
                            <div className="grid grid-cols-3 gap-3 my-6">
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Age</p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">{selectedAppointment.patient_details?.age ?? 'N/A'} yrs</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Gender</p>
                                    <p className="text-sm font-bold text-slate-800 mt-1">{selectedAppointment.patient_details?.gender ?? 'N/A'}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Token</p>
                                    <p className="text-sm font-bold text-[#8ac857] mt-1">#{selectedAppointment.token_number}</p>
                                </div>
                            </div>

                            {/* Detailed List */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} className="text-gray-400" />
                                    <span>{selectedAppointment.patient_details?.user?.phone || 'No phone recorded'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} className="text-gray-400" />
                                    <span>{selectedAppointment.patient_details?.user?.email || 'No email recorded'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin size={16} className="text-gray-400" />
                                    <span>{selectedAppointment.patient_details?.user?.address || 'No address details'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-gray-100 flex gap-3">
                            <button 
                                onClick={() => setSelectedAppointment(null)}
                                className="w-full py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewPatients;