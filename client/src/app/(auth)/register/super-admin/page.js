import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";

export const metadata = {
  title: "Super Admin Registration | Your Company Name",
  description: "Create a Your Company Name super admin account with your registration key.",
};

export default function SuperAdminRegisterPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">

          <h1>Register as Super Admin</h1>
          <p>Create a super admin account with full platform control. You will need the super admin registration key.</p>
          <AuthForm
            mode="register"
            fixedRole="SUPER_ADMIN"
            switchHref="/login"
            switchLabel="Login"
            switchText="Already have a super admin account?"
          />
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
