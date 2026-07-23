import { ImageResponse } from 'next/og';
 
export const runtime = 'edge';
export const alt = 'Akiru - Informatics & Solo Builder';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#111315', // var(--bg)
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#e5e7eb', // var(--text)
          fontFamily: 'sans-serif', // Default to generic sans-serif since custom fonts require loading TTF
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.03)',
          }}
        >
          <h1
            style={{
              fontSize: 100,
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.05em',
            }}
          >
            AKIRU
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#38bdae', // var(--accent-teal)
              margin: '20px 0 0 0',
              fontFamily: 'monospace',
            }}
          >
            Informatics · Solo builder
          </p>
          <div
            style={{
              marginTop: '60px',
              display: 'flex',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '40px', fontSize: 24 }}>
              Projects
            </div>
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: '40px', fontSize: 24 }}>
              Achievements
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
