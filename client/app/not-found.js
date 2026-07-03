import Link from "next/link";

export default function NotFound() {
  return (
    <section className="vs-section" style={{ textAlign: "center", padding: "5rem 1rem" }}>
      <div className="vs-container">
        <h1 style={{ fontSize: "4rem", color: "var(--vs-orange)", marginBottom: "1rem" }}>404</h1>
        <h2 className="vs-section-title">Page Not Found</h2>
        <p className="vs-section-sub" style={{ margin: "1rem auto 2rem", maxWidth: "500px" }}>
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="vs-btn-cta">Go to Homepage</Link>
      </div>
    </section>
  );
}
