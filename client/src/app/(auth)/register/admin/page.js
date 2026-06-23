import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";
import BrandLogo from "../../../../components/layout/BrandLogo";

export const metadata = {
  title: "Admin Registration | Veagle Space Technology Pvt. Ltd.",
  description: "Create a Veagle Space Technology Pvt. Ltd. admin account with your registration key.",
};

export default function AdminRegisterPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">
          <BrandLogo href="/" className="mb-5 justify-center" height={42} />
          <h1>Register as Admin</h1>
          <p>Create an administrative account. You will need the admin registration key provided by your organization.</p>
          <AuthForm
            mode="register"
            fixedRole="ADMIN"
            switchHref="/login"
            switchLabel="Login"
            switchText="Already have an admin account?"
          />
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
