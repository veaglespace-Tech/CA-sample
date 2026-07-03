export default function TrustSection() {
  const brands = [
    "HDFC Bank", "Razorpay", "ICICI Bank", "Amazon", "Flipkart", "Swiggy", "Zomato"
  ];
  
  return (
    <div className="vs-trust-bar">
      <div className="vs-container" style={{ display: 'flex', alignItems: 'center' }}>
        <div className="vs-trust-label">TRUSTED BY 500K+ CLIENTS</div>
        <div className="vs-marquee">
          <div className="vs-marquee-content">
            {[...brands, ...brands].map((brand, idx) => (
              <span key={idx}>{brand}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
