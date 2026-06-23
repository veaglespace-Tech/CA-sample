import React, { useState } from "react";
import { DollarSign, Search, Calendar, User, Mail, MessageSquare, Eye, X } from "lucide-react";
import PaginationControls from "../PaginationControls";

const getCustomRequirements = (payment) => {
  try {
    const metadataStr = payment.registrationLead?.metadata || payment.lead?.metadata;
    if (!metadataStr) return null;
    const parsed = JSON.parse(metadataStr);
    return parsed.customRequirements || null;
  } catch (e) {
    return null;
  }
};

function PaymentRow({ payment, onEmail, onMessage }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const customReqs = getCustomRequirements(payment);

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
      <td className="py-4 pl-6">
        <div className="font-extrabold text-slate-900 text-xs">#{payment.id.slice(-8).toUpperCase()}</div>
        <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1 mt-0.5">
          <Calendar size={10} /> {new Date(payment.createdAt).toLocaleString()}
        </div>
      </td>
      <td className="py-4">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold flex items-center justify-center font-black text-xs shrink-0">
              {(payment.user?.name || payment.customerName)?.charAt(0) || <User size={14} />}
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-sm leading-tight flex items-center">
                {payment.user?.name || payment.customerName || "Guest User"}
                {payment.user ? (
                  <span className="ml-2 text-[9px] bg-indigo-100 text-gold px-1.5 py-0.5 rounded-full font-bold">Registered Client</span>
                ) : (
                  <span className="ml-2 text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded-full font-bold">Guest User</span>
                )}
              </div>
              <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{payment.user?.email || payment.customerEmail || "No email"} • {payment.user?.phone || payment.customerPhone || "No phone"}</div>
            </div>
        </div>
      </td>
      <td className="py-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-800 border border-slate-200">
            {payment.serviceName}
        </span>
        {customReqs && (
          <div className="mt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-sm text-[10px] font-bold uppercase tracking-wider transition-colors border border-orange-200 shadow-sm"
            >
              <Eye size={12} /> View Requirements
            </button>
            {isExpanded && (
              <div className="mt-2 text-xs text-slate-600 bg-orange-50 p-3 rounded-sm border border-orange-200 italic relative animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
                <button onClick={() => setIsExpanded(false)} className="absolute top-2 right-2 text-slate-500 hover:text-orange-600 transition-colors bg-white rounded-full p-0.5 shadow-sm border border-slate-100">
                  <X size={14} />
                </button>
                <strong className="text-[10px] uppercase tracking-wider text-orange-600 not-italic block mb-1.5">User&apos;s Request:</strong>
                <span className="whitespace-pre-wrap leading-relaxed">&quot;{customReqs}&quot;</span>
              </div>
            )}
          </div>
        )}
      </td>
      <td className="py-4 text-right pr-6">
        <div className={`font-black text-lg ${payment.status?.includes('UNPAID') ? 'text-orange-500' : 'text-emerald-600'}`}>
          {payment.amount === 'Custom Quote' ? 'Custom Quote' : `₹${payment.amount}`}
        </div>
        <div className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${payment.status?.includes('UNPAID') ? 'text-orange-400' : 'text-emerald-400'}`}>
          Status: {payment.status}
        </div>
        {payment.status?.includes('UNPAID') && (payment.user?.email || payment.customerEmail) && (
          <div className="flex gap-2 justify-end mt-2">
            <button 
              onClick={() => onEmail && onEmail({ ...payment, customRequirements: customReqs })}
              className="px-3 py-1 bg-orange-100 text-orange-700 hover:bg-orange-200 text-[10px] font-bold rounded-sm transition-colors flex items-center gap-1"
            >
              <Mail size={12} /> Negotiate via Email
            </button>
            <button 
              onClick={() => onMessage && onMessage(payment)}
              className="px-3 py-1 bg-indigo-100 text-gold hover:bg-indigo-200 text-[10px] font-bold rounded-sm transition-colors flex items-center gap-1"
            >
              <MessageSquare size={12} /> System Message
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function PaymentsView({ payments = [], onEmail, onMessage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    const userName = (p.user?.name || p.customerName || "").toLowerCase();
    const userEmail = (p.user?.email || p.customerEmail || "").toLowerCase();
    return (
      userName.includes(term) ||
      userEmail.includes(term) ||
      p.serviceName?.toLowerCase().includes(term) ||
      p.id?.toLowerCase().includes(term)
    );
  });

  const successfulPayments = filteredPayments.filter((p) => p.status === "SUCCESS");
  const totalRevenue = successfulPayments.reduce((acc, p) => acc + (parseFloat(p.amount) || 0), 0);
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedPayments = filteredPayments.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl"><DollarSign size={28} /></span>
            Paid Services Log
          </h2>
          <p className="text-slate-500 font-semibold text-sm mt-1">Trace users who successfully paid for specific services.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search payments..."
              className="input input-bordered h-12 pl-10 rounded-xl shadow-sm text-sm font-semibold w-full md:w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block mb-1">Total Verified Revenue (Filtered)</span>
          <span className="text-4xl font-black text-emerald-900">₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-white/60 px-5 py-3 rounded-2xl border border-emerald-200/50 backdrop-blur-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
           <span className="text-xs font-bold text-emerald-800">
             Showing {filteredPayments.length} records, {successfulPayments.length} successful
           </span>
        </div>
      </div>

      <div className="bg-white border border-slate-100 shadow-sm rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <th className="py-4 pl-6">Transaction ID & Date</th>
                <th className="py-4">Client Details</th>
                <th className="py-4">Service Paid For</th>
                <th className="py-4 text-right pr-6">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedPayments.map((payment) => (
                <PaymentRow 
                  key={payment.id} 
                  payment={payment} 
                  onEmail={onEmail} 
                  onMessage={onMessage} 
                />
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 md:py-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                       <DollarSign className="text-slate-600" size={24} />
                    </div>
                    <div className="text-sm font-bold text-slate-500">No payment records found</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <PaginationControls
          totalItems={filteredPayments.length}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            const newPageSize = size;
            const newTotalPages = Math.max(1, Math.ceil(filteredPayments.length / newPageSize));
            setPage(Math.min(currentPage, newTotalPages));
          }}
        />
      </div>
    </div>
  );
}
