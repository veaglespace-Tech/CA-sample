import Link from "next/link";
import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";

export const metadata = {
  title: "Admin Login | Valuexpert",
  description: "Administrative login for Valuexpert staff and super admins.",
};

export default function AdminLoginPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">

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
