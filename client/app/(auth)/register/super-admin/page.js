import AuthForm from "../../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../../components/auth/PublicOnlyRoute";
import BrandLogo from "../../../../components/layout/BrandLogo";

export const metadata = {
  title: "Super Admin Registration | Veagle Space Technology Pvt. Ltd.",
  description: "Create a Veagle Space Technology Pvt. Ltd. super admin account with your registration key.",
};

export default function SuperAdminRegisterPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">
          <BrandLogo href="/" className="mb-5 justify-center" height={42} />
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
