"use client";

import { useState } from "react";
import { validatePassword } from "../../../lib/passwordValidation";
import PasswordInput from "../../ui/PasswordInput";
import { User, ShieldCheck, Lock } from "lucide-react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export default function ProfileSection({
  profileForm,
  setProfileForm,
  handleProfileUpdate,
  isUpdating,
  errors = {},
  setErrors,
  isStaff = false,
  canChangePassword = true,
}) {
  const [pwdError, setPwdError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (canChangePassword && profileForm.password) {
      const err = validatePassword(profileForm.password);
      if (err) {
        setPwdError(err);
        return;
      }
    }
    setPwdError("");
    handleProfileUpdate(e);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Block with glowing accent */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-blue-50/30 text-white rounded-[2.5rem] p-8 shadow-[0_10px_35px_rgba(99,102,241,0.03)] relative border border-gold/20/70 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(99,102,241,0.06),transparent_50%)]"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-indigo-100/70 rounded-full border border-gold/30/50">
              <User size={14} className="text-gold" />
              <span className="text-[10px] font-black uppercase tracking-wider text-gold">Account Settings</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-white">Your Profile</h1>
            <p className="text-slate-400 text-xs md:text-sm font-semibold max-w-xl">
              {!canChangePassword
                ? "Manage your personal information and contact details below."
                : isStaff
                ? "Manage your personal information and contact details below."
                : "Manage your personal information, security credentials, and contact details below."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-navy rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-slate-800 overflow-hidden">
        <div className="p-8 md:p-4 md:p-10">
          <h3 className="text-lg font-black mb-8 flex items-center gap-3 text-white uppercase tracking-wide">
            <span className="w-1.5 h-6 bg-gold rounded-full"></span>
            Personal Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-8 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30">
            <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {/* Full Name */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full rounded-none border border-slate-700 bg-navy-light/50 px-4 py-3 text-sm font-bold text-white outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 hover:border-slate-300 h-14 ${errors.name ? 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-100' : ''}`}
                  value={profileForm.name}
                  onChange={e => {
                    setProfileForm({ ...profileForm, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  required
                />
                {errors.name && <span className="text-xs text-rose-500 mt-1 font-bold ml-1">{errors.name}</span>}
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  className={`w-full rounded-none border border-slate-700 bg-navy-light/50 px-4 py-3 text-sm font-bold text-white outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 hover:border-slate-300 h-14 ${errors.email ? 'border-rose-400 bg-rose-50 focus:border-rose-500 focus:ring-rose-100' : ''}`}
                  value={profileForm.email}
                  onChange={e => {
                    setProfileForm({ ...profileForm, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  required
                />
                {errors.email && <span className="text-xs text-rose-500 mt-1 font-bold ml-1">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <PhoneInput
                  country={'in'}
                  value={profileForm.phone}
                  onChange={(phone) => {
                    setProfileForm({ ...profileForm, phone });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  inputProps={{
                    name: 'phone',
                    required: true,
                  }}
                  inputStyle={{
                    width: '100%',
                    height: '3.5rem',
                    paddingLeft: '3.5rem',
                    borderRadius: '1rem',
                    border: errors.phone ? '1px solid #fb7185' : '1px solid #e2e8f0',
                    backgroundColor: errors.phone ? '#fff1f2' : 'rgba(248, 250, 252, 0.5)',
                    fontSize: '0.875rem',
                    fontWeight: '700',
                    color: '#0f172a',
                  }}
                  buttonStyle={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderRadius: '1rem 0 0 1rem',
                    paddingLeft: '0.5rem'
                  }}
                  containerStyle={{
                    width: '100%'
                  }}
                />
                {errors.phone && <span className="text-xs text-rose-500 mt-1 font-bold ml-1">{errors.phone}</span>}
              </div>
            </div>

            {/* ── Security & Password ── only shown to regular users ── */}
            {canChangePassword && (
              <>
                <h3 className="text-lg font-black mb-6 mt-10 flex items-center gap-3 text-white uppercase tracking-wide">
                  <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
                  Security &amp; Password
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Old Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1 flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-slate-400" />
                      Current Password (if changing)
                    </label>
                    <PasswordInput
                      id="profile-old-password"
                      value={profileForm.oldPassword || ""}
                      onChange={e => {
                        setProfileForm({ ...profileForm, oldPassword: e.target.value });
                        if (errors.oldPassword) setErrors({ ...errors, oldPassword: null });
                      }}
                      placeholder="Required if setting new password"
                      required={!!profileForm.password}
                      showStrength={false}
                      error={errors.oldPassword || undefined}
                      inputClassName="w-full rounded-none border border-slate-700 bg-navy-light/50 px-4 py-3 text-sm font-bold text-white outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 hover:border-slate-300 h-14"
                    />
                  </div>

                  {/* New Password */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">
                      New Password (optional)
                    </label>
                    <PasswordInput
                      id="profile-password"
                      value={profileForm.password}
                      onChange={e => {
                        setProfileForm({ ...profileForm, password: e.target.value });
                        if (pwdError) setPwdError("");
                      }}
                      placeholder="Leave blank to keep current"
                      required={false}
                      showStrength={true}
                      error={pwdError || errors.password || undefined}
                      inputClassName="w-full rounded-none border border-slate-700 bg-navy-light/50 px-4 py-3 text-sm font-bold text-white outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/50 hover:border-slate-300 h-14"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Admin notice — shown only to staff */}
            {!canChangePassword && (
              <div className="flex items-start gap-3 p-4 rounded-none bg-amber-50 border border-amber-100 mt-2">
                <Lock size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs font-semibold text-amber-700 leading-relaxed">
                  Password changes for super admin accounts are managed separately. Please use your secure internal recovery process if you need an update.
                </p>
              </div>
            )}

            <div className="pt-8 mt-8 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="btn btn-primary px-4 md:px-10 rounded-none h-14 font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:-translate-y-0.5 border-none text-white"
                disabled={isUpdating}
              >
                {isUpdating ? <span className="loading loading-spinner"></span> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
