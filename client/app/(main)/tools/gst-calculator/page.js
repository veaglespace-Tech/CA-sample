"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, PieChart, Info, ArrowRight } from "lucide-react";

export default function GstCalculator() {
  const [amount, setAmount] = useState(10000);
  const [gstRate, setGstRate] = useState(18);
  const [calcType, setCalcType] = useState("add"); // 'add' or 'remove'

  const calculateGst = () => {
    let netAmount = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (calcType === "add") {
      netAmount = Math.max(0, parseFloat(amount) || 0);
      gstAmount = (netAmount * Math.max(0, gstRate)) / 100;
      totalAmount = netAmount + gstAmount;
    } else {
      totalAmount = Math.max(0, parseFloat(amount) || 0);
      gstAmount = totalAmount - (totalAmount * (100 / (100 + Math.max(0, gstRate))));
      netAmount = totalAmount - gstAmount;
    }

    return {
      netAmount: netAmount.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      totalAmount: totalAmount.toFixed(2),
      cgst: (gstAmount / 2).toFixed(2),
      sgst: (gstAmount / 2).toFixed(2),
    };
  };

  const results = calculateGst();

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
              <span className="text-slate-900">GST Calculator</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Online GST <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Calculator</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Calculate your GST amount instantly. Find out the Net Price, CGST, SGST, and Total Amount by adding or removing GST.
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
                <div className="w-12 h-12 bg-gold/10 text-gold rounded-none flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">Enter Details</h2>
                  <p className="text-sm font-semibold text-slate-500">Calculate inclusive or exclusive GST</p>
                </div>
              </div>
              
              <div className="mb-8">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Calculation Type</label>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  <label className={`relative flex items-center justify-center gap-2 p-4 rounded-none border-2 cursor-pointer transition-all ${calcType === "add" ? "border-blue-500 bg-gold/10 text-gold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={calcType === "add"} onChange={() => setCalcType("add")} />
                    <span className="font-bold">Add GST (Exclusive)</span>
                    {calcType === "add" && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-gold/100"></span></span>}
                  </label>
                  <label className={`relative flex items-center justify-center gap-2 p-4 rounded-none border-2 cursor-pointer transition-all ${calcType === "remove" ? "border-blue-500 bg-gold/10 text-gold" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    <input type="radio" className="hidden" checked={calcType === "remove"} onChange={() => setCalcType("remove")} />
                    <span className="font-bold">Remove GST (Inclusive)</span>
                    {calcType === "remove" && <span className="absolute top-2 right-2 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-gold/100"></span></span>}
                  </label>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">Amount (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <span className="text-xl font-bold text-slate-400">₹</span>
                  </div>
                  <input 
                    type="number" 
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-none outline-none transition-all text-xl font-black text-slate-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black uppercase tracking-widest text-slate-500 mb-4">GST Rate (%)</label>
                <div className="grid grid-cols-3 sm:grid-cols-1 md:grid-cols-6 gap-3">
                  {[0.25, 3, 5, 12, 18, 28].map(rate => (
                    <button 
                      key={rate}
                      className={`py-3 px-2 rounded-sm border-2 font-bold transition-all ${gstRate === rate ? "border-blue-500 bg-gold/10 text-gold shadow-md shadow-blue-500/10" : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"}`}
                      onClick={() => setGstRate(rate)}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="relative rounded-none bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-white shadow-2xl overflow-hidden h-fit">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gold/100/30 blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-6">
                  <PieChart size={14} /> Calculation Result
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm backdrop-blur-sm border border-white/10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <span className="text-sm font-semibold text-slate-300">Net Amount</span>
                    <strong className="text-lg font-black text-white">₹ {Number(results.netAmount).toLocaleString()}</strong>
                  </div>
                  
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-sm backdrop-blur-sm border border-white/10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <span className="text-sm font-semibold text-slate-300">GST Amount</span>
                    <strong className="text-lg font-black text-emerald-400">+ ₹ {Number(results.gstAmount).toLocaleString()}</strong>
                  </div>

                  <div className="bg-white/5 p-4 rounded-sm backdrop-blur-sm border border-white/10 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2 pb-2 border-b border-white/10">
                      <span>CGST ({(gstRate/2).toFixed(1)}%)</span>
                      <span>₹ {Number(results.cgst).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400">
                      <span>SGST ({(gstRate/2).toFixed(1)}%)</span>
                      <span>₹ {Number(results.sgst).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-none shadow-lg border border-blue-500/50 relative overflow-hidden mt-6">
                  <div className="absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                  <span className="block text-xs font-black uppercase tracking-widest text-blue-100 mb-1 relative z-10">Total Amount</span>
                  <strong className="text-3xl font-black text-white relative z-10">
                    ₹ {Number(results.totalAmount).toLocaleString()}
                  </strong>
                </div>

                {calcType === "remove" && (
                  <p className="text-center text-xs font-semibold text-slate-400 mt-4 opacity-80">
                    * Original Price = Total Amount - GST
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── INFO SECTION ── */}
      <section className="mt-16 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-none p-8 sm:p-4 md:p-10 shadow-sm border border-slate-200 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
            <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">What is a GST Calculator?</h2>
            <p className="mb-8">
              A GST calculator is a handy online tool that helps you calculate the total amount of Goods and Services Tax (GST) payable on a specific product or service. Whether you need to figure out the exclusive price (adding GST to the base amount) or the inclusive price (removing GST from the total amount), this tool gives you instant and accurate results.
            </p>

            <h2 className="font-heading text-2xl font-black text-slate-900 mb-4 flex items-center gap-2"><Info size={24} className="text-blue-500" /> How to Calculate GST?</h2>
            <p className="mb-4">
              The formula for calculating GST is relatively straightforward, but using our calculator saves time and prevents manual errors.
            </p>
            <div className="bg-slate-50 p-6 rounded-none border border-slate-100 mb-8">
              <ul className="space-y-3 m-0">
                <li className="flex gap-2 items-start"><span className="text-blue-500 mt-1">✓</span> <span><strong>To Add GST:</strong> GST Amount = (Original Cost x GST%) / 100</span></li>
                <li className="flex gap-2 items-start"><span className="text-emerald-500 mt-1">✓</span> <span><strong>Net Price:</strong> Original Cost + GST Amount</span></li>
                <li className="flex gap-2 items-start"><span className="text-blue-500 mt-1">✓</span> <span><strong>To Remove GST:</strong> GST Amount = Total Cost - [Total Cost x (100 / (100 + GST%))]</span></li>
                <li className="flex gap-2 items-start"><span className="text-emerald-500 mt-1">✓</span> <span><strong>Net Price:</strong> Total Cost - GST Amount</span></li>
              </ul>
            </div>

            <h2 className="font-heading text-2xl font-black text-slate-900 mb-4">What are the GST Slabs in India?</h2>
            <p className="mb-4">
              Currently, goods and services are classified under different tax slabs by the GST Council. The primary slabs are:
            </p>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <h4 className="text-lg font-black text-slate-800 mb-1">5% Slab</h4>
                <p className="text-sm text-slate-500 m-0">Essential items like sugar, spices, tea, and life-saving drugs.</p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <h4 className="text-lg font-black text-slate-800 mb-1">12% Slab</h4>
                <p className="text-sm text-slate-500 m-0">Computers, processed food, cell phones, etc.</p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <h4 className="text-lg font-black text-slate-800 mb-1">18% Slab</h4>
                <p className="text-sm text-slate-500 m-0">Most services, hair oil, toothpaste, capital goods, and industrial intermediaries.</p>
              </div>
              <div className="bg-white border border-slate-200 p-4 rounded-sm shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                <h4 className="text-lg font-black text-slate-800 mb-1">28% Slab</h4>
                <p className="text-sm text-slate-500 m-0">Luxury items, automobiles, aerated drinks, and tobacco products.</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-none border border-blue-100">
            <div>
              <h3 className="text-lg font-black text-blue-900 mb-2">Need Help with GST Registration or Filing?</h3>
              <p className="text-sm font-semibold text-slate-600">
                Our chartered accountants can help you register for GST and file your monthly/quarterly returns seamlessly.
              </p>
            </div>
            <Link href="/gst-registration" className="shrink-0 flex items-center gap-2 bg-gold text-white px-6 py-3.5 rounded-sm font-bold hover:bg-gold hover:shadow-lg hover:shadow-gold/30 transition-all active:scale-95">
              Apply for GST Registration <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

