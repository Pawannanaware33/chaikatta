import React from 'react';

interface ProductSymbolProps {
  productCode: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProductSymbol: React.FC<ProductSymbolProps> = ({
  productCode,
  className = '',
  size = 'md',
}) => {
  switch (productCode) {
    // -------------------------------------------------------------
    // P001: Masala Cutting Chai (Traditional Indian Glass Tumbler)
    // -------------------------------------------------------------
    case 'P001':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100/90 via-orange-50 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

          {/* SVG Cutting Chai Glass Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } text-amber-900 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wafting Tea Steam Ribbons */}
            <path
              d="M44 26 C42 21, 46 17, 44 12 C42 8, 45 5, 43 2"
              stroke="#B45309"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-70"
            />
            <path
              d="M56 24 C58 19, 54 15, 56 10 C58 6, 55 3, 57 1"
              stroke="#B45309"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-2 opacity-60"
            />

            {/* Glass Rim */}
            <ellipse cx="50" cy="32" rx="23" ry="5.5" fill="#FEF3C7" stroke="#78350F" strokeWidth="2.8" />

            {/* Glass Body (Tapered Fluted Tumbler) */}
            <path
              d="M27 32 L34 82 C35 88, 65 88, 66 82 L73 32"
              fill="#FDE68A"
              fillOpacity="0.4"
              stroke="#78350F"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* Spiced Chai Liquid Level */}
            <path
              d="M30 40 C35 43, 65 43, 70 40 L65 81 C64 86, 36 86, 35 81 Z"
              fill="url(#chaiGradient)"
              stroke="#92400E"
              strokeWidth="1.5"
            />

            {/* Traditional Fluted Glass Vertical Facets */}
            <line x1="42" y1="42" x2="44" y2="78" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.65" />
            <line x1="50" y1="43" x2="50" y2="79" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="58" y1="42" x2="56" y2="78" stroke="#78350F" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />

            {/* Frothy Spiced Chai Foam Layer */}
            <ellipse cx="50" cy="40" rx="20" ry="4.5" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
            <circle cx="45" cy="39" r="1.2" fill="#78350F" opacity="0.7" />
            <circle cx="52" cy="41" r="1.4" fill="#78350F" opacity="0.7" />
            <circle cx="56" cy="39.5" r="1" fill="#78350F" opacity="0.7" />

            {/* Glass Bottom Base */}
            <ellipse cx="50" cy="83" rx="15" ry="3.5" fill="#D97706" fillOpacity="0.3" stroke="#78350F" strokeWidth="2.5" />

            {/* Gradients */}
            <defs>
              <linearGradient id="chaiGradient" x1="50" y1="40" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D97706" />
                <stop offset="0.6" stopColor="#B45309" />
                <stop offset="1" stopColor="#78350F" />
              </linearGradient>
            </defs>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-amber-200/80 text-[10px] font-bold font-mono text-amber-950 uppercase tracking-wider shadow-2xs">
            ☕ Masala Chai
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P002: Lemon Tea (Fresh Citrus Infusion & Lemon Wheel)
    // -------------------------------------------------------------
    case 'P002':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-100/85 via-amber-50 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Sunny Citrus Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-yellow-300/25 blur-xl pointer-events-none" />

          {/* SVG Lemon Tea Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gentle Citrus Steam */}
            <path
              d="M48 24 C46 19, 50 15, 48 10 C46 6, 49 3, 47 1"
              stroke="#CA8A04"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-60"
            />

            {/* Transparent Glass Cup */}
            <rect x="25" y="32" width="44" height="42" rx="7" fill="#FEF08A" fillOpacity="0.3" stroke="#854D0E" strokeWidth="2.8" />
            <path
              d="M26 42 C30 44, 64 44, 68 42 L67 69 C67 72, 63 74, 59 74 L35 74 C31 74, 27 72, 27 69 Z"
              fill="url(#lemonTeaGrad)"
            />

            {/* Cup Handle */}
            <path
              d="M69 40 C79 40, 80 58, 69 60"
              stroke="#854D0E"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Fresh Mint Leaf Floating */}
            <path
              d="M40 37 C46 32, 54 36, 52 42 C46 44, 38 41, 40 37 Z"
              fill="#16A34A"
              stroke="#14532D"
              strokeWidth="1.2"
            />
            <path d="M42 39 L50 38" stroke="#86EFAC" strokeWidth="0.8" />

