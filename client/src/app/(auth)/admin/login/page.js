import Link from "next/link";
import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";
import BrandLogo from "../../../../components/layout/BrandLogo";

export const metadata = {
  title: "Admin Login | Veagle Space Technology Pvt. Ltd.",
  description: "Administrative login for Veagle Space Technology Pvt. Ltd. staff and super admins.",
};

export default function AdminLoginPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">
          <BrandLogo href="/" className="mb-5 justify-center" height={42} />
          <h1 className="mb-6">Admin Login</h1>

          <AuthForm
            mode="login"
            expectedRole={["ADMIN", "SUPER_ADMIN"]}
            allowPasswordReset={true}
            hideRegisterLink={true}
          />
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
