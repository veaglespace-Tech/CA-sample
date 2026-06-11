"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, PieChart, TrendingUp } from "lucide-react";

export default function SipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [timePeriod, setTimePeriod] = useState(10);

  const calculateSip = () => {
    const P = Math.max(0, parseFloat(monthlyInvestment) || 0);
    const r = Math.max(0, parseFloat(expectedReturn) || 0) / 12 / 100;
    const n = Math.floor(Math.max(0, parseFloat(timePeriod) || 0) * 12);

    if (P === 0 || n === 0) return { invested: 0, estimatedReturn: 0, totalValue: 0 };
    if (r === 0) {
      const invested = P * n;
      return { invested: invested.toFixed(0), estimatedReturn: 0, totalValue: invested.toFixed(0) };
    }

    const totalValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const estimatedReturn = totalValue - invested;

    return {
      invested: invested.toFixed(0),
      estimatedReturn: estimatedReturn.toFixed(0),
      totalValue: totalValue.toFixed(0)
    };
  };

  const results = calculateSip();

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
              <span className="text-slate-900">SIP Calculator</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            SIP <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Calculate the future value of your monthly SIP investments in Mutual Funds instantly.
          </p>
        </div>
        
        {/* Diagonal Wave Bottom Decor */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </section>

      {/* ── CALCULATOR SECTION ── */}
      <section className="relative -mt-8 z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
            
            {/* Input Controls */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Investment Details</h2>
                  <p className="text-sm font-semibold text-slate-500">Plan your systematic investment</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between mb-4">
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500">Monthly Investment (₹)</label>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">₹ {Number(monthlyInvestment).toLocaleString()}</span>
                </div>
                <div className="relative mb-6">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-400">₹</span>
                  </div>
                  <input 
                    type="number" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" 
                    value={monthlyInvestment} 
                    onChange={(e) => setMonthlyInvestment(e.target.value)} 
                  />
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500" 
                  value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(e.target.value)} 
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600" 
                />
                <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
                  <span>₹500</span>
                  <span>₹1,00,000</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Expected Return (% p.a.)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      step="0.5" 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" 
                      value={expectedReturn} 
                      onChange={(e) => setExpectedReturn(e.target.value)} 
                    />
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Time Period (Years)</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" 
                      value={timePeriod} 
                      onChange={(e) => setTimePeriod(e.target.value)} 
                    />
                    <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                      <span className="text-sm font-bold text-slate-400">Yrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="relative rounded-3xl bg-gradient-to-br from-emerald-800 to-teal-900 p-8 text-white shadow-2xl overflow-hidden h-fit">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#34d399_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-teal-500/30 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300 mb-6">
                  <TrendingUp size={14} /> Wealth Summary
                </div>
                
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-5 rounded-2xl shadow-lg border border-emerald-400/30 relative overflow-hidden mb-6">
                  <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                  <span className="block text-xs font-black uppercase tracking-widest text-emerald-100 mb-1 relative z-10">Total Value</span>
                  <strong className="text-4xl font-black text-white relative z-10">
                    ₹ {parseInt(results.totalValue).toLocaleString()}
                  </strong>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-semibold text-emerald-200">Invested Amount</span>
                    <strong className="text-lg font-black text-white">₹ {parseInt(results.invested).toLocaleString()}</strong>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                    <span className="text-sm font-semibold text-emerald-200">Estimated Returns</span>
                    <strong className="text-lg font-black text-amber-300">+ ₹ {parseInt(results.estimatedReturn).toLocaleString()}</strong>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
