import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ArrowRight, Search, Filter } from 'lucide-react';
import { BASE_URLs, GetDoctorAppoinmentsApi } from '../../apis/AllApi';

function ViewPatients() {
    const [appointmentList, setAppointmentList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);

    // Set default date to today (2026-06-29) formatted as YYYY-MM-DD
    const [selectedDate, setSelectedDate] = useState('2026-06-29');
    const [searchQuery, setSearchQuery] = useState('');

    const fetchAppointments = () => {
        GetDoctorAppoinmentsApi()
            .then((res) => {
                setAppointmentList(res.data);
            })
            .catch((err) => {
                console.error("Error fetching appointments:", err);
            });
    };

    // Initial fetch on component mount
    useEffect(() => {
        fetchAppointments();
    }, []);

    // Filter appointments when date, search query, or master list changes
    useEffect(() => {
        let updatedList = appointmentList;

        // 1. Filter by calendar date selection
        if (selectedDate) {
            updatedList = updatedList.filter(
                (apt) => apt.appointment_date === selectedDate
            );
        }

        // 2. Filter by search query (Patient Name or Token)
        if (searchQuery.trim() !== '') {
            updatedList = updatedList.filter((apt) => {
                const fullName = `${apt.patient.user.first_name} ${apt.patient.user.last_name}`.toLowerCase();
                const token = String(apt.token_number);
                return fullName.includes(searchQuery.toLowerCase()) || token.includes(searchQuery);
            });
        }

        setFilteredList(updatedList);
    }, [selectedDate, searchQuery, appointmentList]);

    // Quick counter stats for the selected date
    const totalToday = filteredList.length;
    const pendingToday = filteredList.filter(apt => apt.status === 'pending').length;

    return (
        <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">

            {/* Header Controls Area */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-50">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                        <Users className="text-[#8ac857]" size={22} />
                        Patient Schedule Queue
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {selectedDate === '2026-06-29' ? "Showing today's schedule" : `Showing schedule for ${selectedDate}`}
                    </p>
                </div>

                {/* Filter Actions Container */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search name or token..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8ac857]/50 focus:bg-white transition-all"
                        />
                    </div>

                    {/* Date Picker Input */}
                    <div className="relative w-full sm:w-auto flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-[#8ac857]/50 focus-within:bg-white transition-all">
                        <Calendar className="text-gray-400" size={16} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Metrics for Selected Day */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
                <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Booked</p>
                    <p className="text-xl font-bold text-slate-900 mt-1">{totalToday}</p>
                </div>
                <div className="bg-orange-50/40 border border-orange-100/50 p-4 rounded-xl">
                    <p className="text-xs font-medium text-orange-500 uppercase tracking-wider">Pending Active</p>
                    <p className="text-xl font-bold text-orange-600 mt-1">{pendingToday}</p>
                </div>
            </div>

            {/* Patients Queue Data Table */}
            {filteredList.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/30">
                                <th className="py-3 px-4">Token</th>
                                <th className="py-3 px-4">Patient Details</th>
                                <th className="py-3 px-4">Blood Group</th>
                                <th className="py-3 px-4">Appt Date</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {filteredList.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50/50 transition-colors group">
                                    {/* Token Number */}
                                    <td className="py-4 px-4 font-bold text-gray-700">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-[#8ac857]/10 group-hover:text-slate-900 transition-colors">
                                            #{appointment.token_number}
                                        </span>
                                    </td>

                                    {/* Avatar & Patient Identity Info */}
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={appointment.patient.user.photo}
                                                alt="Profile"
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 shadow-sm"
                                                onError={(e) => {
                                                    e.target.src = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80";
                                                }}
                                            />
                                            <div>
                                                <h4 className="font-semibold text-slate-900 leading-tight">
                                                    {appointment.patient.user.first_name} {appointment.patient.user.last_name}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{appointment.patient.patient_code}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Blood Type Badge */}
                                    <td className="py-4 px-4 font-medium text-gray-600">
                                        <span className="px-2.5 py-1 text-xs bg-red-50 text-red-600 rounded-md font-bold">
                                            {appointment.patient.blood_group}
                                        </span>
                                    </td>

                                    {/* Scheduled Date */}
                                    <td className="py-4 px-4 text-gray-500 font-medium">
                                        {appointment.appointment_date}
                                    </td>

                                    {/* Status Indicator Pill */}
                                    <td className="py-4 px-4 text-center">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${appointment.status === 'pending'
                                                ? 'bg-orange-50 text-orange-600 border-orange-100'
                                                : 'bg-green-50 text-green-600 border-green-100'
                                            }`}>
                                            {appointment.status}
                                        </span>
                                    </td>

                                    {/* Action Shortcuts */}
                                    <td className="py-4 px-4 text-right">
                                        <button className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-[#8ac857] bg-transparent border-0 transition-colors cursor-pointer">
                                            View File <ArrowRight size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/30 rounded-xl border border-dashed border-gray-100 my-4">
                    <Clock className="text-gray-300 mb-2" size={32} />
                    <h3 className="text-sm font-semibold text-gray-700">No Appointments Booked</h3>
                    <p className="text-xs text-gray-400 max-w-xs mt-1">There are no records setup for the selected filtering parameters on this date window.</p>
                </div>
            )}
        </div>
    );
}

export default ViewPatients;