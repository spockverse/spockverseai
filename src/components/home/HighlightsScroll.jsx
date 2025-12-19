import React from 'react';

export default function HighlightsScroll({ highlights }) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <div className="relative border-t border-b border-purple-900/20 bg-zinc-950/50">
      {/* Purple Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/5 via-purple-600/5 to-purple-900/5 pointer-events-none" />
      
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <style>{`
        .highlight-marquee {
          position: relative;
          width: 100%;
          overflow: hidden;
          height: 114px;
          display: flex;
          padding-top: 8px;
          padding-bottom: 8px;
        }

        .marquee-track {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-shrink: 0;
          animation: scrollLoop 47s linear infinite;
        }

        .marquee-track > * {
          margin-right: 18px;
        }

        .marquee-track img {
          height: 98px;
          width: auto;
          object-fit: contain;
          pointer-events: none;
          transform: none;
          margin-right: 18px;
        }

        @keyframes scrollLoop {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
      `}</style>

      <div className="highlight-marquee">
        {/* Original track */}
        <div className="marquee-track">
          {highlights.map((highlight) => (
            <div
              key={`original-${highlight.id}`}
              className="flex-shrink-0 relative"
            >
              <img
                src={highlight.image_url}
                alt={highlight.title || 'Highlight'}
                className="border border-purple-900/30 shadow-lg"
                style={{ borderRadius: '8px' }}
                loading="lazy"
                decoding="async"
              />
              {/* Subtle scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Clone track for seamless loop */}
        <div className="marquee-track clone">
          {highlights.map((highlight) => (
            <div
              key={`clone-${highlight.id}`}
              className="flex-shrink-0 relative"
            >
              <img
                src={highlight.image_url}
                alt={highlight.title || 'Highlight'}
                className="border border-purple-900/30 shadow-lg"
                style={{ borderRadius: '8px' }}
                loading="lazy"
                decoding="async"
              />
              {/* Subtle scanline effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] opacity-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}