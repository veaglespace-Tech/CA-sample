"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getYoutubeEmbedUrl } from "../../../../lib/utils";
const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, "");

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/api/articles/${slug}`);
        const json = await res.json();
        if (json.ok) setArticle(json.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchArticle();
  }, [slug]);

  if (loading) return <div className="vs-loading-box" style={{ padding: "10rem" }}>Loading article content...</div>;
  if (!article) return <div className="vs-loading-box" style={{ padding: "10rem" }}>Article not found.</div>;

  const embedUrl = getYoutubeEmbedUrl(article.videoUrl);

  return (
    <>
      <section className="vs-page-hero">
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link>
            <span className="sep">›</span>
            <Link href="/resources">Resources</Link>
            <span className="sep">›</span>
            <span>{article.title}</span>
          </div>
          <h1>{article.title}</h1>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", color: "var(--text-light)" }}>
            <span>Category: <strong>{article.category}</strong></span>
            <span>Published: <strong>{new Date(article.createdAt).toLocaleDateString()}</strong></span>
          </div>
        </div>
      </section>

      <section className="vs-section">
        <div className="vs-container" style={{ maxWidth: "900px" }}>
          {article.imageUrl && (
            <img 
              src={article.imageUrl.startsWith("/") ? `${API_URL}${article.imageUrl}` : article.imageUrl} 
              alt={article.title} 
              crossOrigin="anonymous"
              style={{ width: "100%", borderRadius: "20px", marginBottom: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }} 
            />
          )}

          {article.videoUrl && (
             <div className="space-y-4 mb-8">
                <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "20px", background: "#000", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
                   <iframe 
                     src={embedUrl} 
                     style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                     frameBorder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen
                   ></iframe>
                </div>
                <div className="flex justify-center">
                  <a 
                    href={article.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-error text-white rounded-sm gap-2 shadow-lg"
                  >
                    <span>▶</span> Watch Video on YouTube
                  </a>
                </div>
             </div>
          )}

          <div 
            className="vs-article-content"
            style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#334155" }}
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>

          <div style={{ marginTop: "4rem", padding: "2rem", background: "#f8fafc", borderRadius: "20px", textAlign: "center" }}>
            <h3>Ready to take the next step?</h3>
            <p>Our experts are here to help you with your business needs.</p>
            <Link href="/talk-to-expert" className="vs-auth-btn" style={{ display: "inline-block", marginTop: "1rem" }}>
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
