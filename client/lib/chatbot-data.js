export const chatbotAnswers = {
  // 1. Business Registration
  "company-registration": {
    text: "We offer comprehensive business registration services. Which structure are you looking to register?",
    links: [
      { label: "Private Limited Company", href: "/private-limited-company" },
      { label: "Limited Liability Partnership (LLP)", href: "/llp-registration" },
      { label: "One Person Company (OPC)", href: "/one-person-company" },
      { label: "Sole Proprietorship", href: "/sole-proprietorship" },
      { label: "Partnership Firm", href: "/partnership-firm" },
    ],
  },
  "ngo-registration": {
    text: "For non-profits, you can register as a Section 8 Company (NGO), Trust, or Society. Here are the relevant forms:",
    links: [
      { label: "NGO Registration", href: "/ngo-registration" },
      { label: "Section 8 Company (NGO)", href: "/section-8-company" },
      { label: "12A & 80G Registration", href: "/ngo-registration" },
    ],
  },
  
  // 2. Taxation & Compliance
  "gst-services": {
    text: "Looking for GST services? You can apply for a new registration or file your mandatory GST returns directly through our portal.",
    links: [
      { label: "New GST Registration", href: "/gst-registration" },
      { label: "GST Return Filing", href: "/gst-return-filing" },
      { label: "GST Calculator Tool", href: "/tools/gst-calculator" },
    ],
  },
  "income-tax": {
    text: "We handle all types of Income Tax filings for individuals and businesses.",
    links: [
      { label: "File Income Tax Return", href: "/income-tax-return-filing" },
      { label: "TDS / TCS Returns", href: "/accounting-bookkeeping" },
      { label: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
    ],
  },
  "accounting": {
    text: "Need help with bookkeeping and annual compliance? We provide complete accounting solutions for your business.",
    links: [
      { label: "Accounting & Bookkeeping", href: "/accounting-bookkeeping" },
      { label: "Mandatory Annual Filings", href: "/annual-compliance" },
    ],
  },

  // 3. Licenses & Certifications
  "fssai-license": {
    text: "If you operate a food business, FSSAI registration is mandatory. Select the license type based on your business scale:",
    links: [
      { label: "FSSAI Basic Registration", href: "/fssai-basic-registration" },
      { label: "FSSAI State Level License", href: "/fssai-state-level-license" },
      { label: "FSSAI Central License", href: "/fssai-central-license" },
    ],
  },
  "other-licenses": {
    text: "We assist with a variety of essential business licenses and certificates.",
    links: [
      { label: "Import/Export Code (IEC)", href: "/import-export-code" },
      { label: "MSME / Udyam Registration", href: "/msme-registration" },
      { label: "ISO Certification", href: "/iso-certification" },
      { label: "Digital Signature (DSC)", href: "/digital-signature-certificate" },
    ],
  },

  // 4. Intellectual Property
  "ip-trademark": {
    text: "Protect your brand and ideas with our Intellectual Property services.",
    links: [
      { label: "Trademark Registration", href: "/trademark-registration" },
      { label: "Trademark Search", href: "/trademark-search" },
      { label: "Copyright Registration", href: "/copyright-registration" },
      { label: "Talk to IP Lawyer", href: "/trademark-lawyer" },
    ],
  },

  // 5. Labor & HR
  "labor-hr": {
    text: "Ensure compliance with labor laws, EPF, and ESI for your employees.",
    links: [
      { label: "PF Registration", href: "/provident-fund-registration-pf" },
      { label: "ESI Registration", href: "/esi-registration" },
      { label: "Labor Law Advisor", href: "/labor-law-advisor" },
    ],
  },

  // 6. Tools & Calculators
  "calculators": {
    text: "We offer several free financial and tax calculators. Which one do you need?",
    links: [
      { label: "Income Tax Calculator", href: "/tools/income-tax-calculator" },
      { label: "EMI Calculator", href: "/tools/emi-calculator" },
      { label: "Salary & HRA Calculator", href: "/tools/salary-calculator" },
      { label: "View All Tools", href: "/tools" },
    ],
  },

  // 7. General Account & Support
  "dashboard-help": {
    text: "After logging in, your dashboard allows you to track active applications, upload documents, make payments, and chat with your assigned expert.",
    links: [
      { label: "Client Login", href: "/login" },
      { label: "Create Account", href: "/register/user" },
    ],
  },
  "documents": {
    text: "Document requirements vary by service. For most registrations, keep your PAN, Aadhaar, photo, and address proof handy. You can upload these securely in your Dashboard.",
    links: [
      { label: "Go to Dashboard", href: "/login" },
    ],
  },
  "referrals": {
    text: "Love our service? Share your referral link from the dashboard! You get rewards when someone signs up using your link.",
    links: [
      { label: "Refer & Earn Program", href: "/refer-and-earn" },
    ],
  },
  "support": {
    text: "Our experts are ready to assist you. You can request a callback, talk to a lawyer, or reach us directly via WhatsApp.",
    links: [
      { label: "Talk to an Expert", href: "/talk-to-expert" },
      { label: "Talk to a Lawyer", href: "/talk-to-a-lawyer" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
};

export const keywordRules = [
  // 1. Company Registration
  { id: "company-registration", words: ["company", "private limited", "llp", "opc", "incorporation", "startup", "proprietorship", "partnership", "register business", "start business"] },
  { id: "ngo-registration", words: ["ngo", "section 8", "trust", "society", "non profit", "non-profit", "charity"] },
  
  // 2. Tax & Compliance
  { id: "gst-services", words: ["gst", "goods and services tax", "gstr", "gst return", "gst registration", "tax filing"] },
  { id: "income-tax", words: ["itr", "income tax", "tax return", "tds", "tcs", "efiling", "e-filing"] },
  { id: "accounting", words: ["accounting", "bookkeeping", "book keeping", "annual filing", "compliance", "audit"] },

  // 3. Licenses
  { id: "fssai-license", words: ["fssai", "food license", "food safety", "food registration"] },
  { id: "other-licenses", words: ["msme", "udyam", "iec", "import", "export", "iso", "certificate", "dsc", "digital signature"] },

  // 4. IP
  { id: "ip-trademark", words: ["trademark", "trade mark", "copyright", "patent", "intellectual property", "brand protection", "logo registration"] },

  // 5. Labor
  { id: "labor-hr", words: ["pf", "provident fund", "epf", "esi", "labor", "labour", "hr compliance", "payroll"] },

  // 6. Tools
  { id: "calculators", words: ["calculator", "calculate", "tool", "emi", "sip", "hra", "salary"] },

  // 7. Support & Account
  { id: "documents", words: ["document", "upload", "pan", "aadhaar", "proof", "file", "attachment"] },
  { id: "referrals", words: ["referral", "refer", "reward", "coupon", "offer", "discount", "earn"] },
  { id: "dashboard-help", words: ["dashboard", "login", "register", "status", "track", "profile", "account"] },
  { id: "support", words: ["support", "help", "contact", "call", "whatsapp", "email", "expert", "lawyer", "ca", "consultant"] },
];

export function findAnswerId(input) {
  const text = input.toLowerCase();
  
  // Advanced keyword matching: prioritize rules with multiple word matches
  let bestMatch = { id: "support", score: 0 };

  for (const rule of keywordRules) {
    let score = 0;
    for (const word of rule.words) {
      if (text.includes(word)) {
        // Longer words or specific phrases get higher scores
        score += word.length; 
      }
    }
    if (score > bestMatch.score) {
      bestMatch = { id: rule.id, score };
    }
  }

  // If no specific match, try a fallback fuzzy check or return support
  return bestMatch.score > 0 ? bestMatch.id : "support";
}

export const quickSuggestions = [
  { id: "company-registration", label: "Start Business" },
  { id: "gst-services", label: "GST Services" },
  { id: "income-tax", label: "Income Tax" },
  { id: "ip-trademark", label: "Trademarks" },
  { id: "calculators", label: "Calculators" },
  { id: "support", label: "Talk to Expert" },
];
