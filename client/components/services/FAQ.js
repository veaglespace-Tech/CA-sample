export default function FAQ({ faqs }) {
  if (!faqs || faqs.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="collapse collapse-plus bg-navy text-white border border-white/10 rounded-none">
          <input type="checkbox" /> 
          <div className="collapse-title text-lg font-bold pr-12 text-white">
            {faq.q}
          </div>
          <div className="collapse-content text-white/70"> 
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
