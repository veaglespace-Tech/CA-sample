"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  ChevronRight,
  Headphones,
  HelpCircle,
  MessageCircle,
  Minimize2,
  Send,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { siteMeta } from "../../lib/navigation-data";
import { chatbotAnswers, findAnswerId, quickSuggestions } from "../../lib/chatbot-data";

const starterMessages = [
  {
    id: "welcome",
    from: "bot",
    text: "Hi! I am the Veagle Space Technology AI Assistant. I can help you find forms for Company Registration, GST, ITR, Trademarks, and much more. How can I help you today?",
  },
];

const generateId = (prefix) => `${prefix}-${Date.now()}`;
const getRandomDelay = () => 600 + Math.random() * 400;

function buildBotMessage(answerId) {
  const answer = chatbotAnswers[answerId] || chatbotAnswers.support;
  return {
    id: generateId(`bot-${answerId}`),
    from: "bot",
    text: answer.text,
    links: answer.links,
  };
}

export default function ClientChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const messagesEndRef = useRef(null);

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  const whatsappNumber = siteMeta.whatsapp?.replace(/\D/g, "") || "910000000000";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Veagle Space Technology, I need help using the website.")}`;

  // Auto-scroll to bottom
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isTyping]);

  useEffect(() => {
    if (isDashboard) return;

    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const documentHeight = document.documentElement.scrollHeight;
      if (documentHeight - scrollPosition < 100) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDashboard]);

  if (isDashboard) return null;

  function handleBotResponse(answerId) {
    setIsTyping(true);
    // Simulate network/typing delay for a natural advanced feel
    setTimeout(() => {
      setMessages((prev) => [...prev, buildBotMessage(answerId)]);
      setIsTyping(false);
    }, getRandomDelay());
  }

  function askAction(actionId) {
    const action = quickSuggestions.find((item) => item.id === actionId) || { label: actionId };
    setMessages((prev) => [
      ...prev,
      {
        id: generateId(`user-${actionId}`),
        from: "user",
        text: action.label,
      },
    ]);
    handleBotResponse(actionId);
  }

  function submitMessage(event) {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: generateId("user-free"), from: "user", text: trimmed },
    ]);
    
    const answerId = findAnswerId(trimmed);
    handleBotResponse(answerId);
  }

  return (
    <div className={`fixed bottom-8 right-6 z-[1000] flex flex-col items-end transition-all duration-500 ${isAtBottom && !open ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}`}>
      {/* Chat Window */}
      {open && (
        <section
          className="mb-4 mr-4 sm:mr-8 flex h-[min(600px,calc(100vh-8rem))] w-[calc(100vw-2rem)] max-w-[380px] flex-col overflow-hidden rounded-[2rem] border border-gold/20 bg-white/95 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(79,70,229,0.2)] animate-in slide-in-from-bottom-8 fade-in duration-500"
          aria-label="Veagle Space Technology AI Assistant"
        >
          {/* Header */}
          <div className="relative flex items-center justify-between gap-3 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 px-5 py-4 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_0%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="relative z-10 flex min-w-0 items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-none bg-white/15 ring-1 ring-white/30 backdrop-blur-md shadow-inner">
                <Sparkles size={18} className="text-blue-100" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-indigo-700 bg-green-400"></div>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-black tracking-tight flex items-center gap-1.5">
                  Veagle Space Technology AI <Zap size={12} className="text-amber-300 fill-amber-300" />
                </h2>
                <p className="truncate text-[11px] font-semibold text-indigo-200">Instant help & form finder</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/25 hover:rotate-90"
              aria-label="Close chatbot"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white px-5 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.from === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2`}>
                {message.from === "bot" && (
                  <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-gold mt-1">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-none px-4 py-3 text-[13px] leading-relaxed shadow-sm ${
                    message.from === "user"
                      ? "rounded-tr-sm bg-gradient-to-br from-indigo-600 to-blue-600 text-white font-medium shadow-indigo-600/20"
                      : "rounded-tl-sm border border-slate-100 bg-white text-slate-700"
                  }`}
                >
                  <p className="font-medium whitespace-pre-wrap">{message.text}</p>
                  
                  {message.links?.length > 0 && (
                    <div className="mt-3 flex flex-col gap-2 border-t border-slate-100/50 pt-3">
                      {message.links.map((link) => (
                         <Link
                          key={link.href}
                          href={link.href}
                          className="group inline-flex items-center justify-between gap-2 rounded-sm border border-indigo-50 bg-gold/10/50 px-3 py-2.5 text-[11px] font-black text-gold transition-all hover:border-gold/30 hover:bg-indigo-100 hover:shadow-sm"
                          onClick={() => setOpen(false)}
                        >
                          <span className="truncate">{link.label}</span>
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-gold shadow-sm transition-transform group-hover:translate-x-0.5">
                            <ChevronRight size={12} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in">
                <div className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-gold mt-1">
                  <Bot size={14} />
                </div>
                <div className="rounded-none rounded-tl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm flex items-center gap-1.5 h-[42px] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-100 bg-white/80 backdrop-blur-md p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            {/* Quick Suggestions */}
            {!isTyping && (
              <div className="mb-3 flex flex-wrap gap-1.5">
                {quickSuggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => askAction(item.id)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white px-3 py-1.5 text-[11px] font-bold text-gold shadow-sm transition-all hover:border-indigo-300 hover:bg-gold/10 hover:shadow-md"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={submitMessage} className="relative flex items-center transition-all duration-400 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:border-gold/30">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask me anything..."
                className="w-full rounded-none border border-slate-200 bg-slate-50 py-3.5 pl-4 pr-12 text-[13px] font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="absolute right-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-gold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-gold hover:scale-105 disabled:opacity-50 disabled:pointer-events-none"
                aria-label="Send message"
              >
                <Send size={15} className="ml-0.5" />
              </button>
            </form>

            <div className="mt-4 flex items-center justify-between px-1">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
                  <Headphones size={10} />
                </span>
                Live Expert
              </a>
              <button
                type="button"
                onClick={() => setMessages(starterMessages)}
                className="text-[10px] font-black uppercase tracking-wider text-slate-400 transition hover:text-slate-700"
              >
                Clear Chat
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Modern Floating Action Button */}
      <div className="relative group mt-4">
        {/* Animated Glow Ring */}
        {!open && (
          <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-40 blur-lg transition duration-1000 group-hover:opacity-80 animate-pulse"></div>
        )}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className={`relative z-10 flex items-center justify-center rounded-full text-white shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 backdrop-blur-md ${
            open 
              ? "bg-slate-900 shadow-slate-900/50 h-14 w-14 rotate-180" 
              : "bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-600 h-14 w-14 hover:w-[130px] justify-start p-2 hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]"
          }`}
          aria-label={open ? "Close AI Assistant" : "Open AI Assistant"}
        >
          <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 shadow-inner transition-transform duration-500 group-hover:scale-110">
            {open ? (
               <X size={22} className="text-white transition-transform duration-500" />
            ) : (
               <Bot size={22} className="text-white transition-transform duration-500 group-hover:-rotate-12" />
            )}
          </div>
          {!open && (
             <span className="overflow-hidden whitespace-nowrap text-[14px] font-bold tracking-wide opacity-0 max-w-0 transition-all duration-500 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-2">
               Ask AI
             </span>
          )}
        </button>
      </div>
    </div>
  );
}
