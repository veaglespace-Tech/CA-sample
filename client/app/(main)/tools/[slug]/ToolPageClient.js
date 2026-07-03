"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

function toPositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, number) : 0;
}

function calculateNewRegimeTax(taxableIncome) {
  const taxable = toPositiveNumber(taxableIncome);
  let tax = 0;

  if (taxable > 400000) tax += Math.min(taxable - 400000, 400000) * 0.05;
  if (taxable > 800000) tax += Math.min(taxable - 800000, 400000) * 0.10;
  if (taxable > 1200000) tax += Math.min(taxable - 1200000, 400000) * 0.15;
  if (taxable > 1600000) tax += Math.min(taxable - 1600000, 400000) * 0.20;
  if (taxable > 2000000) tax += Math.min(taxable - 2000000, 400000) * 0.25;
  if (taxable > 2400000) tax += (taxable - 2400000) * 0.30;

  if (taxable <= 1200000) return 0;
  return Math.min(tax, taxable - 1200000) * 1.04;
}

const toolConfigs = {
  "gratuity-calculator": {
    title: "Gratuity Calculator",
    description: "Estimate gratuity for employees covered under the Payment of Gratuity Act.",
    fields: [
      { key: "basic", label: "Last drawn basic + DA per month", value: 50000 },
      { key: "years", label: "Completed years of service", value: 6 },
    ],
    calculate: ({ basic, years }) => {
      const serviceYears = Math.floor(toPositiveNumber(years));
      const eligibleYears = serviceYears >= 5 ? serviceYears : 0;
      const gratuity = (toPositiveNumber(basic) * 15 * eligibleYears) / 26;
      return [
        { label: "Estimated Gratuity", value: gratuity },
        { label: "Eligibility", text: eligibleYears ? "Eligible based on 5+ years service" : "Usually requires 5 completed years" },
      ];
    },
    infoContent: (
      <>
        <h2>What is Gratuity?</h2>
        <p>Gratuity is a monetary benefit given by an employer to an employee for services rendered to the company over a period of 5 or more years. It is a part of the salary and is generally paid at the time of retirement, resignation, or death.</p>
        <h2>How is Gratuity Calculated?</h2>
        <p>For employees covered under the Payment of Gratuity Act, the formula is: <strong>Gratuity = (15 * Last drawn salary * Tenure of working) / 26</strong></p>
      </>
    )
  },
  "epf-calculator": {
    title: "EPF Calculator",
    description: "Estimate provident fund corpus using monthly contribution and annual return assumptions.",
    fields: [
      { key: "salary", label: "Monthly basic salary", value: 50000 },
      { key: "employeeRate", label: "Employee contribution %", value: 12 },
      { key: "employerRate", label: "Employer contribution %", value: 12 },
      { key: "returnRate", label: "Expected annual return %", value: 8.15 },
      { key: "years", label: "Investment period in years", value: 20 },
    ],
    calculate: ({ salary, employeeRate, employerRate, returnRate, years }) => {
      const monthlyContribution = toPositiveNumber(salary) * (toPositiveNumber(employeeRate) + toPositiveNumber(employerRate)) / 100;
      const months = Math.floor(toPositiveNumber(years) * 12);
      const monthlyRate = toPositiveNumber(returnRate) / 12 / 100;
      const corpus = monthlyRate ? monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) : monthlyContribution * months;
      return [
        { label: "Monthly Contribution", value: monthlyContribution },
        { label: "Estimated EPF Corpus", value: corpus },
      ];
    },
    infoContent: (
      <>
        <h2>What is EPF?</h2>
        <p>The Employees&apos; Provident Fund (EPF) is a retirement benefit scheme for salaried employees. Both the employer and employee contribute 12% of the employee&apos;s basic salary and dearness allowance to the EPF account.</p>
        <h2>How is EPF Calculated?</h2>
        <p>The EPF corpus grows through monthly contributions and compound interest. The interest rate is declared annually by the EPFO (currently around 8.15%).</p>
      </>
    )
  },
  "tds-calculator": {
    title: "TDS Calculator",
    description: "Estimate tax deducted at source requirement using a simple annual income model.",
    fields: [
      { key: "income", label: "Annual taxable income", value: 900000 },
      { key: "deductions", label: "Deductions already considered", value: 50000 },
      { key: "tdsPaid", label: "TDS already deducted", value: 25000 },
    ],
    calculate: ({ income, deductions, tdsPaid }) => {
      const taxable = Math.max(0, toPositiveNumber(income) - toPositiveNumber(deductions));
      const totalTax = calculateNewRegimeTax(taxable);
      return [
        { label: "Estimated Tax", value: totalTax },
        { label: "Balance TDS/Tax", value: Math.max(0, totalTax - toPositiveNumber(tdsPaid)) },
      ];
    },
    infoContent: (
      <>
        <h2>What is TDS?</h2>
        <p>Tax Deducted at Source (TDS) is a system introduced by the Income Tax Department where the person making a payment is required to deduct tax at source if the payment exceeds certain threshold limits.</p>
        <h2>Why Use a TDS Calculator?</h2>
        <p>A TDS calculator helps estimate your final tax liability so you can plan your investments and avoid surprise tax dues at the end of the financial year.</p>
      </>
    )
  },
  "salary-calculator": {
    title: "Salary Calculator",
    description: "Estimate monthly in-hand salary from annual CTC and common deductions.",
    fields: [
      { key: "ctc", label: "Annual CTC", value: 1200000 },
      { key: "bonus", label: "Annual variable/bonus", value: 100000 },
      { key: "pf", label: "Monthly PF deduction", value: 3600 },
      { key: "tax", label: "Monthly tax deduction", value: 12000 },
      { key: "other", label: "Other monthly deductions", value: 1000 },
    ],
    calculate: ({ ctc, bonus, pf, tax, other }) => {
      const fixedAnnual = Math.max(0, toPositiveNumber(ctc) - toPositiveNumber(bonus));
      const grossMonthly = fixedAnnual / 12;
      const inHand = Math.max(0, grossMonthly - toPositiveNumber(pf) - toPositiveNumber(tax) - toPositiveNumber(other));
      return [
        { label: "Gross Monthly Salary", value: grossMonthly },
        { label: "Estimated In-hand Salary", value: inHand },
      ];
    },
    infoContent: (
      <>
        <h2>What is In-Hand Salary?</h2>
        <p>In-hand or take-home salary is the net amount an employee receives in their bank account after all deductions (like EPF, Professional Tax, TDS, etc.) are subtracted from the gross monthly salary.</p>
        <h2>Why is CTC different from In-Hand Salary?</h2>
        <p>Cost to Company (CTC) includes the total amount the company spends on you, including employer PF contributions, gratuity, and variable bonuses, which are not paid out in your monthly paycheck.</p>
      </>
    )
  },
  "ppf-calculator": {
    title: "PPF Calculator",
    description: "Estimate Public Provident Fund maturity value for yearly investments.",
    fields: [
      { key: "annualInvestment", label: "Yearly investment", value: 150000 },
      { key: "rate", label: "Interest rate %", value: 7.1 },
      { key: "years", label: "Investment period in years", value: 15 },
    ],
    calculate: ({ annualInvestment, rate, years }) => {
      const yearlyInvestment = toPositiveNumber(annualInvestment);
      const annualRate = toPositiveNumber(rate) / 100;
      const investmentYears = Math.floor(toPositiveNumber(years));
      let corpus = 0;
      for (let index = 0; index < investmentYears; index += 1) {
        corpus = (corpus + yearlyInvestment) * (1 + annualRate);
      }
      return [
        { label: "Total Investment", value: yearlyInvestment * investmentYears },
        { label: "Maturity Value", value: corpus },
      ];
    },
    infoContent: (
      <>
        <h2>What is PPF?</h2>
        <p>The Public Provident Fund (PPF) is a popular long-term savings and investment scheme in India backed by the Government. It offers attractive interest rates and returns that are fully exempted from Tax (EEE status).</p>
        <h2>Rules of PPF</h2>
        <p>The minimum investment is ₹500 and maximum is ₹1.5 lakh per financial year. The lock-in period is 15 years, though partial withdrawals are allowed under certain conditions after the 7th year.</p>
      </>
    )
  },
  "fd-calculator": {
    title: "FD Calculator",
    description: "Calculate fixed deposit maturity amount with quarterly compounding.",
    fields: [
      { key: "principal", label: "Deposit amount", value: 500000 },
      { key: "rate", label: "Interest rate %", value: 7 },
      { key: "years", label: "Tenure in years", value: 3 },
    ],
    calculate: ({ principal, rate, years }) => {
      const deposit = toPositiveNumber(principal);
      const maturity = deposit * Math.pow(1 + toPositiveNumber(rate) / 400, toPositiveNumber(years) * 4);
      return [
        { label: "Interest Earned", value: maturity - deposit },
        { label: "Maturity Amount", value: maturity },
      ];
    },
    infoContent: (
      <>
        <h2>What is a Fixed Deposit (FD)?</h2>
        <p>A Fixed Deposit is a financial instrument provided by banks and NBFCs which offers a guaranteed rate of return over a fixed tenure. It is one of the safest investment options available.</p>
        <h2>How is FD Interest Calculated?</h2>
        <p>Interest on FDs is typically compounded quarterly. The formula is: <strong>A = P(1 + r/n)^(n*t)</strong> where &apos;n&apos; is the number of times interest is compounded per year.</p>
      </>
    )
  },
  "home-loan-emi-calculator": {
    title: "Home Loan EMI Calculator",
    description: "Estimate monthly EMI and total interest payable on a home loan.",
    fields: [
      { key: "principal", label: "Loan amount", value: 5000000 },
      { key: "rate", label: "Interest rate % p.a.", value: 8.5 },
      { key: "years", label: "Loan tenure in years", value: 20 },
    ],
    calculate: emiResult,
  },
  "mutual-fund-returns-calculator": {
    title: "Mutual Fund Returns Calculator",
    description: "Estimate future value for a one-time mutual fund investment.",
    fields: [
      { key: "principal", label: "Investment amount", value: 200000 },
      { key: "rate", label: "Expected return % p.a.", value: 12 },
      { key: "years", label: "Investment period in years", value: 10 },
    ],
    calculate: lumpsumResult,
  },
  "lumpsum-calculator": {
    title: "Lumpsum Calculator",
    description: "Calculate future value of a one-time investment.",
    fields: [
      { key: "principal", label: "Investment amount", value: 100000 },
      { key: "rate", label: "Expected return % p.a.", value: 12 },
      { key: "years", label: "Investment period in years", value: 10 },
    ],
    calculate: lumpsumResult,
  },
  "retirement-planning-calculator": {
    title: "Retirement Planning Calculator",
    description: "Estimate retirement corpus using current expenses, inflation, and years to retirement.",
    fields: [
      { key: "monthlyExpense", label: "Current monthly expense", value: 60000 },
      { key: "currentAge", label: "Current age", value: 30 },
      { key: "retirementAge", label: "Retirement age", value: 60 },
      { key: "inflation", label: "Expected inflation %", value: 6 },
    ],
    calculate: ({ monthlyExpense, currentAge, retirementAge, inflation }) => {
      const years = Math.max(0, toPositiveNumber(retirementAge) - toPositiveNumber(currentAge));
      const futureMonthlyExpense = toPositiveNumber(monthlyExpense) * Math.pow(1 + toPositiveNumber(inflation) / 100, years);
      const corpus = futureMonthlyExpense * 12 * 25;
      return [
        { label: "Monthly Expense at Retirement", value: futureMonthlyExpense },
        { label: "Suggested Corpus", value: corpus },
      ];
    },
  },
  "nps-calculator": {
    title: "NPS Calculator",
    description: "Estimate National Pension System corpus using monthly contribution assumptions.",
    fields: [
      { key: "monthlyContribution", label: "Monthly contribution", value: 10000 },
      { key: "rate", label: "Expected return % p.a.", value: 10 },
      { key: "years", label: "Investment period in years", value: 25 },
    ],
    calculate: sipLikeResult,
  },
  "simple-compound-interest-calculator": {
    title: "Simple & Compound Interest Calculator",
    description: "Compare simple interest and compound interest on the same principal.",
    fields: [
      { key: "principal", label: "Principal amount", value: 100000 },
      { key: "rate", label: "Interest rate % p.a.", value: 8 },
      { key: "years", label: "Time in years", value: 5 },
    ],
    calculate: ({ principal, rate, years }) => {
      const investment = toPositiveNumber(principal);
      const simple = investment * toPositiveNumber(rate) * toPositiveNumber(years) / 100;
      const compoundAmount = investment * Math.pow(1 + toPositiveNumber(rate) / 100, toPositiveNumber(years));
      return [
        { label: "Simple Interest", value: simple },
        { label: "Compound Interest", value: compoundAmount - investment },
        { label: "Compound Maturity", value: compoundAmount },
      ];
    },
  },
  "rd-calculator": {
    title: "RD Calculator",
    description: "Estimate recurring deposit maturity value from monthly deposits.",
    fields: [
      { key: "monthlyContribution", label: "Monthly deposit", value: 5000 },
      { key: "rate", label: "Interest rate % p.a.", value: 7 },
      { key: "years", label: "Tenure in years", value: 5 },
    ],
    calculate: sipLikeResult,
  },
  "business-setup-calculator": {
    title: "Business Setup Calculator",
    description: "Estimate an initial professional-services budget for starting a business.",
    fields: [
      { key: "promoters", label: "Number of promoters/partners", value: 2 },
      { key: "registrations", label: "Additional registrations needed", value: 2 },
      { key: "advisoryHours", label: "Advisory hours required", value: 3 },
    ],
    calculate: ({ promoters, registrations, advisoryHours }) => {
      const estimate = 6999 + toPositiveNumber(promoters) * 1200 + toPositiveNumber(registrations) * 2500 + toPositiveNumber(advisoryHours) * 1500;
      return [
        { label: "Estimated Setup Budget", value: estimate },
        { label: "Includes", text: "Professional estimate only; government fees vary by service and state" },
      ];
    },
  },
};

