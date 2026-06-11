export default function FAQ({ faqs }) {
  if (!faqs || faqs.length === 0) return null;
  
  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => (
        <div key={index} className="collapse collapse-plus bg-base-100 border border-base-200 rounded-2xl">
          <input type="checkbox" /> 
          <div className="collapse-title text-lg font-bold pr-12">
            {faq.q}
          </div>
          <div className="collapse-content opacity-70"> 
            <p>{faq.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