            {/* Vibrant Sliced Lemon Wheel on Rim */}
            <circle cx="31" cy="30" r="16" fill="#FACC15" stroke="#713F12" strokeWidth="2.5" />
            <circle cx="31" cy="30" r="12.5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.2" />

            {/* Lemon Pulp Radiating Wedges */}
            <path d="M31 19 L31 41" stroke="#EAB308" strokeWidth="1.3" />
            <path d="M20 30 L42 30" stroke="#EAB308" strokeWidth="1.3" />
            <path d="M23 22 L39 38" stroke="#EAB308" strokeWidth="1.3" />
            <path d="M39 22 L23 38" stroke="#EAB308" strokeWidth="1.3" />
            <circle cx="31" cy="30" r="3" fill="#FEF9C3" />

            {/* Saucer */}
            <ellipse cx="47" cy="78" rx="28" ry="4.5" fill="#FEF08A" fillOpacity="0.5" stroke="#854D0E" strokeWidth="2.5" />

            <defs>
              <linearGradient id="lemonTeaGrad" x1="47" y1="42" x2="47" y2="74" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FACC15" />
                <stop offset="0.7" stopColor="#EAB308" />
                <stop offset="1" stopColor="#CA8A04" />
              </linearGradient>
            </defs>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-yellow-200/80 text-[10px] font-bold font-mono text-yellow-950 uppercase tracking-wider shadow-2xs">
            🍋 Lemon Tea
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P003: Black Tea (Steeping Tea Leaves & Classic Teapot)
    // -------------------------------------------------------------
    case 'P003':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100/80 via-amber-50 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Deep Amber Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

          {/* SVG Black Tea Pot Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Aromatic Steam Wisps */}
            <path
              d="M21 32 C18 26, 23 20, 20 15 C17 10, 21 6, 19 2"
              stroke="#9A3412"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-75"
            />

