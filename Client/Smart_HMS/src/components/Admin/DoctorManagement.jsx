import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDoctor, addDoctor, updateDoctor, deleteDoctor } from '../../Redux/doctorSlice';
import { fetchDepartment } from '../../Redux/departmentSlice';
import { Plus, Edit2, Trash2, X, Activity, Briefcase, DollarSign, GraduationCap } from 'lucide-react';

const initialFormState = {
  user: { first_name: '', last_name: '', email: '', password: '', username: '' },
  department: '',
  qualification: '',
  specialization: '',
  con_fee: '',
};

export default function DoctorManagement() {
  const dispatch = useDispatch();
  
  const { doctors, loading, error } = useSelector((state) => state.doctors);
  const { departments, loading: isDeptLoading, error: deptError } = useSelector((state) => state.departments);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(fetchDoctor());
    dispatch(fetchDepartment());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const userFields = ['first_name', 'last_name', 'email', 'password'];

    if (userFields.includes(name)) {
      setFormData((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          [name]: value,
          ...(name === 'email' && { username: value }),
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddNew = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doctor) => {
    setFormData({
      user: {
        first_name: doctor.user?.first_name || '',
        last_name: doctor.user?.last_name || '',
        email: doctor.user?.email || '',
        username: doctor.user?.email || '',
        password: '', 
      },
      department: doctor.department || '',
      qualification: doctor.qualification || '',
      specialization: doctor.specialization || '',
      con_fee: doctor.con_fee || '',
    });
    setEditingId(doctor.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Deep clone payload to sanitize
    const submitData = JSON.parse(JSON.stringify(formData));
    
    // Automatically enforce email as username
    submitData.user.username = submitData.user.email;

    // Prevent overwriting with an empty password string during updates
    if (editingId && !submitData.user.password) {
      delete submitData.user.password;
    }

    const action = editingId 
      ? dispatch(updateDoctor({ id: editingId, doctor: submitData }))
      : dispatch(addDoctor(submitData));

    action.then(() => setIsModalOpen(false));
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to remove this doctor record?")) {
      dispatch(deleteDoctor(id));
    }
  };

  const resolveDepartmentName = (deptId) => {
    if (!departments) return 'Loading...';
    const match = departments.find(d => String(d.id) === String(deptId));
    return match ? match.dep_name : 'General Practice';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 relative">
      <div className=" mx-auto">
        
        {/* Header Section */}
        <div className="flex my-8 flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="sm:text-4xl text-2xl font-serif italic font-bold tracking-tight">
              
              Doctor Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Configure clinical personnel, department assignments, and fees.</p>
          </div>
          <button
            onClick={handleAddNew}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8ac857] hover:bg-[#6a9645] text-black px-4 py-2.5 rounded-xl shadow-sm text-xs sm:text-sm font-semibold transition-all"
          >
            <Plus size={16} /> Add New Physician
          </button>
        </div>

        {/* Global Errors */}
        {(error || deptError) && (
          <div className="space-y-2 mb-6">
            {error && <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs sm:text-sm">{error}</div>}
            {deptError && <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs sm:text-sm">{deptError}</div>}
          </div>
        )}

        {/* Adaptive Dynamic Grid/Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Desktop Table View (>= sm screen size) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-4">Physician Details</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Specialization</th>
                  <th className="p-4">Consultation Fee</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && doctors?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        Fetching records...
                      </div>
                    </td>
                  </tr>
                ) : doctors?.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-slate-400 italic">No doctor files found.</td>
                  </tr>
                ) : (
                  doctors?.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-slate-900">Dr. {doc.user?.first_name} {doc.user?.last_name}</div>
                        <div className="text-xs text-slate-500">{doc.user?.email}</div>
                      </td>
                      <td className="p-4 text-slate-600">{resolveDepartmentName(doc.department)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 text-xs px-2.5 py-0.5 rounded-md font-medium border border-blue-100">
                          {doc.specialization}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-slate-900">${doc.con_fee}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2.5">
                          <button onClick={() => handleEdit(doc)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit Profile">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteItem(doc.id)} className="text-slate-400 hover:text-rose-600 transition-colors" title="Remove Profile">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card Layout (< sm screen size) */}
          <div className="block sm:hidden divide-y divide-slate-100">
            {loading && doctors?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading directory...</div>
            ) : doctors?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 italic">No records to display.</div>
            ) : (
              doctors?.map((doc) => (
                <div key={doc.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Dr. {doc.user?.first_name} {doc.user?.last_name}</h4>
                      <p className="text-xs text-slate-400">{doc.user?.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(doc)} className="p-1 text-slate-400 hover:text-blue-600"><Edit2 size={15} /></button>
                      <button onClick={() => handleDeleteItem(doc.id)} className="p-1 text-slate-400 hover:text-rose-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5"><Briefcase size={12} className="text-slate-400" /> {resolveDepartmentName(doc.department)}</div>
                    <div className="flex items-center gap-1.5 justify-end"><DollarSign size={12} className="text-slate-400" /> <span className="font-medium text-slate-900">${doc.con_fee}</span></div>
                    <div className="col-span-2 mt-1">
                      <span className="bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded font-medium border border-blue-100">{doc.specialization}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>

      {/* Slide-Up Bottom Sheet Mobile / Centered Panel Desktop Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4 animate-fade-in">
          <div className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-xl shadow-xl overflow-hidden max-h-[92vh] sm:max-h-[85vh] flex flex-col animate-slide-up">
            
            <div className="flex justify-between items-center p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">{editingId ? 'Modify Doctor File' : 'Register New Medical Staff'}</h2>
                <p className="text-xs text-slate-400">Account login usernames are pinned dynamically to matching emails.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-5 space-y-5 flex-1 text-xs sm:text-sm">
              
              {/* Demographics Block */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Demographic Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">First Name</span>
                    <input type="text" name="first_name" value={formData.user.first_name} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Last Name</span>
                    <input type="text" name="last_name" value={formData.user.last_name} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Email Address</span>
                    <input type="email" name="email" value={formData.user.email} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700 flex justify-between">
                      Password 
                      {editingId && <span className="text-[10px] text-slate-400 font-normal self-center">(Optional)</span>}
                    </span>
                    <input type="password" name="password" value={formData.user.password} onChange={handleChange} required={!editingId} placeholder={editingId ? "••••••••" : ""} className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                </div>
              </div>

              <div className="border-t border-slate-100"></div>

              {/* Professional Assignment Block */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinical Assignments</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Department Block</span>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none h-[40px]"
                    >
                      <option value="">Choose Unit</option>
                      {departments?.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.dep_name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Clinical Focus / Specialization</span>
                    <input type="text" name="specialization" value={formData.specialization} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Accredited Qualifications</span>
                    <input type="text" name="qualification" value={formData.qualification} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                  <label className="block space-y-1">
                    <span className="font-medium text-slate-700">Consultation Rate (USD)</span>
                    <input type="number" name="con_fee" value={formData.con_fee} onChange={handleChange} required className="w-full rounded-lg border border-slate-200 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-slate-50/50 transition-all outline-none" />
                  </label>
                </div>
              </div>

              {/* Action Operations Layout */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {loading && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {editingId ? 'Commit Record changes' : 'Provision Professional'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}