function emiResult({ principal, rate, years }) {
  const loanAmount = toPositiveNumber(principal);
  const monthlyRate = toPositiveNumber(rate) / 12 / 100;
  const months = Math.floor(toPositiveNumber(years) * 12);
  const emi = months > 0
    ? monthlyRate
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / months
    : 0;
  return [
    { label: "Monthly EMI", value: emi },
    { label: "Total Interest", value: Math.max(0, emi * months - loanAmount) },
    { label: "Total Payment", value: emi * months },
  ];
}

function lumpsumResult({ principal, rate, years }) {
  const investment = toPositiveNumber(principal);
  const futureValue = investment * Math.pow(1 + toPositiveNumber(rate) / 100, toPositiveNumber(years));
  return [
    { label: "Invested Amount", value: investment },
    { label: "Estimated Returns", value: futureValue - investment },
    { label: "Future Value", value: futureValue },
  ];
}

function sipLikeResult({ monthlyContribution, rate, years }) {
  const monthlyInvestment = toPositiveNumber(monthlyContribution);
  const months = Math.floor(toPositiveNumber(years) * 12);
  const monthlyRate = toPositiveNumber(rate) / 12 / 100;
  const futureValue = monthlyRate ? monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate) : monthlyInvestment * months;
  return [
    { label: "Total Investment", value: monthlyInvestment * months },
    { label: "Estimated Returns", value: futureValue - monthlyInvestment * months },
    { label: "Future Value", value: futureValue },
  ];
}

