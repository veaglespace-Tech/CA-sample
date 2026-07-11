"use client";
import { useState } from "react";
import Link from "next/link";
import { getYoutubeEmbedUrl } from "../../lib/utils";
import { ArrowRight, Play, FileText } from "lucide-react";

export default function ArticleCard({ article, apiUrl }) {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = (e) => {
    e.preventDefault();
    setExpanded(!expanded);
  };

  const imageUrl = article.imageUrl 
    ? (article.imageUrl.startsWith("/") ? `${apiUrl}${article.imageUrl}` : article.imageUrl) 
    : "https://via.placeholder.com/600x400?text=Article";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-none border border-slate-200 bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-gold/30 h-full">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center p-2">
        <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
        <img 
          src={imageUrl} 
          alt={article.title} 
          crossOrigin="anonymous"
          className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105" 
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-black uppercase tracking-widest text-gold shadow-sm">
            {article.category || "Resource"}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-xl font-bold leading-tight text-slate-900 group-hover:text-gold transition-colors">
          {article.title}
        </h3>
        
        <div className="mt-4 relative h-36 w-full text-sm font-medium leading-relaxed text-slate-600">
          {expanded ? (
            <div className="absolute inset-0 flex flex-col animate-fade-in-up">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }} 
                className="prose prose-sm prose-slate max-w-none flex-1 overflow-y-auto overflow-x-hidden pr-2 pb-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400 [&::-webkit-scrollbar-track]:bg-transparent" 
              />
              <button 
                onClick={toggleExpand} 
                className="mt-1 font-bold text-orange-500 hover:text-orange-600 transition-colors self-start shrink-0 bg-white"
              >
                See Less ↑
              </button>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col animate-fade-in-up">
              <p className="flex-1 overflow-hidden text-ellipsis">
                {article.excerpt || (article.content.replace(/<[^>]*>/g, '').substring(0, 120))}...
              </p>
              <button 
                onClick={toggleExpand} 
                className="mt-1 font-bold text-gold hover:text-gold transition-colors self-start shrink-0 bg-white"
              >
                See More →
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 shrink-0">
          <Link 
            href={`/resources/${article.slug}`} 
            className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-gold transition-colors"
          >
            <FileText size={16} />
            Full Article
          </Link>

          {article.videoUrl && (
            <a 
              href={article.videoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-100"
            >
              <Play size={14} className="fill-current" />
              Watch Video
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
