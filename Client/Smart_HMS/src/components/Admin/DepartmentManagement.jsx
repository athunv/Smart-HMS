import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    fetchDepartment, 
    adddepartment, 
    updatedepartment, 
    deletedepartment 
} from '../../Redux/departmentSlice';
import { 
    Search, Plus, Edit2, Trash2, X, Building2, 
    ArrowUpDown, ChevronLeft, ChevronRight, ListFilter, AlertCircle
} from 'lucide-react';

export default function DepartmentManagement() {
    // Component States
    const [departmentData, setDepartmentData] = useState({ dep_name: '', des: '' });
    const [selectedDep, setSelectedDep] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [editData, setEditData] = useState({ dep_name: '', des: '' });

    // Advanced Feature States
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'dep_name', direction: 'asc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Redux Setup
    const dispatch = useDispatch();
    // Defaulting to empty array to prevent undefined map errors
    const { departments = [], loading, error } = useSelector((state) => state.departments || state.department);

    // Initial Fetch
    useEffect(() => {
        dispatch(fetchDepartment());
    }, [dispatch]);

    // Form Handlers
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDepartmentData({ ...departmentData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!departmentData.dep_name.trim()) return;
        
        dispatch(adddepartment(departmentData))
            .unwrap()
            .then(() => {
                setDepartmentData({ dep_name: "", des: '' });
            })
            .catch((err) => console.error("Failed to add department:", err));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = (e) => {
        e.preventDefault();
        dispatch(updatedepartment({ id: selectedDep, department: editData }))
            .unwrap()
            .then(() => {
                setEditData({ dep_name: '', des: "" });
                setEditModal(false);
            })
            .catch((err) => console.error("Failed to update department:", err));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this department?")) {
            dispatch(deletedepartment(id))
                .catch((err) => console.error("Failed to delete department:", err));
        }
    };

    // Sort Toggle Handler
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Filtered & Sorted Logic using Redux State
    const processedDepartments = useMemo(() => {
        let items = [...departments];
        
        // 1. Search Filtering
        if (searchTerm) {
            items = items.filter(dep => 
                dep.dep_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                dep.des?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // 2. Sorting
        if (sortConfig.key) {
            items.sort((a, b) => {
                const aValue = (a[sortConfig.key] || '').toLowerCase();
                const bValue = (b[sortConfig.key] || '').toLowerCase();
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return items;
    }, [departments, searchTerm, sortConfig]);

    // Pagination Logic
    const paginatedDeps = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedDepartments.slice(startIndex, startIndex + itemsPerPage);
    }, [processedDepartments, currentPage]);

    const totalPages = Math.ceil(processedDepartments.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 sm:p-8 text-gray-800 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header & Meta Stat Cards */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-[#C1E1A6] text-gray-900 rounded-xl">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Department Hub</h1>
                            <p className="text-sm text-gray-500">Manage, organize, and track core corporate divisions.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-gray-100/80 px-4 py-2 rounded-xl text-center min-w-[100px]">
                            <span className="block text-xs text-gray-500 font-medium uppercase">Total</span>
                            <span className="text-xl font-bold text-gray-900">{departments.length}</span>
                        </div>
                        <div className="bg-[#C1E1A6]/30 px-4 py-2 rounded-xl text-center min-w-[100px]">
                            <span className="block text-xs text-gray-600 font-medium uppercase">Filtered</span>
                            <span className="text-xl font-bold text-gray-900">{processedDepartments.length}</span>
                        </div>
                    </div>
                </div>

                {/* Global Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <h4 className="font-semibold text-sm">Failed to sync with server</h4>
                            <p className="text-xs">{error}</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    
                    {/* Left Column: Interactive Management Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-gray-500" /> Create Department
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="dep_name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                                    Department Name
                                </label>
                                <input 
                                    type="text" 
                                    name="dep_name" 
                                    id="dep_name" 
                                    required
                                    placeholder="e.g. Human Resources"
                                    value={departmentData.dep_name} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label htmlFor="des" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                                    Description
                                </label>
                                <textarea 
                                    name="des" 
                                    id="des" 
                                    rows="3"
                                    placeholder="Brief outline of operations..."
                                    value={departmentData.des} 
                                    onChange={handleChange} 
                                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] focus:bg-white transition-all resize-none"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-2.5 px-4 bg-[#C1E1A6] hover:bg-[#b2d596] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-gray-900 font-semibold rounded-xl text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div> : <Plus className="w-4 h-4" />} 
                                {loading ? 'Saving...' : 'Save Department'}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Advanced Data Table Grid */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden flex flex-col justify-between min-h-[480px]">
                        <div>
                            {/* Search and Action Bar */}
                            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between bg-gray-50/50">
                                <div className="relative w-full sm:w-72">
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or info..." 
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] transition-all"
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <ListFilter className="w-4 h-4" /> Showing {paginatedDeps.length} of {processedDepartments.length} records
                                </div>
                            </div>

                            {/* Main Table View */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100 bg-gray-50/30 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            <th className="py-3 px-4 w-16 text-center">#</th>
                                            <th className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('dep_name')}>
                                                <div className="flex items-center gap-1.5">
                                                    Department <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => requestSort('des')}>
                                                <div className="flex items-center gap-1.5">
                                                    Description <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 text-right w-28">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-sm">
                                        {loading && departments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-gray-500">
                                                    <div className="flex justify-center items-center gap-3">
                                                        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                        Loading records...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : paginatedDeps.length > 0 ? (
                                            paginatedDeps.map((d, index) => (
                                                <tr key={d.id || index} className="hover:bg-gray-50/60 transition-colors group">
                                                    <td className="py-3.5 px-4 font-medium text-gray-400 text-center">
                                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                                    </td>
                                                    <td className="py-3.5 px-4 font-semibold text-gray-900">{d.dep_name}</td>
                                                    <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate">{d.des || <span className="text-gray-300 italic">No description</span>}</td>
                                                    <td className="py-3.5 px-4 text-right">
                                                        <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedDep(d.id);
                                                                    setEditData({ dep_name: d.dep_name, des: d.des });
                                                                    setEditModal(true);
                                                                }}
                                                                className="p-1.5 hover:bg-gray-100 text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(d.id)}
                                                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                                                    No matching departments discovered.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Footer */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                                <button 
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-all flex items-center gap-1 text-xs font-semibold"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Prev
                                </button>
                                <span className="text-xs text-gray-500 font-medium">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button 
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className="p-2 border border-gray-200 rounded-xl hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent text-gray-600 transition-all flex items-center gap-1 text-xs font-semibold"
                                >
                                    Next <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Smooth Animated Edit Backdrop Modal */}
                {editModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-gray-100 overflow-hidden transform transition-all scale-100">
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Edit2 className="w-4 h-4 text-gray-500" /> Modifying Department
                                </h3>
                                <button 
                                    onClick={() => setEditModal(false)} 
                                    className="p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-700 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <form onSubmit={handleEdit} className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="edit_dep_name" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                                        Department Name
                                    </label>
                                    <input 
                                        type="text" 
                                        name="dep_name" 
                                        id="edit_dep_name" 
                                        required
                                        value={editData.dep_name} 
                                        onChange={handleEditChange} 
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] transition-all"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="edit_des" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                                        Description
                                    </label>
                                    <textarea 
                                        name="des" 
                                        id="edit_des" 
                                        rows="3"
                                        value={editData.des} 
                                        onChange={handleEditChange} 
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] transition-all resize-none"
                                    />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button 
                                        type="button" 
                                        onClick={() => setEditModal(false)}
                                        className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        className="px-5 py-2 bg-[#C1E1A6] hover:bg-[#b2d596] disabled:opacity-70 text-gray-900 font-semibold rounded-xl text-sm shadow-sm transition-colors flex items-center gap-2"
                                    >
                                        {loading && <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>}
                                        Update Record
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}