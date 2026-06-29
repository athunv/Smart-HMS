import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor, addDoctor, updateDoctor, deleteDoctor } from '../../Redux/doctorSlice';
import { fetchDepartment } from '../../Redux/departmentSlice';
import { Plus, Edit2, Trash2, X, Briefcase, DollarSign, Eye, AlertCircle } from 'lucide-react';
import DoctorDuetyManagement from './DoctorDuetyManagement';

const initialFormState = {
  user: { first_name: '', last_name: '', email: '', password: '', photo: null },
  department: '',
  qualification: '',
  specialization: '',
  con_fee: '',
};

export default function DoctorManagement() {
  const dispatch = useDispatch();
  
  // Local UI State
  const [duetyModal, setDuetyModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  // Global Redux State
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const { departments, error: deptError } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchDepartment());
  }, [dispatch]);

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleEdit = (doctor) => {
    setFormData({
      user: {
        first_name: doctor.user?.first_name || '',
        last_name: doctor.user?.last_name || '',
        email: doctor.user?.email || '',
        password: '', // Leave blank, only update if typed
        photo: null // Don't pre-fill file input for security
      },
      department: doctor.department || '',
      qualification: doctor.qualification || '',
      specialization: doctor.specialization || '',
      con_fee: doctor.con_fee || '',
    });
    setEditingId(doctor.id);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Are you sure you want to remove this doctor record?")) {
      try {
        await dispatch(deleteDoctor(id)).unwrap();
      } catch (err) {
        alert("Failed to delete record: " + err.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const userFields = ['first_name', 'last_name', 'email', 'password', 'photo'];

    if (userFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: name === 'photo' ? files[0] : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const data = new FormData();
    data.append('department', formData.department);
    data.append('specialization', formData.specialization);
    data.append('qualification', formData.qualification);
    data.append('con_fee', formData.con_fee);
    
    // THE FIX: Clone the user object and force username to be the email
    const userPayload = {
      ...formData.user,
      username: formData.user.email 
    };

    // Append user data to FormData
    Object.entries(userPayload).forEach(([key, value]) => {
      // For updates, skip password if empty, skip photo if null
      if (value !== null && value !== '') {
        data.append(`user.${key}`, value);
      }
    });

    try {
      if (editingId) {
        await dispatch(updateDoctor({ id: editingId, doctor: data })).unwrap();
      } else {
        await dispatch(addDoctor(data)).unwrap();
      }
      setIsModalOpen(false); // Only close if successful
    } catch (err) {
      setFormError(err.message || 'An error occurred while saving.');
    }
  };


  
  const resolveDepartmentName = (deptId) => {
    if (!departments) return 'Loading...';
    const match = departments.find(d => String(d.id) === String(deptId));
    return match ? match.dep_name : 'N/A';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12">
      
      {/* Header */}
      <div className="flex my-8 flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Doctor Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage clinical staff and department assignments.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow text-sm font-semibold transition-all"
        >
          <Plus size={18} /> Add New Physician
        </button>
      </div>

      {/* Global Errors */}
      {(error || deptError) && !isModalOpen && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 text-sm border border-red-100">
          <AlertCircle size={18} />
          {error || deptError}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4">Physician Details</th>
                <th className="p-4">Department</th>
                <th className="p-4">Specialization</th>
                <th className="p-4">Fee</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && doctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">Loading directory...</td>
                </tr>
              ) : doctors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No doctor records found.</td>
                </tr>
              ) : (
                doctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {doc.user?.photo ? (
                          <img src={`http://127.0.0.1:8000${doc.user.photo}`} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {doc.user?.first_name?.[0]}{doc.user?.last_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900">Dr. {doc.user?.first_name} {doc.user?.last_name}</div>
                          <div className="text-xs text-slate-500">{doc.user?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={14} className="text-slate-400" /> {resolveDepartmentName(doc.department)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-medium border border-blue-100">
                        {doc.specialization}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 flex items-center mt-2">
                      <DollarSign size={14} className="text-slate-400 mr-0.5" /> {doc.con_fee}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-3">
                        <button onClick={() => { setSelectedDoctor(doc); setDuetyModal(true); }} className="text-slate-400 hover:text-indigo-600" title="Manage Schedule"><Eye size={18} /></button>
                        <button onClick={() => handleEdit(doc)} className="text-slate-400 hover:text-blue-600" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleDeleteItem(doc.id)} className="text-slate-400 hover:text-red-600" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Doctor Profile' : 'Register New Doctor'}</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg"><X size={20} /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-6 flex-1">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm mb-4">
                  {formError}
                </div>
              )}

              {/* Profile Block */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase">Profile Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">First Name</span>
                    <input type="text" name="first_name" value={formData.user.first_name} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Last Name</span>
                    <input type="text" name="last_name" value={formData.user.last_name} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Email Address</span>
                    <input type="email" name="email" value={formData.user.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700 flex justify-between">Password {editingId && <span className="text-slate-400 text-xs">(Leave blank to keep)</span>}</span>
                    <input type="password" name="password" value={formData.user.password} onChange={handleChange} required={!editingId} className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5 sm:col-span-2"><span className="text-sm font-medium text-slate-700">Profile Photo</span>
                    <input type="file" name="photo" onChange={handleChange} accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </label>
                </div>
              </div>

              {/* Clinic Block */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase">Clinical Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Department</span>
                    <select name="department" value={formData.department} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm bg-white">
                      <option value="">Select Department</option>
                      {departments?.map((dept) => <option key={dept.id} value={dept.id}>{dept.dep_name}</option>)}
                    </select>
                  </label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Specialization</span>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Qualifications</span>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 text-sm" />
                  </label>
                  <label className="block space-y-1.5"><span className="text-sm font-medium text-slate-700">Consultation Fee</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                      <input type="number" name="con_fee" value={formData.con_fee} onChange={handleChange} required className="w-full rounded-lg border border-slate-300 p-2.5 pl-7 text-sm" />
                    </div>
                  </label>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">Cancel</button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : null}
                {editingId ? 'Save Changes' : 'Create Doctor'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Duty Manager Modal */}
      {duetyModal && selectedDoctor && (
        <DoctorDuetyManagement doctorId={selectedDoctor.id} onClose={() => { setDuetyModal(false); setSelectedDoctor(null); }} />
      )}
    </div>
  );
}