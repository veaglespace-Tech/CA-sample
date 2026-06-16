import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";
import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "User Register | Veagle Space Technology Pvt. Ltd.",
  description: "Create a Veagle Space Technology Pvt. Ltd. user account.",
};

export default function UserRegisterPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card vs-auth-card--wide grid grid-cols-1 md:grid-cols-1 md:grid-cols-5 p-0 overflow-hidden shadow-2xl">
          
          {/* Left Section: Info/Marketing */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-indigo-50/50 p-8 md:p-4 md:p-12 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col justify-center">

            <h1 className="text-3xl font-black text-slate-900 mt-2 mb-4 leading-tight">Register as User</h1>
            <p className="text-slate-600 font-medium leading-relaxed">
              Create a standard user account and continue directly to your own secure dashboard.
            </p>
            
            <div className="mt-10 space-y-5 hidden sm:block">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-sm shrink-0 mt-0.5">
                  <Zap size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Fast & Easy Process</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Get started with your filings in minutes.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-indigo-100 text-gold rounded-sm shrink-0 mt-0.5">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Secure Vault</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Your documents are encrypted and safely stored.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-amber-100 text-amber-600 rounded-sm shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Expert Compliance</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Verified professionals handling your cases.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section: Form */}
          <div className="md:col-span-3 p-8 md:p-4 md:p-12 bg-white flex flex-col justify-center">
            <AuthForm
              mode="register"
              fixedRole="USER"
              switchHref="/login"
              switchLabel="Login"
              switchText="Already have a user account?"
            />
          </div>
          
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
