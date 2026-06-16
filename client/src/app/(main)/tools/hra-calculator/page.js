"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, PieChart, Home, MapPin, Building2 } from "lucide-react";

export default function HraCalculator() {
  const [basicSalary, setBasicSalary] = useState(50000);
  const [da, setDa] = useState(0);
  const [hraReceived, setHraReceived] = useState(25000);
  const [rentPaid, setRentPaid] = useState(15000);
  const [isMetro, setIsMetro] = useState(true);

  const calculateHra = () => {
    const basic = Math.max(0, parseFloat(basicSalary) || 0);
    const dearness = Math.max(0, parseFloat(da) || 0);
    const hra = Math.max(0, parseFloat(hraReceived) || 0);
    const rent = Math.max(0, parseFloat(rentPaid) || 0);

    const basicAndDa = basic + dearness;
    
    // Condition 1: Actual HRA received
    const cond1 = hra;
    
    // Condition 2: Rent paid - 10% of (Basic + DA)
    const cond2 = Math.max(0, rent - (0.1 * basicAndDa));
    
    // Condition 3: 50% for Metro, 40% for Non-Metro
    const cond3 = isMetro ? (0.5 * basicAndDa) : (0.4 * basicAndDa);

    // Exempted HRA is the minimum of the three
    const exempted = Math.min(cond1, cond2, cond3);
    const taxable = Math.max(0, hra - exempted);

    return {
      exempted: exempted.toFixed(0),
      taxable: taxable.toFixed(0)
    };
  };

  const results = calculateHra();

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20">
      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden bg-white z-20 pt-24 pb-16 lg:pt-32 lg:pb-24 border-b border-slate-200/60">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] h-[600px] w-[600px] rounded-full bg-gold/100/10 blur-[120px]" />
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
              <span className="text-slate-900">HRA Calculator</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            HRA Exemption <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-300">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Calculate your House Rent Allowance (HRA) exemption and save income tax.
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
            <div className="bg-white p-8 rounded-none shadow-sm border border-slate-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-none flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Salary Details (Monthly)</h2>
                  <p className="text-sm font-semibold text-slate-500">Provide your basic salary, DA, and rent details</p>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">City Type</label>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex items-center justify-center gap-3 p-4 rounded-none border-2 cursor-pointer transition-all ${isMetro ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={isMetro} onChange={() => setIsMetro(true)} />
                    <Building2 size={20} className={isMetro ? "text-violet-600" : "text-slate-400"} />
                    <span className="font-bold">Metro City</span>
                    {isMetro && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span></span>}
                  </label>
                  <label className={`relative flex items-center justify-center gap-3 p-4 rounded-none border-2 cursor-pointer transition-all ${!isMetro ? "border-violet-500 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={!isMetro} onChange={() => setIsMetro(false)} />
                    <MapPin size={20} className={!isMetro ? "text-violet-600" : "text-slate-400"} />
                    <span className="font-bold">Non-Metro City</span>
                    {!isMetro && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span></span>}
                  </label>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Basic Salary (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-none outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10" 
                      value={basicSalary} 
                      onChange={(e) => setBasicSalary(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Dearness Allowance (DA) (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-none outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10" 
                      value={da} 
                      onChange={(e) => setDa(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">HRA Received (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-none outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10" 
                      value={hraReceived} 
                      onChange={(e) => setHraReceived(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Actual Rent Paid (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                      <span className="text-xl font-bold text-slate-400">₹</span>
                    </div>
                    <input 
                      type="number" 
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-none outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10" 
                      value={rentPaid} 
                      onChange={(e) => setRentPaid(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Results */}
            <div className="relative rounded-none bg-gradient-to-br from-violet-700 to-purple-900 p-8 text-white shadow-2xl overflow-hidden h-fit">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#a855f7_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-fuchsia-500/30 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-300 mb-6">
                  <PieChart size={14} /> HRA Summary (Monthly)
                </div>
                
                <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 p-5 rounded-none shadow-lg border border-violet-400/30 relative overflow-hidden mb-6">
                  <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                  <span className="block text-xs font-black uppercase tracking-widest text-violet-100 mb-1 relative z-10">Exempted HRA</span>
                  <strong className="text-4xl font-black text-white relative z-10">
                    ₹ {parseInt(results.exempted).toLocaleString()}
                  </strong>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm backdrop-blur-sm border border-white/10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <span className="text-sm font-semibold text-violet-200">Total HRA Received</span>
                    <strong className="text-lg font-black text-white">₹ {parseInt(hraReceived || 0).toLocaleString()}</strong>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm backdrop-blur-sm border border-white/10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <span className="text-sm font-semibold text-violet-200">Taxable HRA</span>
                    <strong className="text-lg font-black text-amber-300">₹ {parseInt(results.taxable).toLocaleString()}</strong>
                  </div>
                </div>
                
                <p className="text-center text-xs font-semibold text-violet-200 mt-6 opacity-80 bg-black/20 p-3 rounded-sm backdrop-blur-sm">
                  * Exempted HRA is completely tax-free. Taxable HRA is added to your taxable income.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
