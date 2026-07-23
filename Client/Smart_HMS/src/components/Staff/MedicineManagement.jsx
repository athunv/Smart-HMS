import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, Plus, Edit2, Trash2, X, Pill, LayoutGrid, Package, Loader2, AlertCircle
} from 'lucide-react';
import {
  GetMedicineCategoriesApi, AddMedicineCategoryApi, UpdateMedicineCategoryApi, DeleteMedicineCategoryApi,
  GetMedicinesApi, AddMedicineApi, UpdateMedicineApi, DeleteMedicineApi,
  GetMedicineBatchesApi, AddMedicineBatchApi, UpdateMedicineBatchApi, DeleteMedicineBatchApi
} from '../../apis/AllApi';

const TABS = [
  { id: 'medicines', label: 'Medicines', icon: Pill },
  { id: 'categories', label: 'Categories', icon: LayoutGrid },
  { id: 'batches', label: 'Batches', icon: Package },
];

export default function MedicineManagement() {
  const [activeTab, setActiveTab] = useState('medicines');
  
  // Store all data separately to handle foreign key relationships mapping
  const [categories, setCategories] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [currentItem, setCurrentItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- DATA FETCHING ---
  // Fetch all data so we have Categories and Medicines ready for Foreign Key dropdowns
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, medRes, batchRes] = await Promise.all([
        GetMedicineCategoriesApi(),
        GetMedicinesApi(),
        GetMedicineBatchesApi()
      ]);
      setCategories(catRes.data || []);
      setMedicines(medRes.data || []);
      setBatches(batchRes.data || []);
    } catch (err) {
      setError('Failed to fetch data. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  useEffect(() => {
    setSearchQuery(''); // Reset search on tab change
  }, [activeTab]);

  // --- HELPERS FOR FOREIGN KEYS ---
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || 'Uncategorized';
  const getMedicineDisplay = (id) => {
    const med = medicines.find(m => m.id === id);
    return med ? `${med.name} ${med.strength ? `(${med.strength})` : ''}` : 'Unknown Medicine';
  };

  // --- CRUD HANDLERS ---
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'categories') await DeleteMedicineCategoryApi(id);
      if (activeTab === 'medicines') await DeleteMedicineApi(id);
      if (activeTab === 'batches') await DeleteMedicineBatchApi(id);
      fetchAllData();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    // Clean up empty strings for foreign keys (Django requires null if blank)
    if (payload.category === "") payload.category = null;

    try {
      if (modalMode === 'add') {
        if (activeTab === 'categories') await AddMedicineCategoryApi(payload);
        if (activeTab === 'medicines') await AddMedicineApi(payload);
        if (activeTab === 'batches') await AddMedicineBatchApi(payload);
      } else {
        if (activeTab === 'categories') await UpdateMedicineCategoryApi(currentItem.id, payload);
        if (activeTab === 'medicines') await UpdateMedicineApi(currentItem.id, payload);
        if (activeTab === 'batches') await UpdateMedicineBatchApi(currentItem.id, payload);
      }
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert(`Failed to ${modalMode} item. Check inputs.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openModal = (mode, item = null) => {
    setModalMode(mode);
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // --- FILTERING ---
  const getActiveData = () => {
    if (activeTab === 'categories') return categories;
    if (activeTab === 'medicines') return medicines;
    return batches;
  };

  const filteredData = getActiveData().filter((item) => {
    const query = searchQuery.toLowerCase();
    if (activeTab === 'categories') return item.name?.toLowerCase().includes(query);
    if (activeTab === 'medicines') return item.name?.toLowerCase().includes(query) || item.generic_name?.toLowerCase().includes(query);
    if (activeTab === 'batches') return item.batch_number?.toLowerCase().includes(query);
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex w-full md:w-auto p-1 bg-gray-100 rounded-xl">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out ${
                    isActive ? 'bg-[#C1E1A6] text-slate-800 shadow-sm scale-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 scale-95'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => openModal('add')}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#C1E1A6] hover:bg-[#aed48f] text-slate-800 px-6 py-2.5 rounded-xl font-semibold transition-colors shadow-sm"
          >
            <Plus size={18} />
            Add {TABS.find(t => t.id === activeTab)?.label.slice(0, -1)}
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
            <h2 className="text-xl font-bold text-gray-800 capitalize">Manage {activeTab}</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C1E1A6] focus:border-transparent transition-all w-64"
              />
            </div>
          </div>

          {/* Tables */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="animate-spin mb-4" size={32} />
                <p>Loading records...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-red-400">
                <AlertCircle className="mb-4" size={32} />
                <p>{error}</p>
              </div>
            ) : filteredData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Package className="mb-4 opacity-50" size={48} />
                <p>No {activeTab} found.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 text-sm uppercase tracking-wider">
                    {activeTab === 'categories' && <><th className="p-4 font-semibold">Name</th><th className="p-4 font-semibold">Description</th></>}
                    {activeTab === 'medicines' && <><th className="p-4 font-semibold">Medicine</th><th className="p-4 font-semibold">Category</th><th className="p-4 font-semibold">Form</th><th className="p-4 font-semibold">Stock</th><th className="p-4 font-semibold">Price</th></>}
                    {activeTab === 'batches' && <><th className="p-4 font-semibold">Batch No.</th><th className="p-4 font-semibold">Medicine</th><th className="p-4 font-semibold">Quantity</th><th className="p-4 font-semibold">Expiry</th></>}
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      {activeTab === 'categories' && (
                        <>
                          <td className="p-4 font-medium">{item.name}</td>
                          <td className="p-4 text-gray-500 truncate max-w-xs">{item.description || '-'}</td>
                        </>
                      )}
                      {activeTab === 'medicines' && (
                        <>
                          <td className="p-4">
                            <p className="font-medium">{item.name} <span className="text-sm text-gray-400">{item.strength}</span></p>
                            <p className="text-xs text-gray-400">{item.generic_name}</p>
                          </td>
                          <td className="p-4 text-sm">{getCategoryName(item.category)}</td>
                          <td className="p-4 capitalize">
                            <span className="bg-[#e4f3d9] text-slate-700 py-1 px-3 rounded-full text-xs font-medium">{item.form}</span>
                          </td>
                          <td className="p-4">
                            <span className={item.stock <= item.reorder_level ? 'text-red-500 font-bold bg-red-50 px-2 py-1 rounded' : 'font-medium'}>
                              {item.stock}
                            </span>
                          </td>
                          <td className="p-4 font-medium">${item.price}</td>
                        </>
                      )}
                      {activeTab === 'batches' && (
                        <>
                          <td className="p-4 font-medium">#{item.batch_number}</td>
                          <td className="p-4 text-sm font-medium">{getMedicineDisplay(item.medicine)}</td>
                          <td className="p-4">{item.quantity}</td>
                          <td className="p-4 text-sm font-medium text-gray-600">{item.expiry_date}</td>
                        </>
                      )}
                      <td className="p-4 flex justify-end gap-2">
                        <button onClick={() => openModal('edit', item)} className="p-2 text-gray-400 hover:text-[#8dbd6e] hover:bg-[#eaf4df] rounded-lg transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800 capitalize">{modalMode} {activeTab.slice(0, -1)}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* CATEGORY FORM */}
              {activeTab === 'categories' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <input name="name" defaultValue={currentItem?.name} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea name="description" defaultValue={currentItem?.description} rows="3" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] focus:border-transparent outline-none transition-all"></textarea>
                  </div>
                </>
              )}

              {/* MEDICINE FORM */}
              {activeTab === 'medicines' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Medicine Name</label>
                    <input name="name" defaultValue={currentItem?.name} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Generic Name</label>
                    <input name="generic_name" defaultValue={currentItem?.generic_name} placeholder="e.g., Paracetamol" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  
                  {/* Foreign Key: Category Dropdown */}
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select name="category" defaultValue={currentItem?.category || ''} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none">
                      <option value="">No Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Form</label>
                    <select name="form" defaultValue={currentItem?.form || 'tablet'} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none">
                      {['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler', 'other'].map(f => (
                        <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Strength</label>
                    <input name="strength" defaultValue={currentItem?.strength} placeholder="e.g., 500mg" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Manufacturer</label>
                    <input name="manufacturer" defaultValue={currentItem?.manufacturer} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Initial Stock</label>
                    <input type="number" name="stock" defaultValue={currentItem?.stock || 0} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Reorder Level</label>
                    <input type="number" name="reorder_level" defaultValue={currentItem?.reorder_level || 10} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Selling Price ($)</label>
                    <input type="number" step="0.01" name="price" defaultValue={currentItem?.price} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                </div>
              )}

              {/* BATCH FORM */}
              {activeTab === 'batches' && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Foreign Key: Medicine Dropdown */}
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Medicine</label>
                    <select name="medicine" defaultValue={currentItem?.medicine || ''} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none">
                      <option value="" disabled>Select a medicine...</option>
                      {medicines.map(med => (
                        <option key={med.id} value={med.id}>
                          {med.name} {med.strength ? `(${med.strength})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Batch Number</label>
                    <input name="batch_number" defaultValue={currentItem?.batch_number} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity</label>
                    <input type="number" name="quantity" defaultValue={currentItem?.quantity} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Expiry Date</label>
                    <input type="date" name="expiry_date" defaultValue={currentItem?.expiry_date} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Price ($)</label>
                    <input type="number" step="0.01" name="purchase_price" defaultValue={currentItem?.purchase_price} required className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C1E1A6] outline-none" />
                  </div>
                </div>
              )}

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 bg-[#C1E1A6] hover:bg-[#aed48f] text-slate-800 rounded-xl font-semibold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                  {modalMode === 'add' ? 'Save Record' : 'Update Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}