import Link from "next/link";
import {
  Briefcase,
  Clipboard,
  DollarSign,
  Home,
  Percent,
  PieChart,
  Shield,
  Target,
  TrendingUp,
  ArrowRight,
  ChevronRight
} from "lucide-react";

export const metadata = {
  title: "Free Legal & Tax Tools - Veagle Space",
  description: "Use free calculators and tools: GST calculator, Income Tax, EMI, Gratuity, HRA, SIP, and more.",
};

const tools = [
  { name: "GST Calculator", desc: "Calculate GST on any amount instantly", href: "/tools/gst-calculator", icon: Percent, color: "text-blue-500", bg: "bg-gold/10" },
  { name: "Income Tax Calculator", desc: "Estimate your income tax liability for FY 2025-26", href: "/tools/income-tax-calculator", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "EMI Calculator", desc: "Calculate monthly EMI for loans", href: "/tools/emi-calculator", icon: Home, color: "text-violet-500", bg: "bg-violet-50" },
  { name: "HRA Calculator", desc: "Calculate House Rent Allowance exemption", href: "/tools/hra-calculator", icon: Home, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Gratuity Calculator", desc: "Calculate gratuity amount under Payment of Gratuity Act", href: "/tools/gratuity-calculator", icon: Target, color: "text-rose-500", bg: "bg-rose-50" },
  { name: "SIP Calculator", desc: "Calculate returns on your SIP investments", href: "/tools/sip-calculator", icon: TrendingUp, color: "text-cyan-500", bg: "bg-cyan-50" },
  { name: "EPF Calculator", desc: "Calculate your Employee Provident Fund corpus", href: "/tools/epf-calculator", icon: Shield, color: "text-gold", bg: "bg-gold/10" },
  { name: "TDS Calculator", desc: "Calculate TDS deducted on salary and other income", href: "/tools/tds-calculator", icon: Clipboard, color: "text-orange-500", bg: "bg-orange-50" },
  { name: "Salary Calculator", desc: "Calculate in-hand salary from CTC", href: "/tools/salary-calculator", icon: Briefcase, color: "text-teal-500", bg: "bg-teal-50" },
  { name: "PPF Calculator", desc: "Calculate Public Provident Fund returns", href: "/tools/ppf-calculator", icon: PieChart, color: "text-fuchsia-500", bg: "bg-fuchsia-50" },
  { name: "FD Calculator", desc: "Calculate Fixed Deposit maturity amount", href: "/tools/fd-calculator", icon: DollarSign, color: "text-sky-500", bg: "bg-sky-50" },
  { name: "Business Name Generator", desc: "Generate business name ideas for your startup", href: "/tools/business-name-generator", icon: Briefcase, color: "text-blue-500", bg: "bg-gold/10" },
];

export default function ToolsPage() {
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
              <span className="text-slate-900">Tools</span>
            </div>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Free Business & <br className="sm:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Tax Tools</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 font-medium leading-relaxed animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            Calculators and tools to help you make smarter financial, legal, and tax decisions.
          </p>
        </div>
        
        {/* Diagonal Wave Bottom Decor */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8fafc] to-transparent" />
      </section>

      {/* ── TOOLS GRID ── */}
      <section className="relative -mt-8 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, idx) => (
              <Link 
                key={tool.name} 
                href={tool.href} 
                className="group relative flex flex-col justify-between overflow-hidden rounded-none border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300 animate-fade-in-up"
                style={{ animationDelay: `${(idx + 3) * 50}ms` }}
              >
                <div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-none ${tool.bg} border border-slate-100 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                  </div>
                  <h3 className="font-heading text-lg font-extrabold text-slate-900 group-hover:text-gold transition-colors mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm font-semibold leading-relaxed text-slate-500 line-clamp-2">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold opacity-80 transition-opacity group-hover:opacity-100">
                  Open Tool <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}




