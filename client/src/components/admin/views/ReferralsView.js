"use client";

import { useState } from "react";
import { useUpdateReferralRewardMutation, useUpdateReferralStatusMutation } from "../../../store/api/adminApi";
import { Users, Gift, TrendingUp, Mail, Phone, Settings } from "lucide-react";

export default function ReferralsView({ referrals = [], referrers = [], rewardSettings = [] }) {
  const [updateReferralStatus, { isLoading: isUpdating }] = useUpdateReferralStatusMutation();
  const [updateReferralReward, { isLoading: isSavingReward }] = useUpdateReferralRewardMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const activeRewards = rewardSettings.filter((item) => item.isActive).sort((a, b) => a.requiredReferrals - b.requiredReferrals);
  const activeReward = activeRewards[0] || rewardSettings[0];
  const [showRewardForm, setShowRewardForm] = useState(false);
  const [rewardForm, setRewardForm] = useState({
    title: activeReward?.title || "Refer 5 friends, get 20% off any one service",
    requiredReferrals: activeReward?.requiredReferrals || 5,
    discountPercent: activeReward?.discountPercent || 20,
  });

  // 1. Calculate Aggregate Metrics
  const totalReferrals = referrals.length;
  const convertedCount = referrals.filter(r => r.status === "CONVERTED" || r.status === "COMPLETED").length;
  const pendingCount = referrals.filter(r => r.status === "NEW" || r.status === "IN_PROGRESS").length;

  // 2. Group Referrals by Referrer (from database)
  const topReferrers = [...referrers].sort((a, b) => b.totalReferred - a.totalReferred).map(referrer => {
    // calculate converted count from their referrals
    const converted = (referrer.referrals || []).filter(r => r.status === "CONVERTED" || r.status === "COMPLETED").length;
    return {
      name: referrer.name,
      email: referrer.email || "No Email",
      phone: referrer.phone || "No Phone",
      totalReferred: referrer.totalReferred,
      converted,
    };
  });

  // 3. Filtered Detailed Log (Who referred whom)
  const filteredReferrals = referrals.filter(ref => {
    const term = searchTerm.toLowerCase();
    return (
      ref.referrerName.toLowerCase().includes(term) ||
      ref.friendName.toLowerCase().includes(term) ||
      (ref.friendEmail || "").toLowerCase().includes(term) ||
      ref.referrerPhone.includes(term)
    );
  });

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateReferralStatus({ id, status: newStatus }).unwrap();
      alert("Referral reward status updated successfully!");
    } catch (err) {
      alert("Failed to update status: " + (err.data?.message || "Unknown error"));
    }
  };

  const handleRewardSubmit = async (e) => {
    e.preventDefault();
    const requiredReferrals = Number(rewardForm.requiredReferrals);
    const discountPercent = Number(rewardForm.discountPercent);
    try {
      await updateReferralReward({
        title: rewardForm.title || `Refer ${requiredReferrals} friends, get ${discountPercent}% off`,
        requiredReferrals,
        discountPercent,
      }).unwrap();
      setRewardForm({
        title: `Refer ${requiredReferrals + 1} friends, get ${Math.min(discountPercent + 5, 100)}% off`,
        requiredReferrals: requiredReferrals + 1,
        discountPercent: Math.min(discountPercent + 5, 100),
      });
      setShowRewardForm(false);
      alert("Referral reward saved successfully!");
    } catch (err) {
      alert("Failed to save reward: " + (err.data?.message || "Unknown error"));
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Referral Program Console</h1>
          <p className="text-slate-500 font-semibold text-sm mt-1">Manage B2B affiliates, track converted clients, and award referral bonuses.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowRewardForm(true)}
          className="btn btn-primary rounded-2xl h-11 px-5 font-black uppercase tracking-wider text-xs text-white gap-2"
        >
          <Settings size={16} /> Set Reward
        </button>
      </div>

      {showRewardForm && (
        <form onSubmit={handleRewardSubmit} className="bg-white border border-indigo-100 rounded-[2rem] p-6 shadow-sm space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">Referral reward rule</h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">Add or update a tier. Existing active tiers stay available, such as 5 referrals = 20% and 7 referrals = 30%.</p>
            </div>
            <button type="button" onClick={() => setShowRewardForm(false)} className="btn btn-ghost btn-sm rounded-xl">Close</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="form-control">
              <span className="label-text text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Reward Title</span>
              <input
                value={rewardForm.title}
                onChange={(e) => setRewardForm({ ...rewardForm, title: e.target.value })}
                className="input input-bordered rounded-xl font-bold text-sm"
                placeholder="Refer 5 friends, get 20% off"
              />
            </label>
            <label className="form-control">
              <span className="label-text text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Required Referrals</span>
              <input
                type="number"
                min="1"
                value={rewardForm.requiredReferrals}
                onChange={(e) => setRewardForm({ ...rewardForm, requiredReferrals: e.target.value })}
                className="input input-bordered rounded-xl font-bold text-sm"
              />
            </label>
            <label className="form-control">
              <span className="label-text text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Discount Percent</span>
              <input
                type="number"
                min="1"
                max="100"
                value={rewardForm.discountPercent}
                onChange={(e) => setRewardForm({ ...rewardForm, discountPercent: e.target.value })}
                className="input input-bordered rounded-xl font-bold text-sm"
              />
            </label>
          </div>
          <button type="submit" disabled={isSavingReward} className="btn btn-primary rounded-xl h-11 px-6 font-black text-white">
            {isSavingReward ? "Saving..." : "Save Reward"}
          </button>
        </form>
      )}

      {activeRewards.length > 0 && (
        <div className="flex flex-col gap-3 bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-black text-indigo-900">Active reward tiers</p>
            <p className="text-xs text-indigo-700 font-semibold mt-0.5">
              Each non-rejected referral signup counts toward rewards. Checkout uses the best unlocked unused tier.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeRewards.map((reward) => (
              <span key={reward.id} className="badge badge-primary badge-outline font-black h-auto min-h-8 px-3 py-1">
                {reward.requiredReferrals} referrals = {reward.discountPercent}% off
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Discount Info Banner */}
      {pendingCount > 0 && (
        <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4">
          <span className="text-2xl shrink-0">🏷️</span>
          <div>
            <p className="text-sm font-black text-amber-800">
              {pendingCount} referred user{pendingCount > 1 ? "s" : ""} may be eligible for a discount!
            </p>
            <p className="text-xs text-amber-700 font-semibold mt-0.5 leading-relaxed">
              Users who registered via a referral link are marked <span className="font-black">🎁 Via Referral</span> in User Management. 
              Contact them via the platform message system to offer a discount or promo before they place an order.
              Once rewarded, mark them as <span className="font-black">Converted</span> below.
            </p>
          </div>
        </div>
      )}

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 p-6 rounded-[2rem] border border-indigo-100 flex items-center gap-5 shadow-sm">
          <span className="p-4 bg-indigo-500 text-white rounded-2xl text-2xl"><Users /></span>
          <div>
            <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">Total Sign-up Leads</span>
            <span className="text-3xl font-black text-slate-800">{totalReferrals}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6 rounded-[2rem] border border-emerald-100 flex items-center gap-5 shadow-sm">
          <span className="p-4 bg-emerald-500 text-white rounded-2xl text-2xl"><Gift /></span>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">Converted Customers</span>
            <span className="text-3xl font-black text-slate-800">{convertedCount}</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-sky-100/50 p-6 rounded-[2rem] border border-sky-100 flex items-center gap-5 shadow-sm">
          <span className="p-4 bg-sky-500 text-white rounded-2xl text-2xl"><TrendingUp /></span>
          <div>
            <span className="text-[10px] font-black uppercase text-sky-700 tracking-wider block">Active Pending Reviews</span>
            <span className="text-3xl font-black text-slate-800">{pendingCount}</span>
          </div>
        </div>
      </div>

      {/* Grid: Left: Referrers Summary (How many referred), Right: Detailed Log (Who referred whom) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Referrers Rankings Summary (how many persons referred) */}
        <div className="xl:col-span-2 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <span>🏆</span> Referrer Summary rankings
            </h2>
            <p className="text-slate-400 text-xs font-semibold mt-1">Aggregated count of referrals made by each individual user.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="pb-3 pl-4">Referrer</th>
                  <th className="pb-3 text-center">Referred Count</th>
                  <th className="pb-3 pr-4 text-right">Converted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topReferrers.map((referrer, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 pl-4">
                      <div className="font-bold text-slate-800 text-sm leading-tight">{referrer.name}</div>
                      <div className="text-[10px] font-semibold text-slate-400 flex flex-col mt-0.5">
                        <span className="flex items-center gap-1"><Mail /> {referrer.email}</span>
                        <span className="flex items-center gap-1"><Phone /> {referrer.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-center font-extrabold text-indigo-900 text-base">
                      {referrer.totalReferred}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {referrer.converted} Converted
                      </span>
                    </td>
                  </tr>
                ))}
                {topReferrers.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-12 text-center text-xs opacity-40 italic">
                      No referrers active yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Referrals Log (Who referred whom) */}
        <div className="xl:col-span-3 bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>📝</span> Individual Referrals Log
              </h2>
              <p className="text-slate-400 text-xs font-semibold mt-1">Detailed list showing who referred whom and status.</p>
            </div>
            
            <input 
              type="text" 
              placeholder="Search detailed logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm rounded-xl w-48 sm:w-64 font-bold text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                  <th className="pb-3 pl-4">Referral Connection Path</th>
                  <th className="pb-3 text-center">Date & Service</th>
                  <th className="pb-3 text-center">Reward Status</th>
                  <th className="pb-3 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReferrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-4 pl-4">
                      <div className="flex items-center gap-4">
                        {/* Referrer Avatar & Details */}
                        <div className="flex items-center gap-2.5 w-44">
                          <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-indigo-100">
                            {ref.referrerName?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="truncate">
                            <div className="font-extrabold text-slate-800 text-xs truncate" title={ref.referrerName}>{ref.referrerName}</div>
                            <div className="text-[9px] font-bold text-slate-400 truncate">{ref.referrerPhone}</div>
                          </div>
                        </div>

                        {/* Connection Arrow */}
                        <div className="flex flex-col items-center shrink-0 w-16">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-300 mb-0.5">Invited</span>
                          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 border-t border-r border-slate-400 rotate-45 transform translate-x-1"></div>
                          </div>
                        </div>

                        {/* Friend Avatar & Details */}
                        <div className="flex items-center gap-2.5 w-48 pl-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-emerald-100">
                            {ref.friendName?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div className="truncate">
                            <div className="font-extrabold text-slate-800 text-xs truncate" title={ref.friendName}>{ref.friendName || "Unknown"}</div>
                            <div className="text-[9px] font-bold text-slate-400 truncate" title={ref.friendEmail}>{ref.friendEmail}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="text-xs font-bold text-slate-700">{ref.serviceName || "Sign Up"}</div>
                      <div className="text-[9px] font-semibold text-slate-400">{new Date(ref.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3.5 text-center">
                      <select
                        value={ref.status}
                        onChange={(e) => handleStatusChange(ref.id, e.target.value)}
                        disabled={isUpdating}
                        className={`select select-xs select-bordered rounded-lg font-black tracking-wide text-[9px] uppercase border ${
                          ref.status === "NEW" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                          ref.status === "CONVERTED" ? "bg-indigo-50 text-indigo-800 border-indigo-200" :
                          ref.status === "REJECTED" ? "bg-rose-50 text-rose-800 border-rose-200" :
                          "bg-slate-50 text-slate-800 border-slate-200"
                        }`}
                      >
                        <option value="NEW">New (Registered)</option>
                        <option value="CONVERTED">Converted (Client)</option>
                        <option value="COMPLETED">Completed (Paid)</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      {ref.status === "NEW" ? (
                        <button
                          onClick={() => handleStatusChange(ref.id, "CONVERTED")}
                          className="btn btn-emerald btn-xs rounded-lg px-2.5 font-bold uppercase text-[9px] tracking-wide text-white border-none shadow-sm hover:shadow"
                        >
                          Qualify Reward
                        </button>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-indigo-600">
                          {ref.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredReferrals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-xs opacity-40 italic">
                      No individual logs recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
