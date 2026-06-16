"use client";

import { Briefcase, TrendingUp } from "lucide-react";

export default function DynamicFormDetails({ currentItem, parsedMetadata }) {
  if (!currentItem.businessName && !currentItem.natureOfBusiness && !currentItem.address && 
      !currentItem.state && !currentItem.pinCode && !currentItem.message && 
      !currentItem.preferredTime && !parsedMetadata) {
    return null;
  }

  return (
    <section className="space-y-6 rounded-[2rem] border border-slate-800 bg-navy p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] md:p-8">
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-none bg-gold/10 text-gold">
          <Briefcase size={18} />
        </span>
        <div>
          <h4 className="text-lg font-black tracking-tight text-white">
            Submitted Service Form Details
          </h4>
          <p className="text-xs font-semibold text-slate-400">Captured inputs from the client submission form.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2">
        {currentItem.businessName && (
          <div className="col-span-1 space-y-1 rounded-[1.6rem] border border-slate-700 bg-gradient-to-br from-slate-50 to-white p-4 sm:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Business / Proposed Company Name</span>
            <p className="text-base font-black text-white">{currentItem.businessName}</p>
          </div>
        )}

        {currentItem.state && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">State</span>
            <p className="text-sm font-bold text-white">{currentItem.state}</p>
          </div>
        )}

        {currentItem.address && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Address</span>
            <p className="text-sm font-bold text-white">{currentItem.address}</p>
          </div>
        )}

        {currentItem.pinCode && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">PIN Code</span>
            <p className="text-sm font-bold text-white">{currentItem.pinCode}</p>
          </div>
        )}

        {currentItem.natureOfBusiness && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Nature of Business</span>
            <p className="text-sm font-bold text-white">{currentItem.natureOfBusiness}</p>
          </div>
        )}

        {currentItem.preferredTime && (
          <div className="space-y-1 rounded-[1.35rem] border border-slate-700 bg-navy-light p-4 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Preferred Call-back Time</span>
            <p className="text-sm font-bold text-white">{currentItem.preferredTime}</p>
          </div>
        )}
      </div>

      {currentItem.message && (
        <div className="space-y-3 rounded-[1.6rem] border border-gold/20 bg-gradient-to-br from-indigo-50/70 to-white p-5">
          <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-gold">Client Requirements / Message</span>
          <p className="whitespace-pre-wrap text-sm font-medium leading-7 text-slate-200">
            {currentItem.message}
          </p>
        </div>
      )}

      {parsedMetadata && Object.keys(parsedMetadata).length > 0 && (
        (() => {
          // Filter out keys that duplicate direct fields or are empty/falsy
          const filteredEntries = Object.entries(parsedMetadata).filter(([key, value]) => {
            if (["state", "pinCode", "address", "natureOfBusiness"].includes(key) && currentItem[key]) return false;
            if (value === null || value === undefined || value === "") return false;
            return true;
          });
          if (filteredEntries.length === 0) return null;
          return (
            <div className="space-y-4 rounded-[1.6rem] border border-slate-700 bg-navy-light/80 p-5 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
              <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-gold">Custom Form Metadata</span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-1 md:grid-cols-2">
                {filteredEntries.map(([key, value]) => {
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, str => str.toUpperCase());

                  // Special render for whatsapp opt-in as a badge
                  if (key === "whatsappOptIn") {
                    const isOptedIn = value === true || value === "true";
                    return (
                      <div key={key} className="space-y-1 rounded-[1rem] border border-slate-700 bg-navy p-4 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                        <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">WhatsApp Opt-In</span>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black ${
                          isOptedIn
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-navy-light text-slate-400 border border-slate-700"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${isOptedIn ? "bg-green-500" : "bg-slate-400"}`} />
                          {isOptedIn ? "Opted In ✓" : "Not opted in"}
                        </span>
                      </div>
                    );
                  }

                  const isArray = Array.isArray(value);
                  const isStringifiedArray = typeof value === "string" && value.startsWith("[") && value.endsWith("]");
                  
                  let parsedArray = null;
                  if (isArray) {
                    parsedArray = value;
                  } else if (isStringifiedArray) {
                    try {
                      const maybeArray = JSON.parse(value);
                      if (Array.isArray(maybeArray)) parsedArray = maybeArray;
                    } catch (e) {
                      // not a JSON array
                    }
                  }

                  return (
                    <div key={key} className="space-y-1 rounded-[1rem] border border-slate-700 bg-navy p-4 shadow-sm transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
                      <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-slate-400">{formattedKey}</span>
                      {parsedArray ? (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {parsedArray.map((tag, idx) => (
                            <span key={idx} className="inline-flex items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-[10px] font-bold text-gold border border-gold/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="break-words text-xs font-bold text-white">
                          {typeof value === "object" ? JSON.stringify(value) : String(value)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()
      )}

      {(currentItem.sourcePageSlug || currentItem.pagePath || currentItem.utmSource || currentItem.utmMedium || currentItem.utmCampaign) && (
        <div className="space-y-4 rounded-[1.6rem] border border-slate-700 bg-navy-light p-5 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3),0_0_20px_rgba(210,144,82,0.1)] hover:border-gold/50">
          <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.18em] text-slate-400">
            <TrendingUp className="text-slate-400" /> Lead Acquisition & UTM Tracking
          </span>
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-1 md:grid-cols-3">
            {(currentItem.sourcePageSlug || currentItem.pagePath) && (
              <div className="space-y-0.5">
                <span className="text-[10px] opacity-50 block">Source Path:</span>
                <p className="font-bold text-slate-200 truncate" title={currentItem.sourcePageSlug || currentItem.pagePath}>
                  {currentItem.sourcePageSlug || currentItem.pagePath}
                </p>
              </div>
            )}
            {currentItem.utmSource && (
              <div className="space-y-0.5">
                <span className="text-[10px] opacity-50 block">UTM Source:</span>
                <p className="font-bold text-slate-200">{currentItem.utmSource}</p>
              </div>
            )}
            {currentItem.utmMedium && (
              <div className="space-y-0.5">
                <span className="text-[10px] opacity-50 block">UTM Medium:</span>
                <p className="font-bold text-slate-200">{currentItem.utmMedium}</p>
              </div>
            )}
            {currentItem.utmCampaign && (
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] opacity-50 block">UTM Campaign:</span>
                <p className="font-bold text-slate-200 truncate" title={currentItem.utmCampaign}>
                  {currentItem.utmCampaign}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
