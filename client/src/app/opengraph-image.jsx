import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Veagle Space Technology';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Try to use absolute URL to fetch the image, falling back to a standard hosted one
  let logoSrc = "https://democa.veaglespace.com/veaglespace-logo.png";
  
  return new ImageResponse(
    (
      <div
        style={{
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <img src={logoSrc} alt="Veagle Space" style={{ width: 180, height: 180, objectFit: 'contain' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 110, fontWeight: 900, letterSpacing: '-0.04em' }}>
              <span style={{ color: '#0f172a' }}>Veagle</span>
              <span style={{ color: '#0ea5e9', marginLeft: '25px' }}>Space</span>
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, color: '#64748b', marginTop: 15, letterSpacing: '-0.01em' }}>
              Technology Pvt. Ltd.
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
