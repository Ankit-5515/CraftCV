import { ImageResponse } from 'next/og';

export const alt = 'CraftCV — Free ATS-Optimized Resume Builder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0F172A',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#F8FAFC',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: '#2563EB',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                fontWeight: 800,
              }}
            >
              CV
            </div>
            <div
              style={{
                fontSize: '36px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                display: 'flex',
              }}
            >
              <span>Craft</span>
              <span style={{ color: '#60A5FA' }}>CV</span>
            </div>
          </div>

          <div
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              background: '#1E293B',
              border: '1px solid #334155',
              color: '#34D399',
              fontSize: '20px',
              fontWeight: 700,
            }}
          >
            100% Free • No Watermark • ATS Verified
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            Build an ATS-Optimized Resume in Under 5 Minutes
          </div>
          <div
            style={{
              fontSize: '28px',
              lineHeight: 1.4,
              color: '#94A3B8',
            }}
          >
            8 executive templates • Live 0–100 ATS score checker • Multi-page A4 & Letter support • Selectable-text vector PDF export
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            fontSize: '22px',
            color: '#CBD5E1',
            fontWeight: 600,
          }}
        >
          <span style={{ color: '#60A5FA' }}>1. Choose Template</span>
          <span>→</span>
          <span style={{ color: '#60A5FA' }}>2. Edit Live</span>
          <span>→</span>
          <span style={{ color: '#60A5FA' }}>3. Check ATS Score</span>
          <span>→</span>
          <span style={{ color: '#34D399' }}>4. Download Vector PDF</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
