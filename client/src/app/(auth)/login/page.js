import AuthForm from "../../../components/auth/AuthForm";
import PublicOnlyRoute from "../../../components/auth/PublicOnlyRoute";

export const metadata = {
  title: "Login",
  description: "Login to your Valuexpert account.",
};

export default function LoginPage() {
  return (
    <PublicOnlyRoute>
      <section className="vs-auth-shell">
        <div className="vs-auth-card">

          <h1 className="mb-6 text-3xl font-bold">Login to Valuexpert</h1>

          <AuthForm mode="login" expectedRole="USER" switchHref="/register" switchLabel="Choose registration" switchText="Need a user account?" allowPasswordReset={true} />
        </div>
      </section>
    </PublicOnlyRoute>
  );
}
