"use client";
import { useState } from "react";
import { validateName, validatePhone, validateEmail, validatePassword } from "../../../lib/validators";
import useLiveValidation from "../../../hooks/useLiveValidation";
import FormFeedback from "../../forms/FormFeedback";
import PasswordStrength from "../../forms/PasswordStrength";
import dynamic from 'next/dynamic';
const PhoneInput = dynamic(() => import('react-phone-input-2'), { ssr: false });
import 'react-phone-input-2/lib/style.css';

function createInitialUserForm(editingUser) {
  if (!editingUser) {
    return { name: "", email: "", phone: "", password: "", role: "USER" };
  }
  let initialPhone = editingUser.phone || "";
  if (initialPhone && initialPhone.length === 10 && !initialPhone.startsWith('+')) {
    initialPhone = '91' + initialPhone;
  }
  return {
    name: editingUser.name,
    email: editingUser.email,
    phone: initialPhone,
    password: "",
    role: editingUser.role,
  };
}

export default function UserFormModal({ editingUser, currentUserRole, onClose, onSubmit, formMessage }) {
  const [userForm, setUserForm] = useState(() => createInitialUserForm(editingUser));
  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";
  const roleOptions = isSuperAdmin
    ? [
        { value: "USER", label: "Standard User" },
        { value: "ADMIN", label: "Administrator" },
        { value: "SUPER_ADMIN", label: "Super Administrator" },
      ]
    : [
        { value: "USER", label: "Standard User" },
        { value: "ADMIN", label: "Administrator" },
      ];
  const validators = {
    name: (value) => validateName(value),
    email: (value) => validateEmail(value),
    phone: (value) => validatePhone(value),
    password: (value) => validatePassword(value, Boolean(editingUser), 8),
  };
  const { errors, validateField, validateForm, getFieldSuccess } = useLiveValidation(validators);

  const handleFieldChange = (key, value) => {
    let finalValue = value;
    if (key === "phone" && typeof value === "object" && value && value.target) {
        finalValue = value.target.value;
    }
    const nextForm = { ...userForm, [key]: finalValue };
    setUserForm(nextForm);
    if (validators[key]) {
      validateField(key, finalValue, nextForm);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm(userForm);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    onSubmit(userForm);
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md rounded-none p-8 bg-navy-light shadow-2xl border border-base-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-2xl tracking-tight">{editingUser ? "Edit User" : "Add New User"}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-circle btn-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" noValidate>
          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold">Full Name</span></label>
            <input
              type="text"
              placeholder="E.g. John Doe"
              className={`input input-bordered rounded-sm focus:input-primary ${errors.name ? "input-error border-rose-500" : getFieldSuccess("name", userForm.name) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
              value={userForm.name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
            />
            <FormFeedback error={errors.name} success={getFieldSuccess("name", userForm.name)} className="px-1" />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold">Email Address</span></label>
            <input
              type="email"
              placeholder="E.g. john@example.com"
              className={`input input-bordered rounded-sm focus:input-primary ${errors.email ? "input-error border-rose-500" : getFieldSuccess("email", userForm.email) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
              value={userForm.email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
            />
            <FormFeedback error={errors.email} success={getFieldSuccess("email", userForm.email)} className="px-1" />
          </div>

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold">Phone Number</span></label>
            <PhoneInput
              country={'in'}
              value={userForm.phone}
              onChange={(phone) => handleFieldChange("phone", phone)}
              inputProps={{
                name: 'phone',
                required: true,
              }}
              inputStyle={{
                width: '100%',
                height: '3rem',
                paddingLeft: '3.5rem',
                borderRadius: '0.75rem',
                border: errors.phone ? '1px solid #f43f5e' : getFieldSuccess("phone", userForm.phone) ? '1px solid #10b981' : '1px solid #e2e8f0',
                backgroundColor: errors.phone ? '#fff1f2' : getFieldSuccess("phone", userForm.phone) ? '#ecfdf5' : '#ffffff',
                fontSize: '0.875rem',
                color: '#0f172a',
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '0.75rem 0 0 0.75rem',
                paddingLeft: '0.5rem'
              }}
              containerStyle={{
                width: '100%'
              }}
            />
            <FormFeedback error={errors.phone} success={getFieldSuccess("phone", userForm.phone)} className="px-1" />
          </div>

          {editingUser?.role === "SUPER_ADMIN" ? (
            <div className="form-control w-full bg-navy-light border border-slate-800 p-4 rounded-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              <span className="text-sm font-bold text-slate-200">Password Management Restricted</span>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Super Admin passwords cannot be reset or changed here. Please contact VeagleSpace for password changes.
              </p>
            </div>
          ) : (
            <div className="form-control w-full">
              <label className="label"><span className="label-text font-bold">{editingUser ? "New Password (Optional)" : "Password"}</span></label>
              <input
                type="password"
                placeholder={editingUser ? "Leave blank to keep current" : "Min 8 chars, uppercase, lowercase, digit & special char"}
                className={`input input-bordered rounded-sm focus:input-primary ${errors.password ? "input-error border-rose-500" : getFieldSuccess("password", userForm.password) ? "border-emerald-500 bg-emerald-50/40" : ""}`}
                value={userForm.password}
                onChange={(e) => handleFieldChange("password", e.target.value)}
              />
              <FormFeedback error={errors.password} success={getFieldSuccess("password", userForm.password)} className="px-1" />
              <PasswordStrength password={userForm.password} />
            </div>
          )}

          <div className="form-control w-full">
            <label className="label"><span className="label-text font-bold">Assigned Role</span></label>
            <select
              className="select select-bordered rounded-sm focus:select-primary"
              value={userForm.role}
              onChange={(e) => handleFieldChange("role", e.target.value)}
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {!isSuperAdmin && (
              <p className="mt-2 px-1 text-[11px] font-semibold text-slate-400">
                Only super admins can create or assign the super admin role.
              </p>
            )}
          </div>

          {formMessage && (
            <div className="alert alert-error rounded-sm p-3 text-xs">
              <span>{formMessage}</span>
            </div>
          )}

          <div className="modal-action mt-8 pt-4 border-t border-base-200">
            <button type="button" onClick={onClose} className="btn btn-ghost rounded-sm px-8">Cancel</button>
            <button type="submit" className="btn btn-primary rounded-sm px-4 md:px-10 shadow-lg shadow-primary/20">
              {editingUser ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop bg-black/40 backdrop-blur-sm transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onClick={onClose}>
        <button>close</button>
      </form>
    </dialog>
  );
}
