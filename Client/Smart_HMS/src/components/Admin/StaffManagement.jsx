import React, { useEffect, useState } from 'react';
import { DeleteStaffApi, GetStaffListApi, StaffCreateApi, StaffUpdateApi } from '../../apis/AllApi';
import { 
    Users, UserPlus, Edit2, Trash2, Save, X, Briefcase, 
    Mail, Phone, MapPin, Lock, IndianRupee, Loader2, AlertTriangle, Image as ImageIcon
} from 'lucide-react';

function StaffManagement() {
    const [staffData, setStaffData] = useState({
        user: { first_name: '', last_name: '', email: '', username: '', password: '', phone: '', address: '' },
        designation: '', salary: '', profile: null,
    });

    const [staffList, setStaffList] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    
    // New UI States
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const fetchStaffs = () => {
        setIsLoading(true);
        GetStaffListApi()
            .then((res) => {
                setStaffList(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchStaffs();
    }, []);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setStaffData((prev) => ({
            ...prev,
            user: { ...prev.user, [name]: value },
        }));
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setStaffData((prev) => ({
            ...prev,
            [name]: files && files.length > 0 ? files[0] : value,
        }));
    };

    const openAddModal = () => {
        resetForm();
        setIsFormModalOpen(true);
    };

    const handleEdit = (staff) => {
        setIsEditing(true);
        setEditId(staff.id);
        setStaffData({
            user: {
                first_name: staff.user?.first_name || '',
                last_name: staff.user?.last_name || '',
                email: staff.user?.email || '',
                username: staff.user?.username || '',
                password: '', 
                phone: staff.user?.phone || '',
                address: staff.user?.address || '',
            },
            designation: staff.designation || '',
            salary: staff.salary || '',
            profile: null, // Keep null so we don't accidentally send string URLs as files
        });
        setIsFormModalOpen(true);
    };

    const resetForm = () => {
        setIsEditing(false);
        setEditId(null);
        setStaffData({
            user: { first_name: '', last_name: '', email: '', username: '', password: '', phone: '', address: '' },
            designation: '', salary: '', profile: null,
        });
    };

    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setTimeout(resetForm, 300); // Wait for transition before clearing data
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('designation', staffData.designation);
        formData.append('salary', staffData.salary);

        if (staffData.profile) {
            formData.append('profile', staffData.profile);
        }

        formData.append('user.first_name', staffData.user.first_name);
        formData.append('user.last_name', staffData.user.last_name);
        formData.append('user.email', staffData.user.email);
        formData.append('user.username', staffData.user.email); 

        if (staffData.user.password) {
            formData.append('user.password', staffData.user.password);
        }

        formData.append('user.phone', staffData.user.phone);
        formData.append('user.address', staffData.user.address);

        const request = isEditing
            ? StaffUpdateApi(formData, editId)
            : StaffCreateApi(formData);

        request
            .then(() => {
                fetchStaffs();
                closeFormModal();
            })
            .catch((err) => {
                console.log(err.response?.data);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const confirmDelete = () => {
        if (!deleteModal.id) return;
        setIsSubmitting(true);
        DeleteStaffApi(deleteModal.id)
            .then(() => {
                fetchStaffs();
                setDeleteModal({ isOpen: false, id: null });
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    // Helper to get initials
    const getInitials = (firstName, lastName) => {
        return `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}`;
    };

    const inputClassName = "w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:bg-white focus:ring-2 focus:ring-[#C1E1A6] focus:border-transparent outline-none transition-all duration-200 ease-in-out";

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-800">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#C1E1A6] rounded-xl text-gray-900 shadow-sm">
                            <Users size={28} strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
                            <p className="text-sm text-gray-500">Add, view, and manage your team members</p>
                        </div>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 bg-[#C1E1A6] text-gray-900 hover:bg-[#aecd93] font-semibold py-2.5 px-6 rounded-lg transition-all shadow-sm active:scale-95"
                    >
                        <UserPlus size={18} />
                        Add New Staff
                    </button>
                </div>

                {/* Staff List Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative min-h-[400px]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <Briefcase size={20} className="text-gray-500"/>
                            Current Directory
                        </h3>
                        <span className="bg-[#e4f3d8] text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                            {staffList.length} Members
                        </span>
                    </div>

                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                            <Loader2 size={40} className="animate-spin text-[#C1E1A6] mb-4" />
                            <p className="text-gray-500 font-medium">Loading staff directory...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                                        <th className="px-6 py-4 w-16">Profile</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Salary</th>
                                        <th className="px-6 py-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {staffList?.length > 0 ? (
                                        staffList.map((staff) => (
                                            <tr key={staff.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    {staff.profile ? (
                                                        <img 
                                                            src={staff.profile} 
                                                            alt="profile" 
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#e4f3d8] text-gray-700 font-bold flex items-center justify-center border-2 border-white shadow-sm text-sm">
                                                            {getInitials(staff.user?.first_name, staff.user?.last_name)}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {staff.user?.first_name} {staff.user?.last_name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-0.5">#{staff.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600 flex items-center gap-1.5">
                                                        <Mail size={14} className="text-gray-400"/> {staff.user?.email}
                                                    </div>
                                                    {staff.user?.phone && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                                                            <Phone size={14} className="text-gray-400"/> {staff.user?.phone}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                        {staff.designation}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                                    ₹{staff.salary}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2 ">
                                                        <button 
                                                            onClick={() => handleEdit(staff)}
                                                            className="p-1.5 bg-white hover:bg-[#C1E1A6] text-gray-600 hover:text-gray-900 rounded-md transition-colors shadow-sm border border-gray-200 hover:border-transparent"
                                                            title="Edit Staff"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => setDeleteModal({ isOpen: true, id: staff.id })}
                                                            className="p-1.5 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-md transition-colors shadow-sm border border-gray-200 hover:border-red-200"
                                                            title="Delete Staff"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-16 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                        <Users size={32} className="text-gray-300" />
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-900">No staff members found</p>
                                                    <p className="text-sm text-gray-400 mt-1">Add a new staff member to get started.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* --- FORM MODAL (Wide Layout) --- */}
            {isFormModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm transition-opacity">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#e4f3d8] rounded-lg text-gray-800">
                                    {isEditing ? <Edit2 size={20} /> : <UserPlus size={20} />}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
                                </h3>
                            </div>
                            <button onClick={closeFormModal} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 md:p-8 overflow-y-auto">
                            <form id="staff-form" onSubmit={handleSubmit} className="space-y-8">
                                
                                {/* Section: Personal Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <Users size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="text" className={inputClassName} placeholder="First Name" name="first_name" value={staffData.user.first_name} onChange={handleUserChange} required />
                                        </div>
                                        <div className="relative">
                                            <Users size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="text" className={inputClassName} placeholder="Last Name" name="last_name" value={staffData.user.last_name} onChange={handleUserChange} required />
                                        </div>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="email" className={inputClassName} placeholder="Email Address" name="email" value={staffData.user.email} onChange={handleUserChange} required />
                                        </div>
                                        <div className="relative">
                                            <Phone size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="tel" className={inputClassName} placeholder="Phone Number" name="phone" value={staffData.user.phone} onChange={handleUserChange} />
                                        </div>
                                        <div className="relative md:col-span-2">
                                            <MapPin size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="text" className={inputClassName} placeholder="Full Address" name="address" value={staffData.user.address} onChange={handleUserChange} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Employment Info */}
                                <div>
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Employment Details</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="relative">
                                            <Briefcase size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="text" className={inputClassName} placeholder="Designation / Role" name="designation" value={staffData.designation} onChange={handleChange} required />
                                        </div>
                                        <div className="relative">
                                            <IndianRupee size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="number" className={inputClassName} placeholder="Salary Amount" name="salary" value={staffData.salary} onChange={handleChange} required />
                                        </div>
                                        <div className="relative">
                                            <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                                            <input type="password" className={inputClassName} placeholder={isEditing ? "Leave blank to keep current password" : "Account Password"} name="password" value={staffData.user.password} onChange={handleUserChange} required={!isEditing} />
                                        </div>
                                        
                                        <div className="relative flex flex-col justify-center">
                                            <label className="flex items-center gap-2 cursor-pointer w-full pl-3 pr-4 py-2 bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                                <ImageIcon size={18} className="text-gray-400" />
                                                <span className="truncate flex-1 text-sm">
                                                    {staffData.profile ? staffData.profile.name : "Upload Profile Picture..."}
                                                </span>
                                                <input type="file" accept="image/*" name="profile" onChange={handleChange} className="hidden" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={closeFormModal} className="px-6 py-2.5 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition-colors" disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button type="submit" form="staff-form" disabled={isSubmitting} className="flex items-center justify-center gap-2 bg-[#C1E1A6] text-gray-900 hover:bg-[#aecd93] font-semibold py-2.5 px-8 rounded-lg transition-all shadow-sm disabled:opacity-70">
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {isEditing ? 'Save Changes' : 'Create Staff'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center scale-100 animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Staff Member?</h3>
                        <p className="text-gray-500 mb-8">
                            This action cannot be undone. All data associated with this staff member will be permanently removed from the directory.
                        </p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeleteModal({ isOpen: false, id: null })}
                                className="flex-1 py-2.5 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                className="flex-1 py-2.5 flex items-center justify-center gap-2 rounded-lg text-white bg-red-500 hover:bg-red-600 font-medium transition-colors shadow-sm disabled:opacity-70"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default StaffManagement;