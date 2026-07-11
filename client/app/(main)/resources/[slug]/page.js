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

  const cleanContent = (html) => {
    if (!html) return "";
    // Fix glued numbered and bullet lists by injecting <br/><br/>
    // Match end of sentence ([.!?]), followed by space(s), followed by number+dot or hyphen
    return html.replace(/([.!?])\s+(?=\d+\.\s+|-\s+)/g, "$1<br/><br/>");
  };

  return (
    <>
      <style jsx global>{`
        .vs-article-content pre {
          background: #1e1e1e !important;
          border-radius: 0.75rem !important;
          padding: 3rem 1.5rem 1.5rem !important;
          position: relative !important;
          overflow-x: auto !important;
          color: #d4d4d4 !important;
          margin: 2rem 0 !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
        }
        .vs-article-content pre::before {
          content: '';
          position: absolute;
          top: 1rem;
          left: 1rem;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          background: #ff5f56;
          box-shadow: 1.25rem 0 0 #ffbd2e, 2.5rem 0 0 #27c93f;
        }
        .vs-article-content pre code {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
          font-size: 0.95rem !important;
          background: transparent !important;
          padding: 0 !important;
          color: inherit !important;
        }
        .vs-article-content :not(pre) > code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-size: 0.9em;
          font-family: monospace;
        }
        .vs-article-content img {
          max-height: 500px;
          width: 100%;
          object-fit: contain;
          background-color: #f8fafc;
          padding: 1rem;
          border-radius: 1rem;
          margin: 2rem 0;
        }
      `}</style>

      {/* Dark Glass Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1128] to-[#111B3D] pt-32 pb-40 px-6 sm:px-12 text-white">
        {/* Abstract Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/20 rounded-full mix-blend-overlay filter blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full mix-blend-overlay filter blur-[120px] opacity-50"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-8 opacity-90">
            <Link href="/" className="hover:text-[#D4AF37] transition-colors">Home</Link>
            <span>›</span>
            <Link href="/resources" className="hover:text-[#D4AF37] transition-colors">Resources</Link>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8 drop-shadow-lg">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold shadow-glass">
              <span className="text-slate-300">Category:</span>
              <span className="text-[#D4AF37] uppercase tracking-wider">{article.category || 'Resource'}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-semibold shadow-glass">
              <span className="text-slate-300">Published:</span>
              <span className="text-white">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overlapping Reading Card */}
      <section className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 -mt-24 mb-24">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 md:p-16 border border-slate-100">
          
          {article.imageUrl && (
            <div className="bg-slate-50 rounded-2xl p-4 shadow-sm mb-12 flex justify-center items-center">
              <img 
                src={article.imageUrl.startsWith("/") ? `${API_URL}${article.imageUrl}` : article.imageUrl} 
                alt={article.title} 
                crossOrigin="anonymous"
                className="w-full max-h-[500px] object-contain rounded-xl"
              />
            </div>
          )}

          {article.videoUrl && (
             <div className="space-y-4 mb-12">
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
            className="vs-article-content prose prose-lg prose-slate max-w-none text-slate-700"
            style={{ fontSize: "1.1rem", lineHeight: 1.8 }}
            dangerouslySetInnerHTML={{ __html: cleanContent(article.content) }}
          ></div>

          {/* Premium CTA */}
          <div className="mt-16 p-10 md:p-14 rounded-3xl bg-gradient-to-br from-[#0A1128] to-[#111B3D] text-white text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-[80px] pointer-events-none"></div>
            
            <h3 className="text-3xl font-bold mb-4 drop-shadow-sm">Ready to take the next step?</h3>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              Our experts are here to help you with your business needs. Get in touch with us today.
            </p>
            <Link 
              href="/talk-to-expert" 
              className="inline-block px-8 py-4 bg-[#D4AF37] hover:bg-[#AA8B2C] text-[#0A1128] font-bold rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-glow shadow-md"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
