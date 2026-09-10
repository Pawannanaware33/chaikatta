import React from 'react';

/**
 * Aesthetic Minimal Live Cafe Background for Chai Katta POS
 * 
 * Features:
 * 1. Living Ambient Lighting: Slow, organic breathing amber and warm spice glows.
 * 2. Gentle Steam / Aroma Wisps: Minimalist vector curves drifting lazily in the air.
 * 3. Warm Morning Cafe Sunbeam: Subtle diagonal light streak across the counter.
 * 4. Micro Golden Bokeh Motes: Tiny floating warmth particles catching the light.
 * 5. Tactile Artisanal Texture: Whisper-fine organic grain overlay.
 * 
 * 100% pointer-events-none, hardware-accelerated, zero CPU overhead.
 */
export const CafeLiveBackground: React.FC = React.memo(() => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#FAF7F2]"
    >
      {/* 1. Organic Tactile Cafe Paper / Countertop Grain */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.022] mix-blend-color-burn"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="cafe-paper-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#cafe-paper-grain)" />
      </svg>

      {/* 2. Soft Morning Sunbeam Diagonal Accent */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-amber-200/15 via-transparent to-stone-900/[0.02]"
        style={{
          maskImage: 'linear-gradient(135deg, black 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(135deg, black 0%, transparent 70%)',
        }}
      />

      {/* 3. Living Ambient Cafe Lighting Orbs (Slow Breathing Sway) */}
      {/* Orb A: Morning Cafe Amber Sunlight (Top Left) */}
      <div
        className="absolute -top-36 -left-36 w-[520px] sm:w-[680px] h-[520px] sm:h-[680px] rounded-full bg-gradient-to-br from-amber-300/30 via-orange-200/20 to-transparent blur-3xl animate-cafe-sway-1"
      />

      {/* Orb B: Warm Chai & Cinnamon Spice Glow (Bottom Right) */}
      <div
        className="absolute -bottom-32 -right-32 w-[480px] sm:w-[640px] h-[480px] sm:h-[640px] rounded-full bg-gradient-to-tl from-amber-600/12 via-amber-500/8 to-transparent blur-3xl animate-cafe-sway-2"
      />

      {/* Orb C: Fresh Latte Crema Soft Highlight (Center / Upper Right) */}
      <div
        className="absolute top-1/4 right-1/4 w-[380px] sm:w-[500px] h-[380px] sm:h-[500px] rounded-full bg-gradient-to-tr from-yellow-200/20 via-amber-100/15 to-transparent blur-3xl animate-cafe-sway-3"
      />

      {/* 4. Minimalist Elegant Steam & Aroma Wisps */}
      <div className="absolute inset-0 flex items-center justify-between px-12 opacity-60">
        {/* Left Aroma Wisp */}
        <div
          className="absolute left-[12%] bottom-[15%] w-24 h-48 animate-cafe-steam-rise"
          style={{ animationDelay: '0s', animationDuration: '11s' }}
        >
          <svg
            viewBox="0 0 80 160"
            fill="none"
            className="w-full h-full stroke-amber-900/[0.08]"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M40 150 C20 120, 60 90, 35 60 C15 35, 45 15, 30 5" />
          </svg>
        </div>

        {/* Center-Right Aroma Wisp */}
        <div
          className="absolute right-[22%] bottom-[20%] w-28 h-56 animate-cafe-steam-rise hidden sm:block"
          style={{ animationDelay: '4.5s', animationDuration: '13s' }}
        >
          <svg
            viewBox="0 0 80 160"
            fill="none"
            className="w-full h-full stroke-amber-800/[0.06]"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <path d="M35 155 C55 125, 20 95, 45 65 C60 40, 25 18, 40 5" />
          </svg>
        </div>

        {/* Far Right Soft Steam Drift */}
        <div
          className="absolute right-[8%] bottom-[10%] w-20 h-40 animate-cafe-steam-rise hidden md:block"
          style={{ animationDelay: '8s', animationDuration: '10s' }}
        >
          <svg
            viewBox="0 0 80 160"
            fill="none"
            className="w-full h-full stroke-amber-700/[0.06]"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M45 150 C30 120, 50 90, 35 60 C25 40, 45 20, 38 5" />
          </svg>
        </div>
      </div>

      {/* 5. Minimal Golden Floating Motes / Sunlight Dust */}
      <div
        className="absolute left-[18%] bottom-[25%] w-1.5 h-1.5 rounded-full bg-amber-400/35 blur-[0.6px] animate-cafe-mote"
        style={{ animationDelay: '1s', animationDuration: '16s' }}
      />
      <div
        className="absolute left-[42%] bottom-[18%] w-1 h-1 rounded-full bg-amber-300/40 blur-[0.4px] animate-cafe-mote"
        style={{ animationDelay: '6s', animationDuration: '19s' }}
      />
      <div
        className="absolute right-[30%] bottom-[30%] w-1.5 h-1.5 rounded-full bg-amber-500/30 blur-[0.5px] animate-cafe-mote"
        style={{ animationDelay: '10s', animationDuration: '15s' }}
      />
      <div
        className="absolute right-[14%] bottom-[22%] w-1 h-1 rounded-full bg-amber-400/40 blur-[0.5px] animate-cafe-mote"
        style={{ animationDelay: '3s', animationDuration: '18s' }}
      />

      {/* 6. Subtle Vignette Border (Soft focus towards POS elements) */}
      <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(180,83,9,0.035)] pointer-events-none" />
    </div>
  );
});

CafeLiveBackground.displayName = 'CafeLiveBackground';
