"use client";

import { useState } from "react";
import { 
  MessageSquareMore, Mail, Link2, Copy, Check 
} from "lucide-react";
import { useGetMyReferralsQuery } from "../../../store/api/authApi";

export default function ReferralsSection({ user }) {
  const { data: referralsData } = useGetMyReferralsQuery(undefined, {
    pollingInterval: 15000
  });
  const myReferrals = referralsData?.data || [];
  const rewardSummary = referralsData?.rewardSummary;
  const rewardTiers = rewardSummary?.rewardSettings || (rewardSummary?.setting ? [rewardSummary.setting] : []);
  const highlightedReward = rewardSummary?.bestAvailableReward || rewardSummary?.nextReward || rewardSummary?.setting;
  const [copiedKey, setCopiedKey] = useState(null); // 'code' | 'link' | null

  const myRefCode = user?.referralCode || `VX-${user?.name?.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, "") || "USER"}-${user?.id?.slice(-4).toUpperCase() || "ABCD"}`;

  // Reliable copy with execCommand fallback
  const copyToClipboard = (text, key) => {
    const done = () => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    };
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => {
        execCopy(text);
        done();
      });
    } else {
      execCopy(text);
      done();
    }
  };

  const execCopy = (text) => {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.position = "fixed";
    el.style.opacity = "0";
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Refer & Earn Premium Console */}
      <div className="relative bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden space-y-10">
        {/* Subtle background gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-50/80 to-purple-50/40 rounded-full blur-3xl opacity-70 -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-50/80 to-sky-50/40 rounded-full blur-3xl opacity-70 -ml-20 -mb-20 pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          {/* Top Section: Header & Referral Code */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-start gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50/80 backdrop-blur-sm rounded-full border border-indigo-100/50">
                <span className="text-xs">🎁</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700">Program Commission & Rewards</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Refer a Business & Get Rewarded!</h2>
              <p className="text-slate-500 font-medium text-base leading-relaxed">
                Share your direct referral link with founders, partners, or colleagues. When they sign up using your link and complete a service registration, your reward progress increases.
              </p>
            </div>
            
            {/* Referral Code Box */}
            <div className="relative group bg-white border border-slate-200/80 p-2.5 pl-7 rounded-2xl flex items-center justify-between gap-8 w-full xl:w-auto shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col py-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block leading-none mb-2">Referral Code</span>
                <span className="text-xl font-black text-slate-800 tracking-widest leading-none">{myRefCode}</span>
              </div>
              <button
                onClick={() => copyToClipboard(myRefCode, "code")}
                className={`btn h-14 rounded-xl px-8 font-black uppercase text-[12px] tracking-wider border-none shadow-sm transition-all hover:-translate-y-0.5 flex items-center gap-2.5 shrink-0 ${
                  copiedKey === "code"
                    ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-600"
                    : "bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-indigo-600/30"
                }`}
              >
                {copiedKey === "code" ? <><Check size={18} strokeWidth={3} /> Copied!</> : <><Copy size={18} strokeWidth={3} /> Copy</>}
              </button>
            </div>
          </div>

          {/* Middle Section: Stats Cards */}
          {highlightedReward && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 w-full">
              <div className="flex flex-col justify-center h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="block text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Next Reward</span>
                <span className="text-[15px] font-black text-slate-800 leading-snug">
                  {highlightedReward.requiredReferrals} referrals = {highlightedReward.discountPercent}% off
                </span>
              </div>
              <div className="flex flex-col justify-center h-full rounded-2xl border border-indigo-100/60 bg-indigo-50/40 p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="block text-[11px] font-black uppercase tracking-widest text-indigo-400 mb-2">Total Signups</span>
                <span className="text-3xl font-black text-indigo-700 leading-none">{myReferrals.length}</span>
              </div>
              <div className="flex flex-col justify-center h-full rounded-2xl border border-emerald-100/60 bg-emerald-50/40 p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="block text-[11px] font-black uppercase tracking-widest text-emerald-500 mb-2">Reward Referrals</span>
                <span className="text-3xl font-black text-emerald-700 leading-none">{rewardSummary.completedReferrals || 0}</span>
              </div>
              <div className="flex flex-col justify-center h-full rounded-2xl border border-amber-100/60 bg-amber-50/40 p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="block text-[11px] font-black uppercase tracking-widest text-amber-500 mb-2">Available Rewards</span>
                <span className="text-3xl font-black text-amber-700 leading-none">{rewardSummary.availableRewards || 0}</span>
              </div>
            </div>
          )}

          {/* Reward Tiers Pills */}
          {rewardTiers.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center">Milestones:</span>
              {rewardTiers.map((tier) => (
                <span
                  key={tier.id || `${tier.requiredReferrals}-${tier.discountPercent}`}
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-[10px] font-black uppercase tracking-wider shadow-sm transition-all ${
                    tier.redeemed
                      ? "border-slate-200 bg-white text-slate-400 opacity-70"
                      : tier.unlocked
                      ? "border-emerald-200 bg-emerald-50/80 text-emerald-700"
                      : "border-indigo-100 bg-indigo-50/80 text-indigo-700"
                  }`}
                >
                  {tier.requiredReferrals} refs = {tier.discountPercent}% off{tier.redeemed ? " (Redeemed)" : tier.unlocked ? " (Unlocked)" : ""}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Section: Action sharing tray */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 border-t border-slate-100">
          {/* Action 1: WhatsApp */}
          <button
            onClick={() => {
              const registerLink = `${window.location.origin}/register/user?ref=${myRefCode}`;
              const text = `Hey! I highly recommend Veagle Space Technology for Company Registration, Tax, and Compliance. Use my link to sign up: ${registerLink}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="group flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 p-5 h-full bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/50 rounded-2xl transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <MessageSquareMore size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-black text-[14px] text-slate-700 group-hover:text-emerald-700 transition-colors">Share on WhatsApp</span>
              <span className="text-[11px] font-semibold text-slate-400">Direct message to contacts</span>
            </div>
          </button>

          {/* Action 2: Email */}
          <button
            onClick={() => {
              const subject = encodeURIComponent("Business Professional Support - Veagle Space Technology");
              const body = encodeURIComponent(
                `Hey,\n\nI highly recommend Veagle Space Technology for Company Registration, Trademark filing, GST, Income Tax, and all professional business licenses.\n\nUse my direct link to sign up and get started: ${typeof window !== "undefined" ? window.location.origin : ""}/register/user?ref=${myRefCode}\n\nBest regards!`
              );
              window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank");
            }}
            className="group flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 p-5 h-full bg-white border border-slate-200 hover:border-sky-200 hover:bg-sky-50/50 rounded-2xl transition-all hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-full bg-sky-100/80 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
              <Mail size={22} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="font-black text-[14px] text-slate-700 group-hover:text-sky-700 transition-colors">Share via Email</span>
              <span className="text-[11px] font-semibold text-slate-400">Send an email invite</span>
            </div>
          </button>

          {/* Action 3: Copy direct link */}
          <button
            onClick={() => {
              const registerLink = `${window.location.origin}/register/user?ref=${myRefCode}`;
              copyToClipboard(registerLink, "link");
            }}
            className={`group flex flex-col md:flex-row items-center justify-center md:justify-start gap-4 p-5 h-full bg-white border rounded-2xl transition-all hover:shadow-md ${
              copiedKey === "link"
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50"
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform shadow-sm ${
              copiedKey === "link"
                ? "bg-emerald-100 text-emerald-600 scale-110"
                : "bg-indigo-100/80 text-indigo-600 group-hover:scale-110"
            }`}>
              {copiedKey === "link" ? <Check size={22} strokeWidth={3} /> : <Link2 size={22} strokeWidth={2.5} />}
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className={`font-black text-[14px] transition-colors ${copiedKey === "link" ? "text-emerald-700" : "text-slate-700 group-hover:text-indigo-700"}`}>
                {copiedKey === "link" ? "Link Copied!" : "Copy Referral Link"}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Share anywhere you want</span>
            </div>
          </button>
        </div>
      </div>

      {/* Referred Friends History */}
      {myReferrals.length > 0 && (
        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-8">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-extrabold text-slate-800 text-xl tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">👥</div> 
              Referred Friends History ({myReferrals.length})
            </h3>
            <span className="text-[11px] font-black text-indigo-500 bg-indigo-50 border border-indigo-100/50 px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
              Syncing Live
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
            <table className="table w-full border-collapse bg-white">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="py-4 pl-6">Friend Name</th>
                  <th className="py-4">Contact</th>
                  <th className="py-4">Referred Date</th>
                  <th className="py-4">Status</th>
                  <th className="py-4 pr-6 text-right">Service Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myReferrals.map((ref) => (
                  <tr key={ref.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="py-5 pl-6 font-bold text-slate-800 text-sm">{ref.friendName}</td>
                    <td className="py-5 text-xs font-semibold text-slate-500">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-700">{ref.friendEmail}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{ref.friendPhone || "No Phone"}</span>
                      </div>
                    </td>
                    <td className="py-5 text-xs font-semibold text-slate-500">
                      {new Date(ref.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-5">
                      <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-sm ${
                        ref.status === "NEW" ? "bg-sky-50 text-sky-700 border-sky-200/60" :
                        ref.status === "CONVERTED" ? "bg-indigo-50 text-indigo-700 border-indigo-200/60" :
                        ref.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200/60" :
                        "bg-slate-50 text-slate-600 border-slate-200/60"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          ref.status === "NEW" ? "bg-sky-500" :
                          ref.status === "CONVERTED" ? "bg-indigo-500" :
                          ref.status === "COMPLETED" ? "bg-emerald-500" :
                          "bg-slate-400"
                        }`} />
                        {ref.status === "NEW" ? "Registered" : ref.status}
                      </span>
                    </td>
                    <td className="py-5 pr-6 text-right text-[13px] font-extrabold text-indigo-900">{ref.serviceName || "Sign Up"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
