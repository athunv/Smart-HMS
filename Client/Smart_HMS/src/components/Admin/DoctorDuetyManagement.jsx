import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { X, Clock, Calendar as CalendarIcon, Trash2, Edit2, Plus } from 'lucide-react';
import { 
  DoctorsheduleApi, 
  GetDoctorSchedulesApi, 
  UpdateDoctorScheduleApi, 
  DeleteDoctorScheduleApi 
} from '../../apis/AllApi'; 

const BASE_URLs = 'http://localhost:8000';

export default function DoctorDuetyManagement({ doctorId, onClose }) {
  const [activeTab, setActiveTab] = useState('schedule');
  
  // --- SCHEDULE MANAGEMENT STATE ---
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // <-- NEW: State to hide/show the form
  const [scheduleData, setScheduleData] = useState({
    day: 'Monday',
    start_time: '',
    end_time: '',
    slot_duration: 10,
  });

  // --- SLOT CHECK STATE ---
  const [checkDate, setCheckDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [doctorId]);

  const fetchSchedules = async () => {
    try {
      const res = await GetDoctorSchedulesApi();
      const doctorSchedules = res.data.filter(sched => String(sched.doctor) === String(doctorId));
      setExistingSchedules(doctorSchedules);
    } catch (err) {
      console.error("Error fetching schedules", err);
      toast.error('Failed to load existing schedules.');
    }
  };

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setScheduleData({ ...scheduleData, [name]: value });
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...scheduleData, doctor: doctorId };

    try {
      if (editingId) {
        await UpdateDoctorScheduleApi(editingId, payload);
        toast.success('Schedule updated successfully!');
      } else {
        await DoctorsheduleApi(payload);
        toast.success('Schedule added successfully!');
      }
      
      // Reset and HIDE form after successful update/add
      setEditingId(null);
      setShowForm(false);
      setScheduleData({ day: 'Monday', start_time: '', end_time: '', slot_duration: 10 });
      fetchSchedules();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save schedule. Check if this day is already assigned.');
    }
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setScheduleData({
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
      slot_duration: schedule.slot_duration,
    });
    setShowForm(true); // <-- Show the form when editing
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this schedule?")) return;
    try {
      await DeleteDoctorScheduleApi(id);
      toast.success('Schedule removed.');
      if (editingId === id) {
        setEditingId(null);
        setShowForm(false); // Hide form if deleting the currently edited item
        setScheduleData({ day: 'Monday', start_time: '', end_time: '', slot_duration: 10 });
      }
      fetchSchedules();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete schedule.');
    }
  };

  const fetchSlots = async (e) => {
    e.preventDefault();
    if (!checkDate) return toast.warning('Please select a date first.');
    
    setLoadingSlots(true);
    try {
      const response = await axios.get(`${BASE_URLs}/slots/${doctorId}/${checkDate}/`);
      setAvailableSlots(response.data);
      if (response.data.length === 0) {
        toast.info('No slots available (Booked out or no schedule set for this day).');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error fetching available slots.');
    } finally {
      setLoadingSlots(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Duty & Slots Management</h2>
            <p className="text-xs text-slate-500">Configure weekly timings or check daily availability</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 bg-white rounded-md border border-slate-200">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 text-sm">
          <button onClick={() => setActiveTab('schedule')} className={`flex-1 p-3 font-medium flex justify-center items-center gap-2 ${activeTab === 'schedule' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Clock size={16} /> Manage Weekly Schedule
          </button>
          <button onClick={() => setActiveTab('slots')} className={`flex-1 p-3 font-medium flex justify-center items-center gap-2 ${activeTab === 'slots' ? 'text-blue-600 border-b-2 border-blue-600 bg-white' : 'text-slate-500 hover:bg-slate-100'}`}>
            <CalendarIcon size={16} /> Check Daily Slots
          </button>
        </div>

        {/* Body */}
        <div className="p-5 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: Schedule Management */}
          {activeTab === 'schedule' && (
            <div className="flex flex-col gap-6">
              
              {/* Top Controls: Show Add Button if form is hidden */}
              {!showForm && (
                <div className="flex justify-end">
                  <button 
                    onClick={() => { setEditingId(null); setShowForm(true); }} 
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus size={16} /> Add New Schedule
                  </button>
                </div>
              )}

              {/* Form Section (Hidden by default) */}
              {showForm && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-sm relative">
                  {/* Hide Form Button */}
                  <button 
                    onClick={() => { setShowForm(false); setEditingId(null); }} 
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-500"
                    title="Hide Options"
                  >
                    <X size={18} />
                  </button>

                  <h3 className="text-sm font-bold text-slate-700 mb-4">{editingId ? 'Update Schedule Options' : 'Add Schedule Options'}</h3>
                  <form onSubmit={handleScheduleSubmit} className="space-y-3 text-sm">
                    <label className="block space-y-1">
                      <span className="font-medium text-slate-700">Day</span>
                      <select name="day" value={scheduleData.day} onChange={handleScheduleChange} className="w-full rounded-lg border border-slate-200 p-2 outline-none">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block space-y-1">
                        <span className="font-medium text-slate-700">Start Time</span>
                        <input type="time" name="start_time" value={scheduleData.start_time} onChange={handleScheduleChange} required className="w-full rounded-lg border border-slate-200 p-2 outline-none" />
                      </label>
                      <label className="block space-y-1">
                        <span className="font-medium text-slate-700">End Time</span>
                        <input type="time" name="end_time" value={scheduleData.end_time} onChange={handleScheduleChange} required className="w-full rounded-lg border border-slate-200 p-2 outline-none" />
                      </label>
                    </div>

                    <label className="block space-y-1">
                      <span className="font-medium text-slate-700">Slot Duration (Min)</span>
                      <input type="number" name="slot_duration" value={scheduleData.slot_duration} onChange={handleScheduleChange} required min="5" className="w-full rounded-lg border border-slate-200 p-2 outline-none" />
                    </label>

                    <div className="flex gap-2 mt-4">
                      <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2 rounded-lg font-medium transition-colors">
                        Hide / Cancel
                      </button>
                      <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
                        {editingId ? 'Update Schedule' : 'Save Schedule'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Existing Schedules List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 border-b pb-2">Active Schedules</h3>
                {existingSchedules.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No schedules set for this doctor.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {existingSchedules.map((sched) => (
                      <li key={sched.id} className="p-3 bg-white border border-slate-200 shadow-sm rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <p className="font-bold text-slate-800">{sched.day}</p>
                          <p className="text-slate-500">{sched.start_time} - {sched.end_time} ({sched.slot_duration}m)</p>
                        </div>
                        <div className="flex gap-1.5">
                          <button onClick={() => handleEdit(sched)} className="bg-slate-100 text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors" title="Edit/Update Options">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDelete(sched.id)} className="bg-slate-100 text-rose-600 hover:bg-rose-50 p-1.5 rounded-md transition-colors" title="Remove Options">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: Check Slots View */}
          {activeTab === 'slots' && (
            <div className="space-y-4 text-sm max-w-md mx-auto mt-4">
              <form onSubmit={fetchSlots} className="flex gap-2 items-end">
                <label className="block space-y-1 flex-1">
                  <span className="font-medium text-slate-700">Select Date</span>
                  <input type="date" value={checkDate} onChange={(e) => setCheckDate(e.target.value)} required className="w-full rounded-lg border border-slate-200 p-2.5 outline-none" />
                </label>
                <button type="submit" disabled={loadingSlots} className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg font-medium h-[42px]">
                  {loadingSlots ? 'Loading...' : 'Search'}
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="font-medium text-slate-700 mb-3">Available Slots:</h3>
                {availableSlots.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot, index) => (
                      <span key={index} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-md text-xs font-semibold">
                        {slot}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">Pick a date and click search to view open appointments.</p>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}