/**
 * ProblemCategoryModal Component
 *
 * A two-panel category selection modal for lawyer consultations.
 * Left panel: Lawyer categories with icons
 * Right panel: Sub-problems that update based on selected category
 *
 * Used on: Talk to Expert / Talk to Lawyer page
 */

"use client";

import { useState } from "react";
import { X, ChevronRight } from "lucide-react";

const CATEGORIES = [
  {
    id: "legal-notices",
    name: "Legal Notices",
    icon: "📜",
    problems: [
      "Drafting a Legal Notice",
      "Legal Notice for Recovery of Dues",
      "Cheque Bounce Notice",
      "Legal Notice Under Consumer Protection Act",
      "Tenant Eviction Notice",
      "Employee Termination Notice",
    ],
  },
  {
    id: "property",
    name: "Property Lawyer",
    icon: "🏠",
    problems: [
      "Property Dispute Resolution",
      "Property Title Verification",
      "Tenant Eviction",
      "Rental Agreement Drafting",
      "RERA Complaint",
      "Property Registration",
      "Land Acquisition Issues",
    ],
  },
  {
    id: "family",
    name: "Family Lawyer",
    icon: "👨‍👩‍👧",
    problems: [
      "Mutual Divorce",
      "Contested Divorce",
      "Child Custody",
      "Domestic Violence",
      "Alimony / Maintenance",
      "Marriage Registration",
      "Succession / Inheritance",
    ],
  },
  {
    id: "civil",
    name: "Civil Lawyer",
    icon: "⚖️",
    problems: [
      "Contract Dispute",
      "Money Recovery",
      "Defamation Case",
      "Injunction / Stay Order",
      "Property Rights Dispute",
      "Partnership Dispute",
    ],
  },
  {
    id: "criminal",
    name: "Criminal Lawyer",
    icon: "🔒",
    problems: [
      "Cheating / Fraud Case",
      "Cyber Crime Complaint",
      "Police Complaint / FIR",
      "Bail Application",
      "Domestic Violence Case",
      "Anticipatory Bail",
    ],
  },
  {
    id: "consumer",
    name: "Consumer Lawyer",
    icon: "🛡️",
    problems: [
      "Product Defect Complaint",
      "Service Deficiency",
      "E-commerce Complaint",
      "Insurance Claim Rejection",
      "Banking / Financial Fraud",
      "Real Estate Complaint",
    ],
  },
  {
    id: "company-law",
    name: "Company Law Matters",
    icon: "🏢",
    problems: [
      "Director / Shareholder Dispute",
      "Shareholder Agreement",
      "Company Winding Up",
      "Board Resolution Drafting",
      "Oppression & Mismanagement",
      "NCLT / NCLAT Matters",
    ],
  },
  {
    id: "tax",
    name: "Tax Lawyer",
    icon: "💰",
    problems: [
      "Income Tax Notice Reply",
      "GST Dispute / Notice",
      "Tax Assessment Issues",
      "TDS Refund Issues",
      "Tax Penalty Appeal",
      "Transfer Pricing Dispute",
    ],
  },
  {
    id: "labour",
    name: "Labour & Employment",
    icon: "👷",
    problems: [
      "Wrongful Termination",
      "Wage / Salary Dispute",
      "PF / ESI Issues",
      "POSH Compliance",
      "Employment Contract Review",
      "Workplace Harassment",
    ],
  },
  {
    id: "constitutional",
    name: "Constitutional Lawyer",
    icon: "📖",
    problems: [
      "Fundamental Rights Violation",
      "PIL (Public Interest Litigation)",
      "RTI Application",
      "Writ Petition",
      "Government Order Challenge",
    ],
  },
];

export default function ProblemCategoryModal({ onSelect, onClose }) {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  const handleSelect = (problem) => {
    onSelect(activeCat.name, problem);
    onClose();
  };

  return (
    <div className="problem-modal-overlay" onClick={onClose}>
      <div className="problem-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="problem-modal-header">
          <h2>Select your Category</h2>
          <button className="problem-modal-close" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <div className="problem-modal-body">
          {/* Left Panel — Categories */}
          <div className="problem-categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`problem-category-item ${activeCategory === cat.id ? "active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <span className="problem-category-icon">{cat.icon}</span>
                <span className="problem-category-name">{cat.name}</span>
                <ChevronRight className="problem-category-arrow" size={16} />
              </button>
            ))}
          </div>

          {/* Right Panel — Sub-problems */}
          <div className="problem-subcategories">
            <div className="problem-subcategory-header">
              <span>{activeCat.icon}</span>
              <h3>{activeCat.name}</h3>
            </div>
            <ul className="problem-subcategory-list">
              {activeCat.problems.map((problem) => (
                <li key={problem}>
                  <button
                    className="problem-subcategory-item"
                    onClick={() => handleSelect(problem)}
                  >
                    {problem}
                  </button>
                </li>
              ))}
            </ul>
            <div className="problem-custom">
              <p>Can&apos;t find your problem?</p>
              <button
                className="problem-custom-btn"
                onClick={() => handleSelect("Other / Custom Problem")}
              >
                Describe it here, and we&apos;ll sort it out!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CATEGORIES };

