"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatRole, getDashboardPath } from "../../lib/auth";
import { useLoginMutation, useLogoutMutation, useRegisterMutation, useVerifyAdminOtpMutation, useRequestAdminPasswordResetMutation, useResetAdminPasswordMutation } from "../../store/api/authApi";
import { Eye, EyeOff, CheckCircle2, Circle } from "lucide-react";
import {
  validateName,
  validatePhone,
  validateEmail,
  validatePassword,
} from "../../lib/validators";
import useLiveValidation from "../../hooks/useLiveValidation";
import FormField from "../forms/FormField";
import PasswordStrength from "../forms/PasswordStrength";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function AuthFormInner({
  mode = "login",
  fixedRole = null,
  expectedRole = null,
  switchHref = null,
  switchLabel = null,
  switchText = null,
  allowPasswordReset = false,
  hideRegisterLink = false,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get("ref");

  const isRegister = mode === "register";
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [logout] = useLogoutMutation();
  const [verifyAdminOtp, { isLoading: isVerifyOtpLoading }] = useVerifyAdminOtpMutation();
  const [requestAdminPasswordReset, { isLoading: isResetRequestLoading }] = useRequestAdminPasswordResetMutation();
  const [resetAdminPassword, { isLoading: isResetSubmitLoading }] = useResetAdminPasswordMutation();
  
  const [step, setStep] = useState("credentials"); // "credentials" | "otp" | "forgot-request" | "forgot-reset"
  const [otpValue, setOtpValue] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: fixedRole || "USER",
    registrationKey: "",
    referralCode: refCode || "",
  });
  const [refCodeValid, setRefCodeValid] = useState(!!refCode);
  const [message, setMessage] = useState("");
  const isLoading = isRegister ? isRegisterLoading : isLoginLoading || isVerifyOtpLoading || isResetRequestLoading || isResetSubmitLoading;
  const validators = {
    ...(isRegister ? {
      name: (value) => validateName(value),
      phone: (value) => validatePhone(value, true),
    } : {}),
    email: (value) => validateEmail(value),
    password: (value) => validatePassword(value, false, 8, isRegister),
    ...(isRegister ? {
      confirmPassword: (value, formValues) => {
        if (!value) return "Please confirm your password";
        if (value !== formValues.password) return "Passwords do not match";
        return null;
      }
    } : {}),
  };
  const { errors, validateField, validateForm, getFieldSuccess, resetValidation } = useLiveValidation(validators);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  const update = (key) => (event) => {
    let value = event;
    if (key !== "phone" && event && event.target) {
        value = event.target.value;
    }
    if (key === "referralCode") {
      value = value.toUpperCase().replace(/[^A-Z0-9-]/g, "");
      // VX-XXXX-XXXX format check
      setRefCodeValid(/^VX-[A-Z0-9]{1,6}-[A-Z0-9]{2,8}$/.test(value));
    }
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    if (validators[key]) {
      validateField(key, value, nextForm);
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const newErrors = validateForm(form);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      if (step === "otp") {
        if (!otpValue || otpValue.length < 6) {
          setMessage("Please enter a valid 6-digit OTP.");
          return;
        }
        const data = await verifyAdminOtp({ email: tempEmail, otp: otpValue }).unwrap();
        router.replace(getDashboardPath(data.user.role));
        return;
      }

      const payload = isRegister
        ? { ...form, role: fixedRole || form.role, referredByCode: form.referralCode?.trim() || refCode || "" }
        : { email: form.email, password: form.password, expectedRole };
      const action = isRegister ? register : login;
      const data = await action(payload).unwrap();

      if (data.requiresOtp) {
        setStep("otp");
        setTempEmail(data.email);
        setMessage(data.message || "Please check your email for the OTP.");
        return;
      }

      if (expectedRole) {
        const roles = Array.isArray(expectedRole) ? expectedRole : [expectedRole];
        if (!roles.includes(data.user.role)) {
          await logout().catch(() => {});
          const roleNames = roles.map(formatRole).join(" or ");
          throw new Error(`${roleNames} account required for this login page.`);
        }
      }

      resetValidation();
      router.replace(getDashboardPath(data.user.role));
    } catch (error) {
      setMessage(error?.data?.message || error?.message || "Something went wrong.");
    }
  }

  const currentRole = fixedRole || form.role;
  const isProtectedRole = currentRole === "ADMIN" || currentRole === "SUPER_ADMIN";

  async function handleForgotRequest(event) {
    event.preventDefault();
    setMessage("");
    const emailErr = validateEmail(resetForm.email);
    if (emailErr) {
      setMessage(emailErr);
      return;
    }

    try {
      const data = await requestAdminPasswordReset({ email: resetForm.email }).unwrap();
      setTempEmail(data.email || resetForm.email);
      setResetForm((prev) => ({ ...prev, email: data.email || prev.email }));
      setStep("forgot-reset");
      setMessage(data.message || "Password reset OTP sent to your email.");
    } catch (error) {
      setMessage(error?.data?.message || error?.message || "Failed to request password reset.");
    }
  }

  async function handleForgotReset(event) {
    event.preventDefault();
    setMessage("");

    const emailErr = validateEmail(resetForm.email);
    const passwordErr = validatePassword(resetForm.password, false, 8, true);
    if (emailErr) {
      setMessage(emailErr);
      return;
    }
    if (!resetForm.otp || resetForm.otp.length < 6) {
      setMessage("Please enter a valid 6-digit OTP.");
      return;
    }
    if (passwordErr) {
      setMessage(passwordErr);
      return;
    }
    if (!resetForm.confirmPassword) {
      setMessage("Please confirm your new password.");
      return;
    }
    if (resetForm.password !== resetForm.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const data = await resetAdminPassword({
        email: resetForm.email,
        otp: resetForm.otp,
        password: resetForm.password,
      }).unwrap();
      setMessage(data.message || "Password reset successful.");
      setStep("credentials");
      setForm((prev) => ({ ...prev, email: resetForm.email, password: "" }));
      setResetForm({
        email: resetForm.email,
        otp: "",
        password: "",
        confirmPassword: "",
      });
      setShowResetPassword(false);
      setShowResetConfirmPassword(false);
    } catch (error) {
      setMessage(error?.data?.message || error?.message || "Failed to reset password.");
    }
  }

  if (step === "otp") {
    return (
      <form className="flex w-full flex-col gap-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onSubmit={handleSubmit} noValidate>
        <div className="rounded-xl border border-gold/20 bg-gold/10/60 px-4 py-3 text-sm font-medium text-indigo-800">
          An OTP has been sent to your email address. Please enter it below to securely access the dashboard.
        </div>
        <FormField label="One-Time Password (OTP)" htmlFor="auth-otp" required>
          <input
            id="auth-otp"
            type="text"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-4 text-[1.5rem] font-black tracking-[1em] text-center text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-gold/10"
          />
        </FormField>
        
        <button type="submit" className="mt-2 w-full rounded-xl bg-gold py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none border-none" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify & Login"}
        </button>
        {message && <p className="mt-2 rounded-xl bg-rose-50/60 p-3 text-center text-sm font-medium text-rose-600 border border-rose-100">{message}</p>}
        <button type="button" onClick={() => { setStep("credentials"); setMessage(""); setOtpValue(""); }} className="mt-2 text-sm font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2">
          &larr; Back to Login
        </button>
      </form>
    );
  }

  if (step === "forgot-request") {
    return (
      <form className="flex w-full flex-col gap-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onSubmit={handleForgotRequest} noValidate>
        <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-semibold text-indigo-800">
          Enter your email address to receive a password reset OTP.
        </div>
        <FormField label="Email Address" htmlFor="reset-email" required>
          <input
            id="reset-email"
            type="email"
            value={resetForm.email}
            onChange={(e) => setResetForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </FormField>
        <button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-primary/95 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none border-none" disabled={isLoading}>
          {isResetRequestLoading ? "Sending OTP..." : "Send Reset OTP"}
        </button>
        {message && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-center text-sm font-semibold text-rose-600 border border-rose-100">{message}</p>}
        <button
          type="button"
          onClick={() => { setStep("credentials"); setMessage(""); }}
          className="mt-2 text-sm font-bold text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          &larr; Back to Login
        </button>
      </form>
    );
  }

  if (step === "forgot-reset") {
    return (
      <form className="flex w-full flex-col gap-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onSubmit={handleForgotReset} noValidate>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          We sent a reset OTP to <span className="font-black">{tempEmail || resetForm.email}</span>. Enter it below and choose a new password.
        </div>
        <FormField label="Email Address" htmlFor="reset-email-confirm" required>
          <input
            id="reset-email-confirm"
            type="email"
            value={resetForm.email}
            onChange={(e) => setResetForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </FormField>
        <FormField label="Reset OTP" htmlFor="reset-otp" required>
          <input
            id="reset-otp"
            type="text"
            value={resetForm.otp}
            onChange={(e) => setResetForm((prev) => ({ ...prev, otp: e.target.value.replace(/\D/g, "").slice(0, 6) }))}
            placeholder="000000"
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[1.25rem] font-black tracking-[0.6em] text-center text-slate-900 outline-none transition-all placeholder:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </FormField>
        <FormField label="New Password" htmlFor="reset-password" required>
          <div className="relative">
            <input
              id="reset-password"
              type={showResetPassword ? "text" : "password"}
              value={resetForm.password}
              onChange={(e) => setResetForm((prev) => ({ ...prev, password: e.target.value }))}
              placeholder="Create a strong password"
              maxLength={128}
              className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 pr-12 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowResetPassword(!showResetPassword)}
            >
              {showResetPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <PasswordStrength password={resetForm.password} />
        </FormField>
        <FormField label="Confirm New Password" htmlFor="reset-confirm-password" required>
          <div className="relative">
            <input
              id="reset-confirm-password"
              type={showResetConfirmPassword ? "text" : "password"}
              value={resetForm.confirmPassword}
              onChange={(e) => setResetForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Re-enter your new password"
              maxLength={128}
              className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 pr-12 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
            >
              {showResetConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </FormField>
        <button type="submit" className="mt-2 w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:from-primary/95 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none border-none" disabled={isLoading}>
          {isResetSubmitLoading ? "Resetting Password..." : "Reset Password"}
        </button>
        {message && <p className="mt-2 rounded-xl bg-rose-50 p-3 text-center text-sm font-semibold text-rose-600 border border-rose-100">{message}</p>}
        <button
          type="button"
          onClick={() => { setStep("forgot-request"); setMessage(""); }}
          className="mt-2 text-sm font-bold text-slate-500 hover:text-slate-800 underline underline-offset-2"
        >
          &larr; Back
        </button>
      </form>
    );
  }

  return (
    <form className="flex w-full flex-col gap-4 transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30" onSubmit={handleSubmit} noValidate>
      {isRegister && (
        <>          {/* Referral code banner — shown only when valid code is present */}
          {refCodeValid && form.referralCode && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-sm font-black text-emerald-800">Referral code applied!</p>
                <p className="text-xs text-emerald-700 font-semibold mt-0.5">Code: <span className="font-black tracking-wide">{form.referralCode}</span> — you may be eligible for a discount.</p>
              </div>
            </div>
          )}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Full Name" htmlFor="auth-name" error={errors.name} success={false} required>
            <input
              id="auth-name"
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="Enter full name"
              maxLength={50}
              className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </FormField>

          <FormField label="Phone Number" htmlFor="auth-phone" error={errors.phone} success={false} hint="Optional but recommended">
            <PhoneInput
              country={'in'}
              value={form.phone}
              onChange={update("phone")}
              inputProps={{
                name: 'phone',
                id: 'auth-phone'
              }}
              inputStyle={{
                width: '100%',
                height: '3.25rem',
                paddingLeft: '3.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
                fontSize: '0.95rem',
                fontWeight: '600',
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
          </FormField>
        </div>

        {/* Referral Code Input */}
        <div className="space-y-1.5">
          <label htmlFor="auth-ref-code" className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            Referral Code <span className="text-[10px] text-slate-400 font-medium">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none select-none">🎁</span>
            <input
              id="auth-ref-code"
              type="text"
              value={form.referralCode}
              onChange={update("referralCode")}
              placeholder="e.g. VX-AKSH-90TB"
              maxLength={20}
              className={`w-full rounded-sm border pl-10 pr-4 py-3 text-[0.95rem] font-bold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-4 ${
                form.referralCode && refCodeValid
                  ? "border-emerald-400 bg-emerald-50/50 focus:ring-emerald-100 focus:border-emerald-500"
                  : form.referralCode && !refCodeValid
                  ? "border-rose-300 bg-rose-50/30 focus:ring-rose-100 focus:border-rose-400"
                  : "border-slate-200 bg-white focus:border-primary focus:ring-primary/10"
              }`}
            />
            {form.referralCode && (
              <span className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-black ${
                refCodeValid ? "text-emerald-600" : "text-rose-400"
              }`}>
                {refCodeValid ? "✓ Valid" : "Invalid format"}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">If someone shared their referral code with you, enter it here to earn both of you rewards.</p>
        </div>
      </>)}

      <FormField label="Email Address" htmlFor="auth-email" error={errors.email} success={false} required>
        <input
          id="auth-email"
          type="email"
          value={form.email}
          onChange={update("email")}
          placeholder="Enter email address"
          className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </FormField>

      <FormField label="Password" htmlFor="auth-password" error={errors.password} success={false} required>
        <div className="relative">
          <input
            id="auth-password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={update("password")}
            placeholder={isRegister ? "Create a strong password" : "Enter your password"}
            maxLength={128}
            className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 pr-12 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {isRegister && <PasswordStrength password={form.password} />}
      </FormField>

      {isRegister && (
        <FormField label="Confirm Password" htmlFor="auth-confirm-password" error={errors.confirmPassword} success={getFieldSuccess("confirmPassword", form.confirmPassword)} required>
          <div className="relative">
            <input
              id="auth-confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={update("confirmPassword")}
              placeholder="Re-enter your password"
              maxLength={128}
              className={`w-full rounded-sm border px-4 py-3 pr-12 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-4 ${
                errors.confirmPassword
                  ? "border-rose-500 bg-rose-50/10 focus:border-rose-500 focus:ring-rose-100"
                  : getFieldSuccess("confirmPassword", form.confirmPassword)
                  ? "border-emerald-500 bg-emerald-50/40 focus:ring-emerald-100"
                  : "border-slate-200 bg-white focus:border-primary focus:ring-primary/10"
              }`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </FormField>
      )}

      {isRegister && (
        <>
          {!fixedRole && (
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-role" className="text-sm font-semibold text-slate-700">Role</label>
              <select id="auth-role" value="USER" disabled className="w-full rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 text-[0.95rem] font-semibold text-slate-500 outline-none">
                <option value="USER">Standard User</option>
              </select>
            </div>
          )}

          {isProtectedRole && (
            <FormField label="Registration Key" htmlFor="auth-registration-key" required>
              <input
                id="auth-registration-key"
                type="password"
                value={form.registrationKey}
                onChange={update("registrationKey")}
                placeholder="Required for administrative accounts"
                required
                className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 text-[0.95rem] font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </FormField>
          )}
        </>
      )}

      <button type="submit" className="mt-4 w-full rounded-xl bg-gold py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:bg-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none border-none" disabled={isLoading}>
        {isLoading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
      </button>

      {message && <p className="mt-2 rounded-xl bg-rose-50/60 p-3 text-center text-sm font-medium text-rose-600 border border-rose-100">{message}</p>}

      {!isRegister && allowPasswordReset && (
        <button
          type="button"
          onClick={() => {
            setResetForm({
              email: form.email || "",
              otp: "",
              password: "",
              confirmPassword: "",
            });
            setMessage("");
            setStep("forgot-request");
          }}
          className="text-right text-sm font-semibold text-gold hover:text-gold underline underline-offset-2"
        >
          Forgot password?
        </button>
      )}

      {!hideRegisterLink && (
        <p className="mt-2 text-center text-sm font-medium text-slate-500">
          {switchText || (isRegister ? "Already have an account?" : "Need a new account?")}{" "}
          <Link href={switchHref || (isRegister ? "/login" : "/register")} className="font-semibold text-slate-900 hover:text-gold transition-colors">
            {switchLabel || (isRegister ? "Login" : "Register")}
          </Link>
        </p>
      )}
    </form>
  );
}

export default function AuthForm(props) {
  return (
    <Suspense fallback={<div className="flex w-full justify-center p-4"><span className="loading loading-spinner text-gold"></span></div>}>
      <AuthFormInner {...props} />
    </Suspense>
  );
}
