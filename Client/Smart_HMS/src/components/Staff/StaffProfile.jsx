import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile, updateProfile } from "../../Redux/profileSlice";
import { BASE_URLs } from "../../apis/AllApi";
import {
  User,
  Mail,
  DollarSign,
  Edit3,
  Save,
  X,
  Camera,
  ShieldAlert,
  Lock,
  FileCheck,
  Fingerprint,
  Loader2,
} from "lucide-react";

const StaffProfile = () => {
  const dispatch = useDispatch();
  const { profile, loading, updateLoading, updateSuccess, error } = useSelector(
    (state) => state.profile
  );

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.user) {
      setFormData({
        firstName: profile.user.first_name || "",
        lastName: profile.user.last_name || "",
      });
      setPreviewUrl(profile.profile ? `${BASE_URLs}${profile.profile}` : "");
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      setSelectedFile(null);
    }
  }, [updateSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    
    data.append("user.first_name", formData.firstName);
    data.append("user.last_name", formData.lastName);
    
    if (selectedFile) {
      data.append("profile", selectedFile);
    }

    dispatch(updateProfile(data));
  };

  if (loading && !isEditing) {
    return (
      <div className="flex h-96 w-full items-center justify-center bg-slate-50/60">
        <Loader2 className="h-10 w-10 animate-spin text-[#C1E1A6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FBf7] py-10 px-4 sm:px-6 lg:px-8 text-slate-800 antialiased selection:bg-[#C1E1A6]/40">
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Dynamic Toast / Operational Banner States */}
        {error && (
          <div className="rounded-2xl bg-rose-50/80 p-4 text-sm font-medium text-rose-900 border border-rose-100 flex items-center gap-3 shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-2">
            <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {updateSuccess && (
          <div className="rounded-2xl bg-emerald-50/80 p-4 text-sm font-medium text-emerald-900 border border-emerald-100 flex items-center gap-3 shadow-sm backdrop-blur-sm transition-all animate-in fade-in slide-in-from-top-2">
            <FileCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <span>Institutional profile configuration synchronized successfully.</span>
          </div>
        )}

        {/* Core Layout Split Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Block: Identity Summary & Locked Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md/10">
            <div className="h-2.5 bg-[#C1E1A6]" />
            
            <div className="p-8 text-center border-b border-slate-100 bg-gradient-to-b from-[#F9FBf7]/40 to-transparent">
              <div className="relative mx-auto h-28 w-28 mb-4 group">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-white bg-slate-50 shadow-md ring-1 ring-slate-200/60 transition-transform duration-300 group-hover:scale-[1.02]">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Staff Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300 bg-slate-50">
                      <User className="h-14 w-14 stroke-[1.5]" />
                    </div>
                  )}
                </div>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-[#C1E1A6] text-slate-900 p-2.5 shadow-lg border border-white hover:bg-[#b2d496] active:scale-95 transition-all duration-200">
                    <Camera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {profile?.user?.first_name ? `${profile.user.first_name} ${profile.user.last_name || ""}` : "Hospital Employee"}
              </h2>
              <span className="inline-flex mt-2 items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#C1E1A6]/20 text-emerald-950 border border-[#C1E1A6]/30 tracking-wide">
                {profile?.designation || "Clinical Staff"}
              </span>
            </div>

            {/* Read-Only Meta Information Grid */}
            <div className="p-6 space-y-3.5 bg-white text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80">
                <div className="flex items-center gap-3 text-slate-500">
                  <Mail className="h-4 w-4 stroke-[1.8]" />
                  <span className="font-medium text-slate-600">Email Account</span>
                </div>
                <span className="font-semibold text-slate-800 text-right truncate max-w-[160px]">{profile?.user?.email || "N/A"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80">
                <div className="flex items-center gap-3 text-slate-500">
                  <Fingerprint className="h-4 w-4 stroke-[1.8]" />
                  <span className="font-medium text-slate-600">System ID</span>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">#{profile?.id || "----"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100/80">
                <div className="flex items-center gap-3 text-slate-500">
                  <DollarSign className="h-4 w-4 stroke-[1.8]" />
                  <span className="font-medium text-slate-600">Comp. Tier</span>
                </div>
                <span className="font-bold text-slate-900">{profile?.salary ? `${profile.salary} USD` : "0.00"}</span>
              </div>
              
              <div className="pt-3 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-400">
                <Lock className="h-3.5 w-3.5 text-slate-300" /> Base profile metadata is locked by administration
              </div>
            </div>
          </div>

          {/* Right Block: Dynamic Signature Form & Guidelines Workspace */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Interactive Identity Form Context */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Personal Identity Signature</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Modify your structural public identification keys.</p>
                </div>

                <div className="flex items-center self-start sm:self-center">
                  {!isEditing ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C1E1A6] hover:bg-[#b2d496] active:scale-[0.98] text-slate-900 px-4 py-2.5 text-xs font-semibold shadow-sm transition duration-200"
                    >
                      <Edit3 className="h-3.5 w-3.5 stroke-[2]" /> Edit Identity
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedFile(null);
                          setPreviewUrl(profile.profile ? `${BASE_URLs}${profile.profile}` : "");
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 active:scale-[0.98] text-slate-600 px-3.5 py-2.5 text-xs font-semibold transition duration-200"
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={updateLoading}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[#C1E1A6] hover:bg-[#b2d496] active:scale-[0.98] disabled:active:scale-100 text-slate-900 px-4 py-2.5 text-xs font-semibold shadow-sm transition duration-200 disabled:opacity-50"
                      >
                        {updateLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5 stroke-[2]" />
                        )}
                        Commit changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Input Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Legal First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400/80 stroke-[1.8]" />
                    <input
                      type="text"
                      name="firstName"
                      disabled={!isEditing}
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter legal first name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 transition duration-200 focus:border-[#a6cd88] focus:outline-none focus:ring-4 focus:ring-[#C1E1A6]/20 disabled:bg-slate-50/80 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Legal Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400/80 stroke-[1.8]" />
                    <input
                      type="text"
                      name="lastName"
                      disabled={!isEditing}
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter legal last name"
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 transition duration-200 focus:border-[#a6cd88] focus:outline-none focus:ring-4 focus:ring-[#C1E1A6]/20 disabled:bg-slate-50/80 disabled:text-slate-400 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Institutional Compliance Architecture Footer */}
            <div className="bg-white rounded-2xl border border-slate-200/50 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Compliance & Regulatory Charters</h3>
                <p className="text-xs text-slate-500 mt-0.5">Mandatory operating requirements regarding medical systems handling.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100">
                {/* Protocol Block Alpha */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#C1E1A6]" /> Privacy & PHI Systems Protocol
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-500 font-medium">
                    All operations within this workspace track directly down to your unique employee signature. 
                    Viewing or disclosing Patient Protected Health Information (PHI) lacking direct assigned diagnostic cause maps directly to immediate disciplinary action or separation under global hospital bylaws.
                  </p>
                </div>

                {/* Protocol Block Beta */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-slate-300" /> Platform Deployment Terms
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-500 font-medium">
                    By submitting digital adjustments inside this terminal console, you affirm that the legal name representations provided match governmental identification files identically. Accounts are audited periodically to check metadata state continuity.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default StaffProfile;