import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatient, addPatient, updatePatient, deletePatient } from '../../Redux/patientSlice';
import { Base_URLs } from '../../Redux/patientSlice';

const INITIAL_FORM_STATE = {
    gender: '',
    DOB: '',
    blood_group: '',
    user: {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        username: '',
        photo: ''
    }
};

function PatientManagement() {
    const dispatch = useDispatch();
    const { patients, loading, error } = useSelector((state) => state.patients);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('view'); // 'view', 'edit', 'add'

    // Fallback tracker: Uses patient.id if available, otherwise tracks via unique username
    const [selectedIdentifier, setSelectedIdentifier] = useState(null);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        dispatch(fetchPatient());
    }, [dispatch]);

    // --- Handlers ---
    const openModal = (mode, patient = null) => {
        setModalMode(mode);
        if (patient && (mode === 'view' || mode === 'edit')) {
            // Secure tracking identifier even if backend omits the 'id' field
            setSelectedIdentifier(patient.id || patient.user?.id);
            setFormData({
                gender: patient.gender || '',
                DOB: patient.DOB || '',
                blood_group: patient.blood_group || '',
                user: {
                    first_name: patient.user?.first_name || '',
                    last_name: patient.user?.last_name || '',
                    email: patient.user?.email || '',
                    phone: patient.user?.phone || '',
                    address: patient.user?.address || '',
                    username: patient.user?.username || '',
                    password: '',
                    photo: ''
                }
            });
        } else {
            setSelectedIdentifier(null);
            setFormData(INITIAL_FORM_STATE);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setFormData(INITIAL_FORM_STATE);
            setSelectedIdentifier(null);
        }, 300);
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        const isUserField = ['first_name', 'last_name', 'email', 'phone', 'password', 'address', 'username', 'photo'].includes(name);

        setFormData((prev) => {
            if (isUserField) {
                return {
                    ...prev,
                    user: { ...prev.user, [name]: files ? files[0] : value }
                };
            } else {
                return { ...prev, [name]: value };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();

        submitData.append('gender', formData.gender);
        submitData.append('DOB', formData.DOB);
        submitData.append('blood_group', formData.blood_group);

        Object.keys(formData.user).forEach(key => {

            if (modalMode === 'edit' && key === 'username') {
                return;
            }

            if (modalMode === 'edit' && key === 'password' && !formData.user[key]) {
                return;
            }

            if (formData.user[key] !== '') {
                submitData.append(`user.${key}`, formData.user[key]);
            }
        });

        if (modalMode === 'add') {
            await dispatch(addPatient(submitData));
        } else if (modalMode === 'edit') {
            await dispatch(updatePatient({ id: selectedIdentifier, patient: submitData }));
        }

        closeModal();
    };

    const handleDelete = async (identifier) => {
        if (window.confirm("Are you sure you want to permanently delete this patient record?")) {
            await dispatch(deletePatient(identifier));
            if (isModalOpen && selectedIdentifier === identifier) closeModal();
        }
    };

    // --- Core Lookup Matching ---
    const activePatient = patients.find(p => (p.id || p.user?.username) === selectedIdentifier);

    const filteredPatients = patients.filter(p => {
        const fullName = `${p.user?.first_name || ''} ${p.user?.last_name || ''}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
            p.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.user?.username?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (loading && patients.length === 0) {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header Action Bar */}
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Patient Registry</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Clinical records and account management database</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Filter records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-sm bg-white transition-all"
                            />
                        </div>

                        <button
                            onClick={() => openModal('add')}
                            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Register Patient
                        </button>
                    </div>
                </header>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Main Directory Table Dashboard view */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3.5">Patient Details</th>
                                    <th className="px-6 py-3.5">Contact Information</th>
                                    <th className="px-6 py-3.5">Metrics</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => {
                                        const currentId = patient.id || patient.user?.username;
                                        return (
                                            <tr key={currentId} className="hover:bg-slate-50/40 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={`${Base_URLs}${patient.user?.photo}`}
                                                            alt=""
                                                            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-50"
                                                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${patient.user?.first_name || 'P'}&background=e2e8f0&color=475569` }}
                                                        />
                                                        <div>
                                                            <span
                                                                className="font-medium text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors block"
                                                                onClick={() => openModal('view', patient)}
                                                            >
                                                                {patient.user?.first_name} {patient.user?.last_name}
                                                            </span>
                                                            <span className='text-gray-700 text-xs '>{patient.patient_code}</span>
                                                            <span className="text-xs text-slate-400 block">@{patient.user?.username}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-slate-600 font-normal">{patient.user?.email}</div>
                                                    <div className="text-xs text-slate-400 mt-0.5">{patient.user?.phone}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                                            {patient.blood_group || 'N/A'}
                                                        </span>
                                                        <span className="text-slate-600 text-xs">{patient.gender}</span>
                                                    </div>
                                                    <div className="text-xs text-slate-400 mt-1">DOB: {patient.DOB || 'N/A'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <RowActionButton onClick={() => openModal('view', patient)} type="view" title="View Profile" />
                                                        <RowActionButton onClick={() => openModal('edit', patient)} type="edit" title="Modify Record" />
                                                        <RowActionButton onClick={() => handleDelete(currentId)} type="delete" title="Remove" />
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-normal">
                                            No processing records found matching search queries.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Context Workspace Slide-over Overlay Panel */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/20 backdrop-blur-sm animate-fade-in">
                    <div className="absolute inset-0" onClick={closeModal} />

                    <div className="relative w-full max-w-xl h-full bg-white shadow-xl flex flex-col justify-between overflow-y-auto animate-slide-in">
                        <div>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                                <h2 className="text-base font-semibold text-slate-800">
                                    {modalMode === 'add' ? 'New Clinical Registration' : modalMode === 'edit' ? 'Update File Instance' : 'Patient File Workspace'}
                                </h2>
                                <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6">
                                {/* VIEW MODE */}
                                {modalMode === 'view' && activePatient && (
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                                            <img
                                                src={`${Base_URLs}${activePatient.user?.photo}`}
                                                alt=""
                                                className="w-20 h-20 rounded-xl object-cover border border-slate-200"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${activePatient.user?.first_name || 'P'}&size=128&background=e2e8f0` }}
                                            />
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-bold text-slate-900">{activePatient.user?.first_name} {activePatient.user?.last_name}</h3>
                                                <p className="text-emerald-600 text-xs font-medium">@{activePatient.user?.username}</p>
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => openModal('edit', activePatient)} className="px-3 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Edit</button>
                                                    <button onClick={() => handleDelete(activePatient.id || activePatient.user?.username)} className="px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-5 pt-2">
                                            <StaticFieldItem label="Email" value={activePatient.user?.email} />
                                            <StaticFieldItem label="Phone" value={activePatient.user?.phone} />
                                            <StaticFieldItem label="DOB" value={activePatient.DOB} />
                                            <StaticFieldItem label="Gender" value={activePatient.gender} />
                                            <StaticFieldItem label="Blood Type" value={activePatient.blood_group} highlight />
                                            <StaticFieldItem label="Address" value={activePatient.user?.address} className="col-span-2" />
                                        </div>
                                    </div>
                                )}

                                {/* ADD / EDIT FORM MODES */}
                                {(modalMode === 'add' || modalMode === 'edit') && (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-4">
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Demographics Information</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInputField label="First Name" name="first_name" value={formData.user.first_name} onChange={handleChange} required />
                                                <FormInputField label="Last Name" name="last_name" value={formData.user.last_name} onChange={handleChange} required />
                                                <FormInputField label="Username ID" name="username" value={formData.user.username} onChange={handleChange} required disabled={modalMode === 'edit'} />
                                                <FormInputField label="Email Target" type="email" name="email" value={formData.user.email} onChange={handleChange} required />
                                                {modalMode === 'add' && <FormInputField label="Password System Key" type="password" name="password" value={formData.user.password} onChange={handleChange} required />}
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinical Parameters</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <FormInputField label="Phone Target" name="phone" value={formData.user.phone} onChange={handleChange} required />
                                                <FormInputField label="Birth Date" type="date" name="DOB" value={formData.DOB} onChange={handleChange} required />

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Gender Class</label>
                                                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none transition-all" required>
                                                        <option value="">Select Option</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Blood Antigens</label>
                                                    <select name="blood_group" value={formData.blood_group} onChange={handleChange} className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none transition-all" required>
                                                        <option value="">Select Group</option>
                                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                                    </select>
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Residential Address</label>
                                                    <textarea name="address" value={formData.user.address} onChange={handleChange} rows="2" className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white outline-none transition-all resize-none" required />
                                                </div>

                                                <div className="col-span-2">
                                                    <label className="block text-xs font-medium text-slate-500 mb-1">Identity File Asset (Photo)</label>
                                                    <input type="file" name="photo" accept="image/*" onChange={handleChange} className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-slate-200 p-1.5 rounded-lg bg-slate-50" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 sticky bottom-0 bg-white">
                                            <button type="button" onClick={closeModal} className="px-4 py-2 text-xs font-medium text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Dismiss</button>
                                            <button type="submit" className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors">
                                                {modalMode === 'add' ? 'Commit Entry' : 'Push Updates'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// --- Atomic View Subcomponents ---
const StaticFieldItem = ({ label, value, highlight, className = "" }) => (
    <div className={className}>
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-0.5">{label}</p>
        {highlight ? (
            <span className="inline-block px-2 py-0.5 bg-rose-50 text-rose-700 font-semibold rounded text-xs border border-rose-100">{value || 'None'}</span>
        ) : (
            <p className="text-sm font-medium text-slate-700 truncate">{value || 'Unspecified'}</p>
        )}
    </div>
);

const FormInputField = ({ label, name, type = "text", value, onChange, required, disabled }) => (
    <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500 outline-none transition-all disabled:opacity-50"
        />
    </div>
);

const RowActionButton = ({ onClick, type, title }) => {
    const paths = {
        view: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />,
        edit: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
        delete: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    };
    return (
        <button onClick={onClick} title={title} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">{paths[type]}</svg>
        </button>
    );
};

export default PatientManagement;