function formatMoney(value) {
  return `Rs. ${Math.max(0, Number(value) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function BusinessNameGenerator() {
  const [keyword, setKeyword] = useState("tax");
  const names = useMemo(() => {
    const clean = keyword.trim() || "value";
    const title = clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
    return [
      `${title}Bridge`,
      `${title}Desk`,
      `${title}Pilot`,
      `Nova ${title}`,
      `${title}Stack`,
      `Blue ${title} Co`,
      `${title}Nest`,
      `Prime ${title} Works`,
    ];
  }, [keyword]);

  return (
    <div className="vs-calc-wrapper">
      <div className="vs-calc-box">
        <h2>Enter Keyword</h2>
        <div className="vs-form-group">
          <label className="vs-calc-label">Business keyword</label>
          <input className="vs-calc-input" value={keyword} onChange={(event) => setKeyword(event.target.value)} />
        </div>
      </div>
      <div className="vs-calc-result-box">
        <h2>Name Ideas</h2>
        <div className="vs-tool-name-grid">
          {names.map((name) => <span key={name}>{name}</span>)}
        </div>
      </div>
    </div>
  );
}

export default function ToolPageClient({ slug }) {
  const config = toolConfigs[slug];
  const [values, setValues] = useState(() => Object.fromEntries((config?.fields || []).map((field) => [field.key, field.value])));

  if (slug === "business-name-generator") {
    return (
      <ToolShell 
        title="Business Name Generator" 
        description="Generate quick business name ideas from a keyword."
        infoContent={
          <>
            <h2>How to Choose a Good Business Name?</h2>
            <p>A good business name should be memorable, easy to spell, and reflect your brand&apos;s identity. Use our generator to get creative ideas by simply entering a keyword related to your business.</p>
          </>
        }
      >
        <BusinessNameGenerator />
      </ToolShell>
    );
  }

  if (!config) return null;

  const results = config.calculate(values);

  return (
    <ToolShell title={config.title} description={config.description} infoContent={config.infoContent}>
      <div className="vs-calc-wrapper">
        <div className="vs-calc-box">
          <h2>Enter Details</h2>
          {config.fields.map((field) => (
            <div className="vs-form-group" key={field.key}>
              <label className="vs-calc-label">{field.label}</label>
              <input
                type="number"
                className="vs-calc-input"
                value={values[field.key]}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
              />
            </div>
          ))}
        </div>

        <div className="vs-calc-result-box">
          <h2>Result</h2>
          {results.map((result) => (
            <div className="vs-result-row" key={result.label}>
              <span>{result.label}</span>
              <strong>{result.text || formatMoney(result.value)}</strong>
            </div>
          ))}
          <p className="vs-tool-note">These results are indicative. For tax, legal, or compliance decisions, speak with an expert.</p>
        </div>
      </div>
    </ToolShell>
  );
}

function ToolShell({ title, description, infoContent, children }) {
  return (
    <>
      <section className="vs-page-hero" style={{ padding: "3rem 0 2rem" }}>
        <div className="vs-container">
          <div className="vs-breadcrumb">
            <Link href="/">Home</Link><span className="sep">&gt;</span>
            <Link href="/tools">Tools</Link><span className="sep">&gt;</span>
            <span>{title}</span>
          </div>
          <h1>{title}</h1>
          <p className="vs-hero-sub">{description}</p>
        </div>
      </section>

      <section className="vs-section" style={{ background: "var(--bg)", paddingTop: "2rem" }}>
        <div className="vs-container">{children}</div>
      </section>

      {/* Real Content Section Below Calculator */}
      <section className="vs-section">
        <div className="vs-container" style={{ maxWidth: "800px", margin: "0 auto" }}>
          <div className="vs-page-content">
            {infoContent || (
              <>
                <h2>About {title}</h2>
                <p>{description} Use our tool above to quickly estimate and plan your finances.</p>
                <h2>Need Professional Assistance?</h2>
                <p>Our expert team is always ready to help you navigate through your financial planning, taxation, and business setup needs.</p>
              </>
            )}
            
            <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-warm)", borderRadius: "8px", border: "1px solid var(--orange)" }}>
              <h3 style={{ color: "var(--navy)", marginBottom: "0.5rem" }}>Need Help with Financial Advisory?</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginBottom: "1rem" }}>
                Connect with our expert consultants for personalized financial planning and business advisory services.
              </p>
              <Link href="/talk-to-expert" className="vs-btn-cta" style={{ color: "#061f35" }}>Talk to an Expert →</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const supportedToolSlugs = Object.keys(toolConfigs).concat("business-name-generator");