            {/* Teapot Handle */}
            <path
              d="M71 45 C86 45, 87 72, 70 73"
              stroke="#7C2D12"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Teapot Body */}
            <ellipse cx="50" cy="62" rx="24" ry="19" fill="url(#blackTeaGrad)" stroke="#7C2D12" strokeWidth="2.8" />

            {/* Pouring Spout */}
            <path
              d="M30 55 C24 50, 18 42, 20 34 C24 34, 27 40, 36 47"
              fill="#9A3412"
              stroke="#7C2D12"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Teapot Lid */}
            <path
              d="M37 45 C37 40, 63 40, 63 45 Z"
              fill="#C2410C"
              stroke="#7C2D12"
              strokeWidth="2.5"
            />
            {/* Lid Knob */}
            <circle cx="50" cy="38" r="3.5" fill="#7C2D12" />

            {/* Golden Steeping Tea Leaf Crest */}
            <path
              d="M45 60 C48 54, 55 57, 54 64 C50 67, 44 65, 45 60 Z"
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="1.2"
            />
            <path d="M47 62 L52 59" stroke="#78350F" strokeWidth="0.8" />

            {/* Teapot Base */}
            <ellipse cx="50" cy="80" rx="14" ry="2.5" fill="#7C2D12" />

            <defs>
              <linearGradient id="blackTeaGrad" x1="50" y1="43" x2="50" y2="81" gradientUnits="userSpaceOnUse">
                <stop stopColor="#EA580C" />
                <stop offset="0.5" stopColor="#C2410C" />
                <stop offset="1" stopColor="#7C2D12" />
              </linearGradient>
            </defs>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-orange-200/80 text-[10px] font-bold font-mono text-orange-950 uppercase tracking-wider shadow-2xs">
            🫖 Black Tea
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P004: Coffee (Creamy Frothy Cappuccino with Coffee Beans)
    // -------------------------------------------------------------
    case 'P004':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200/85 via-amber-100/40 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Warm Mocha Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-600/15 blur-xl pointer-events-none" />

          {/* SVG Coffee Cup Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Coffee Steam */}
            <path
              d="M45 23 C43 18, 47 14, 45 9 C43 5, 46 2, 44 0"
              stroke="#78350F"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-70"
            />
            <path
              d="M55 21 C57 16, 53 12, 55 7 C57 3, 54 1, 56 0"
              stroke="#78350F"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-2 opacity-60"
            />

            {/* Cup Handle */}
            <path
              d="M66 42 C79 42, 80 62, 66 64"
              stroke="#44403C"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Ceramic Cup Body */}
            <path
              d="M26 36 L32 68 C33 74, 63 74, 64 68 L70 36 Z"
              fill="#FFFFFF"
              stroke="#44403C"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* Coffee Foam Surface */}
            <ellipse cx="48" cy="36" rx="22" ry="7" fill="#B45309" stroke="#44403C" strokeWidth="2.5" />
            <ellipse cx="48" cy="36" rx="19" ry="5.5" fill="#D97706" />

            {/* Creamy Latte Art Heart Motif */}
            <path
              d="M48 40 C43 36, 40 33, 44 31 C47 29, 48 33, 48 33 C48 33, 49 29, 52 31 C56 33, 53 36, 48 40 Z"
              fill="#FEF3C7"
              stroke="#FFFBEB"
              strokeWidth="0.8"
            />

            {/* Saucer */}
            <ellipse cx="48" cy="74" rx="27" ry="4.5" fill="#F5F5F4" stroke="#44403C" strokeWidth="2.5" />

            {/* Roasted Coffee Bean beside Cup */}
            <g transform="translate(18, 70) rotate(-25)">
              <ellipse cx="6" cy="4" rx="6" ry="4" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
              <path d="M6 1 C7 3, 5 5, 6 7" stroke="#FEF3C7" strokeWidth="0.9" strokeLinecap="round" />
            </g>

            <g transform="translate(72, 70) rotate(20)">
              <ellipse cx="5" cy="3.5" rx="5" ry="3.5" fill="#78350F" stroke="#451A03" strokeWidth="1.2" />
              <path d="M5 1 C6 2.5, 4 4.5, 5 6" stroke="#FEF3C7" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-stone-200/80 text-[10px] font-bold font-mono text-stone-800 uppercase tracking-wider shadow-2xs">
            ☕ Hot Coffee
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P005: Black Coffee (Rich Dark Roast Espresso Demitasse)
    // -------------------------------------------------------------
    case 'P005':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-300/80 via-amber-100/30 to-stone-200/60 overflow-hidden ${className}`}
        >
          {/* Intense Espresso Crema Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-800/15 blur-xl pointer-events-none" />

          {/* SVG Black Coffee Demitasse Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark Roast Steam Wisps */}
            <path
              d="M48 24 C46 19, 50 14, 48 9 C46 5, 49 2, 47 0"
              stroke="#1C1917"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-70"
            />

            {/* Demitasse Handle */}
            <path
              d="M66 44 C76 44, 77 60, 66 61"
              stroke="#1C1917"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Matte Charcoal Cup Body */}
            <path
              d="M28 38 L34 66 C35 71, 61 71, 62 66 L68 38 Z"
              fill="#292524"
              stroke="#1C1917"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* Deep Obsidian Coffee Surface */}
            <ellipse cx="48" cy="38" rx="20" ry="6.5" fill="#1C1917" stroke="#1C1917" strokeWidth="2" />

            {/* Golden Tiger Stripe Espresso Crema Ring */}
            <ellipse cx="48" cy="38" rx="17" ry="5" fill="#92400E" />
            <ellipse cx="48" cy="38" rx="14" ry="4" fill="#451A03" />
            <circle cx="43" cy="37" r="1.5" fill="#D97706" opacity="0.8" />
            <circle cx="53" cy="39" r="1.2" fill="#D97706" opacity="0.8" />

            {/* Sleek Charcoal Saucer */}
            <ellipse cx="48" cy="72" rx="25" ry="4" fill="#44403C" stroke="#1C1917" strokeWidth="2.5" />

            {/* Whole Roasted Beans */}
            <g transform="translate(20, 68) rotate(-15)">
              <ellipse cx="5" cy="3.5" rx="5" ry="3.5" fill="#292524" stroke="#1C1917" strokeWidth="1" />
              <path d="M5 1 C6 2.5, 4 4.5, 5 6" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
            </g>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/90 backdrop-blur-xs border border-stone-700 text-[10px] font-bold font-mono text-amber-200 uppercase tracking-wider shadow-2xs">
            ☕ Black Coffee
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P006: Water Bottle (Crisp Chilled Pure Mineral Water)
    // -------------------------------------------------------------
    case 'P006':
    default:
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-100/90 via-cyan-50 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Glacial Pure Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-sky-400/20 blur-xl pointer-events-none" />

          {/* SVG Mineral Water Flask Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric Water Ripple Effect */}
            <ellipse cx="50" cy="85" rx="28" ry="4" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />

            {/* Bottle Screw Cap with Grip Ridges */}
            <rect x="44" y="10" width="12" height="7" rx="2" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
            <line x1="47" y1="11" x2="47" y2="16" stroke="#BAE6FD" strokeWidth="1" />
            <line x1="50" y1="11" x2="50" y2="16" stroke="#BAE6FD" strokeWidth="1" />
            <line x1="53" y1="11" x2="53" y2="16" stroke="#BAE6FD" strokeWidth="1" />

            {/* Bottle Neck */}
            <path d="M46 17 L46 23 L54 23 L54 17 Z" fill="#E0F2FE" stroke="#0369A1" strokeWidth="2" />

            {/* Bottle Body with Ergonomic Taper */}
            <path
              d="M46 23 C39 27, 36 34, 36 44 L37 77 C37 83, 63 83, 63 77 L64 44 C64 34, 61 27, 54 23 Z"
              fill="#E0F2FE"
              fillOpacity="0.45"
              stroke="#0284C7"
              strokeWidth="2.8"
              strokeLinejoin="round"
            />

            {/* Water Fill Level */}
            <path
              d="M37 42 C44 44, 56 44, 63 42 L63 77 C63 82, 37 82, 37 77 Z"
              fill="url(#waterGrad)"
              stroke="#0284C7"
              strokeWidth="1.5"
            />

            {/* Fresh Water Surface Wave */}
            <path
              d="M37 42 Q44 45 50 42 T63 42"
              fill="none"
              stroke="#BAE6FD"
              strokeWidth="1.8"
            />

            {/* Crisp Mineral Droplets */}
            <path
              d="M68 35 C68 38, 65 41, 62 41 C59 41, 57 38, 62 31 C67 38, 68 35, 68 35 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="1"
            />
            <circle cx="28" cy="50" r="2" fill="#38BDF8" opacity="0.8" />
            <circle cx="26" cy="58" r="1.3" fill="#38BDF8" opacity="0.7" />

            <defs>
              <linearGradient id="waterGrad" x1="50" y1="42" x2="50" y2="82" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" stopOpacity="0.75" />
                <stop offset="0.6" stopColor="#0284C7" stopOpacity="0.85" />
                <stop offset="1" stopColor="#0369A1" stopOpacity="0.9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Beverage Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-sky-200/80 text-[10px] font-bold font-mono text-sky-950 uppercase tracking-wider shadow-2xs">
            💧 Pure Water
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P007: Biscuit (Crisp Golden Chai Biscuit with Docking Holes)
    // -------------------------------------------------------------
    case 'P007':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-stone-100/70 overflow-hidden ${className}`}
        >
          {/* Warm Baked Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

          {/* SVG Biscuit Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Biscuit Drop Shadow */}
            <ellipse cx="50" cy="80" rx="28" ry="4.5" fill="#78350F" fillOpacity="0.15" />

            {/* Biscuit Base / Side Thickness */}
            <rect x="22" y="32" width="56" height="42" rx="10" fill="#B45309" stroke="#92400E" strokeWidth="2.5" />

            {/* Biscuit Main Face */}
            <rect x="22" y="27" width="56" height="42" rx="10" fill="url(#biscuitGrad)" stroke="#92400E" strokeWidth="2.5" />

            {/* Inner Decorative Stitched Perimeter Border */}
            <rect x="27" y="32" width="46" height="32" rx="6" fill="none" stroke="#B45309" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.6" />

            {/* Center "CHAI" Bakery Stamp */}
            <text
              x="50"
              y="50"
              textAnchor="middle"
              fill="#92400E"
              fontSize="8"
              fontWeight="900"
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1.5"
              opacity="0.75"
            >
              CHAI
            </text>

            {/* Docking Holes (Top Row) */}
            <circle cx="33" cy="38" r="1.5" fill="#92400E" />
            <circle cx="41.5" cy="38" r="1.5" fill="#92400E" />
            <circle cx="50" cy="38" r="1.5" fill="#92400E" />
            <circle cx="58.5" cy="38" r="1.5" fill="#92400E" />
            <circle cx="67" cy="38" r="1.5" fill="#92400E" />

            {/* Docking Holes (Bottom Row) */}
            <circle cx="33" cy="58" r="1.5" fill="#92400E" />
            <circle cx="41.5" cy="58" r="1.5" fill="#92400E" />
            <circle cx="50" cy="58" r="1.5" fill="#92400E" />
            <circle cx="58.5" cy="58" r="1.5" fill="#92400E" />
            <circle cx="67" cy="58" r="1.5" fill="#92400E" />

            {/* Fluted Edge Scallop Notches */}
            <circle cx="22" cy="38" r="2.5" fill="#FDE68A" />
            <circle cx="22" cy="48" r="2.5" fill="#FDE68A" />
            <circle cx="22" cy="58" r="2.5" fill="#FDE68A" />
            <circle cx="78" cy="38" r="2.5" fill="#FDE68A" />
            <circle cx="78" cy="48" r="2.5" fill="#FDE68A" />
            <circle cx="78" cy="58" r="2.5" fill="#FDE68A" />

            {/* Falling Crisp Crumbs */}
            <circle cx="16" cy="68" r="1.5" fill="#B45309" opacity="0.8" />
            <circle cx="20" cy="74" r="1.2" fill="#D97706" opacity="0.7" />
            <circle cx="82" cy="65" r="1.8" fill="#B45309" opacity="0.8" />
            <circle cx="85" cy="73" r="1.2" fill="#D97706" opacity="0.7" />

            <defs>
              <linearGradient id="biscuitGrad" x1="50" y1="27" x2="50" y2="69" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE68A" />
                <stop offset="0.6" stopColor="#F59E0B" />
                <stop offset="1" stopColor="#D97706" />
              </linearGradient>
            </defs>
          </svg>

          {/* Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-amber-200/80 text-[10px] font-bold font-mono text-amber-950 uppercase tracking-wider shadow-2xs">
            🍪 Biscuit • ₹5
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P008: Small Cigarette (Classic Filter Stick with Ember)
    // -------------------------------------------------------------
    case 'P008':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-200/80 via-stone-100/90 to-amber-50/40 overflow-hidden ${className}`}
        >
          {/* Subtle Warm Smoke Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-orange-400/15 blur-xl pointer-events-none" />

          {/* SVG Small Cigarette Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Wisp of Smoke from Ember Tip */}
            <path
              d="M74 46 C75 39, 70 33, 73 26 C76 20, 71 15, 74 9"
              stroke="#A8A29E"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-70"
            />
            <path
              d="M78 45 C81 37, 76 30, 80 23 C83 17, 79 12, 82 8"
              stroke="#A8A29E"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-2 opacity-50"
            />

            {/* Drop Shadow */}
            <ellipse cx="50" cy="74" rx="32" ry="3.5" fill="#292524" fillOpacity="0.12" />

            {/* Compact Cigarette Body Group */}
            <g transform="rotate(-15 50 54)">
              {/* Cork Filter Tip */}
              <rect x="22" y="47" width="18" height="12" rx="2" fill="url(#corkGrad)" stroke="#78350F" strokeWidth="1.8" />
              <circle cx="26" cy="51" r="0.8" fill="#78350F" opacity="0.6" />
              <circle cx="31" cy="55" r="0.7" fill="#78350F" opacity="0.6" />
              <circle cx="36" cy="50" r="0.8" fill="#78350F" opacity="0.6" />

              {/* Gold Foil Accent Ring */}
              <rect x="40" y="47" width="2.5" height="12" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />

              {/* White Paper Cylinder */}
              <rect x="42.5" y="47" width="32" height="12" rx="1" fill="#FFFFFF" stroke="#44403C" strokeWidth="1.8" />
              <line x1="51" y1="48" x2="51" y2="58" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="60" y1="48" x2="60" y2="58" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="68" y1="48" x2="68" y2="58" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />

              {/* Ash / Carbon Zone */}
              <rect x="74.5" y="47.5" width="4" height="11" rx="1" fill="#57534E" stroke="#44403C" strokeWidth="1" />

              {/* Glowing Red-Hot Ember Tip */}
              <path d="M78.5 48.5 C81 50, 82 56, 78.5 57.5 Z" fill="url(#smallEmberGrad)" />
              <circle cx="79.5" cy="53" r="1.2" fill="#FEF08A" />
            </g>

            {/* Glowing Embers Floating */}
            <circle cx="79" cy="42" r="1" fill="#F59E0B" className="animate-pulse" />
            <circle cx="83" cy="38" r="0.8" fill="#EF4444" opacity="0.8" />

            <defs>
              <linearGradient id="corkGrad" x1="22" y1="47" x2="40" y2="59" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#D97706" />
                <stop offset="1" stopColor="#B45309" />
              </linearGradient>
              <linearGradient id="smallEmberGrad" x1="78" y1="48" x2="82" y2="58" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.4" stopColor="#F97316" />
                <stop offset="1" stopColor="#DC2626" />
              </linearGradient>
            </defs>
          </svg>

          {/* Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-stone-200/80 text-[10px] font-bold font-mono text-stone-800 uppercase tracking-wider shadow-2xs">
            🚬 Small Cigarette • ₹15
          </div>
        </div>
      );

    // -------------------------------------------------------------
    // P009: Big Cigarette (King-Size Premium Filter Stick)
    // -------------------------------------------------------------
    case 'P009':
      return (
        <div
          className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-300/70 via-stone-200/80 to-amber-100/30 overflow-hidden ${className}`}
        >
          {/* Intense Ember Glow */}
          <div className="absolute w-24 h-24 rounded-full bg-amber-500/20 blur-xl pointer-events-none" />

          {/* SVG Big Cigarette Illustration */}
          <svg
            viewBox="0 0 100 100"
            className={`${
              size === 'sm' ? 'w-10 h-10' : size === 'lg' ? 'w-24 h-24' : 'w-18 h-18 sm:w-20 sm:h-20'
            } transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1 drop-shadow-xs`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Long Rich Smoke Plume */}
            <path
              d="M80 44 C82 36, 75 29, 79 21 C83 14, 76 8, 80 2"
              stroke="#78716C"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-1 opacity-75"
            />
            <path
              d="M84 43 C88 34, 82 26, 86 18 C89 11, 84 6, 87 1"
              stroke="#78716C"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="20"
              className="animate-steam-2 opacity-55"
            />

            {/* Drop Shadow */}
            <ellipse cx="50" cy="76" rx="38" ry="4" fill="#1C1917" fillOpacity="0.18" />

            {/* King-Size Long Cigarette Body Group */}
            <g transform="rotate(-15 50 54)">
              {/* Premium Dark Amber Filter Tip */}
              <rect x="14" y="46.5" width="24" height="13" rx="2" fill="url(#bigFilterGrad)" stroke="#451A03" strokeWidth="2" />
              <circle cx="19" cy="51" r="0.9" fill="#451A03" opacity="0.5" />
              <circle cx="26" cy="56" r="0.8" fill="#451A03" opacity="0.5" />
              <circle cx="32" cy="50" r="0.9" fill="#451A03" opacity="0.5" />

              {/* Double Gold Foil Luxury Crest Bands */}
              <rect x="38" y="46.5" width="2" height="13" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />
              <rect x="41" y="46.5" width="2" height="13" fill="#F59E0B" stroke="#B45309" strokeWidth="0.6" />

              {/* King-Size White Paper Tube */}
              <rect x="43" y="46.5" width="41" height="13" rx="1" fill="#FFFFFF" stroke="#292524" strokeWidth="2" />
              <line x1="53" y1="47.5" x2="53" y2="58.5" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="63" y1="47.5" x2="63" y2="58.5" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />
              <line x1="73" y1="47.5" x2="73" y2="58.5" stroke="#E7E5E4" strokeWidth="1" strokeDasharray="1.5 1.5" />

              {/* Textured Ash Tip */}
              <rect x="84" y="47" width="5" height="12" rx="1" fill="#44403C" stroke="#292524" strokeWidth="1" />

              {/* Incandescent Hot Burning Core Ember */}
              <path d="M89 48 C92.5 50, 93.5 56, 89 58 Z" fill="url(#bigEmberGrad)" />
              <circle cx="90.5" cy="53" r="1.5" fill="#FEF08A" />
              <circle cx="89.5" cy="51" r="0.8" fill="#FFFFFF" />
            </g>

            {/* Flying Spark Particles */}
            <circle cx="85" cy="38" r="1.3" fill="#F59E0B" className="animate-pulse" />
            <circle cx="88" cy="32" r="0.9" fill="#EF4444" opacity="0.85" />
            <circle cx="91" cy="41" r="0.7" fill="#FEF08A" opacity="0.9" />

            <defs>
              <linearGradient id="bigFilterGrad" x1="14" y1="46" x2="38" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#D97706" />
                <stop offset="0.5" stopColor="#B45309" />
                <stop offset="1" stopColor="#78350F" />
              </linearGradient>
              <linearGradient id="bigEmberGrad" x1="88" y1="47" x2="93" y2="59" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FEF08A" />
                <stop offset="0.3" stopColor="#F59E0B" />
                <stop offset="0.7" stopColor="#EA580C" />
                <stop offset="1" stopColor="#B91C1C" />
              </linearGradient>
            </defs>
          </svg>

          {/* Label Pill */}
          <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/90 backdrop-blur-xs border border-stone-700 text-[10px] font-bold font-mono text-amber-300 uppercase tracking-wider shadow-2xs">
            🚬 Big Cigarette • ₹25
          </div>
        </div>
      );
  }
};
