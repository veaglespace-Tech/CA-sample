import Link from "next/link";
import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";

export const metadata = {
  title: "Super Admin Login",
  description: "Login to the Valuexpert super admin dashboard.",
};

export default function SuperAdminLoginPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">

          <h1>Login as Super Admin</h1>
          <p>This page is reserved for super admin accounts only.</p>
          <AuthForm
            mode="login"
            expectedRole="SUPER_ADMIN"
            switchHref="/login"
            switchLabel="Admin/User Login"
            switchText="Need the regular login page instead?"
          />
          <p className="vs-auth-switch">
            Admin or user account? <Link href="/login">Go to standard login</Link>
          </p>
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
