"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, PieChart, Shield, Target } from "lucide-react";

export default function IncomeTaxCalculator() {
  const [salary, setSalary] = useState(1200000);
  const [regime, setRegime] = useState("new"); // new or old

  const standardDeduction = regime === "new" ? 75000 : 50000;

  const calculateTax = () => {
    let income = Math.max(0, parseFloat(salary) || 0);
    let tax = 0;

    if (regime === "new") {
      income = Math.max(0, income - standardDeduction);

      if (income > 400000) tax += Math.min(income - 400000, 400000) * 0.05;
      if (income > 800000) tax += Math.min(income - 800000, 400000) * 0.10;
      if (income > 1200000) tax += Math.min(income - 1200000, 400000) * 0.15;
      if (income > 1600000) tax += Math.min(income - 1600000, 400000) * 0.20;
      if (income > 2000000) tax += Math.min(income - 2000000, 400000) * 0.25;
      if (income > 2400000) tax += (income - 2400000) * 0.30;

      if (income <= 1200000) return 0;
      tax = Math.min(tax, income - 1200000);
    } else {
      income = Math.max(0, income - standardDeduction);
      if (income <= 500000) return 0;

      if (income > 250000) tax += Math.min(income - 250000, 250000) * 0.05;
      if (income > 500000) tax += Math.min(income - 500000, 500000) * 0.20;
      if (income > 1000000) tax += (income - 1000000) * 0.30;
    }

    const cess = tax * 0.04;
    return (tax + cess).toFixed(0);
  };

  const taxAmount = calculateTax();
  const takeHome = ((Math.max(0, parseFloat(salary) || 0) - parseFloat(taxAmount)) / 12).toFixed(0);

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-white z-20 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-6 flex justify-center animate-fade-in-up">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Link href="/" className="hover:text-slate-900 transition-colors">Home</Link>
              <ChevronRight size={14} className="opacity-50" />
              <Link href="/tools" className="hover:text-slate-900 transition-colors">Tools</Link>
              <ChevronRight size={14} className="opacity-50" />
              <span className="text-slate-900">Income Tax Calculator</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Income Tax <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Calculate your income tax liability instantly and compare between Old vs New Tax Regimes for FY 2025-26.
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </section>

      {/* ── CALCULATOR SECTION ── */}
      <section className="relative -mt-8 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            
            {/* Input Controls */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Income Details</h2>
                  <p className="text-sm font-semibold text-slate-500">Enter your salary and choose a regime.</p>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Choose Tax Regime</label>
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className={`relative flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${regime === "new" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={regime === "new"} onChange={() => setRegime("new")} />
                    <span className="font-bold">New Regime (Default)</span>
                    {regime === "new" && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span></span>}
                  </label>
                  <label className={`relative flex items-center justify-center gap-2 p-4 rounded-2xl border-2 cursor-pointer transition-all ${regime === "old" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={regime === "old"} onChange={() => setRegime("old")} />
                    <span className="font-bold">Old Regime</span>
                  </label>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 flex items-start gap-2">
                  <Shield size={16} className="shrink-0 mt-0.5" />
                  <span>New regime offers 0 tax up to Rs. 12 lakhs taxable income. Old regime offers 0 tax up to Rs. 5 lakhs taxable income.</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Gross Annual Salary (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-400">₹</span>
                  </div>
                  <input 
                    type="number" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    value={salary} 
                    onChange={(e) => setSalary(e.target.value)} 
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="relative rounded-3xl bg-gradient-to-br from-indigo-900 to-slate-900 p-8 text-white shadow-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-500/30 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
                  <PieChart size={14} /> Tax Summary
                </div>
                
                <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-semibold text-slate-300">Annual Gross</span>
                    <strong className="text-lg font-black text-white">Rs. {parseInt(salary || 0).toLocaleString("en-IN")}</strong>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-semibold text-slate-300">Standard Deduction</span>
                    <strong className="text-lg font-black text-emerald-400">- Rs. {standardDeduction.toLocaleString("en-IN")}</strong>
                  </div>
                </div>
                
                <div className="mb-8">
                  <span className="block text-sm font-semibold text-slate-400 mb-2">Total Tax Payable</span>
                  <div className="text-5xl font-black tracking-tight text-white mb-2">
                    Rs. {parseInt(taxAmount).toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs font-semibold text-blue-300">
                    Includes 4% Health & Education Cess
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl shadow-lg border border-blue-500/50 relative overflow-hidden">
                  <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                  <span className="block text-xs font-black uppercase tracking-widest text-blue-100 mb-1 relative z-10">Your Take-Home Salary</span>
                  <strong className="text-2xl font-black text-white relative z-10">
                    Rs. {Number(takeHome).toLocaleString("en-IN")} <span className="text-sm font-bold opacity-80">/ month</span>
                  </strong>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <section className="mt-16 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-200">
          <h2 className="font-heading text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
            <Target className="text-orange-500" />
            Old vs New Tax Regime: Which is Better?
          </h2>
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
            <p>
              The Union Budget made the New Tax Regime the default choice for all taxpayers. However, you can still choose the Old Tax Regime if it benefits you more due to specific deductions like HRA, Section 80C (LIC, ELSS, PPF), and home loan interest.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 my-8">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="text-lg font-black text-blue-900 mb-2">New Regime is better if:</h3>
                <p className="text-sm">You have low or no investments. Taxable income up to Rs. 12 lakhs is currently eligible for rebate under this regime, and salaried taxpayers can also claim the Rs. 75,000 standard deduction.</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="text-lg font-black text-emerald-900 mb-2">Old Regime is better if:</h3>
                <p className="text-sm">You claim hefty deductions like HRA (House Rent Allowance), ₹1.5 Lakhs under 80C, and ₹2 Lakhs interest on Home Loans. Income up to ₹5 lakhs is tax-free here.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-xl border border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white mb-2">Expert CA Assistance for IT Returns</h3>
              <p className="text-sm font-semibold text-slate-300">
                Don&apos;t want to calculate taxes manually? Let our Chartered Accountants handle your ITR filing. Maximum tax savings guaranteed!
              </p>
            </div>
            <Link href="/income-tax-return-filing" className="shrink-0 flex items-center gap-2 bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-white/20 transition-all active:scale-95">
              File ITR with Experts <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
