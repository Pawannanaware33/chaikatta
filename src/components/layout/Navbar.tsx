import React, { useState, useEffect } from 'react';
import { Coffee, LayoutDashboard, Volume2, VolumeX } from 'lucide-react';
import { isSoundMuted, toggleSound, playSuccessSound } from '../../lib/sound';

interface NavbarProps {
  currentTab: 'pos' | 'dashboard';
  onSelectTab: (tab: 'pos' | 'dashboard') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [soundOff, setSoundOff] = useState(isSoundMuted());
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const muted = toggleSound();
    setSoundOff(muted);
    if (!muted) {
      playSuccessSound();
    }
  };

  return (
    <>
      {/* Top Header with Scroll-Reactive Glassmorphism Transition */}
      <header
        className={`sticky top-0 z-40 flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-xl border-b border-stone-200/90 shadow-xs h-11 sm:h-12'
            : 'bg-white/70 backdrop-blur-md border-b border-stone-200/50 h-11 sm:h-12'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
          {/* Brand Identity with Live Register Beacon & Animated Tea Steam */}
          <div 
            onClick={() => onSelectTab('pos')}
            className="flex items-center gap-3 cursor-pointer select-none group active:scale-95 transition-transform duration-150"
          >
            <div className="relative flex items-center justify-center">
              {/* Gentle Rising Tea Steam */}
              <span className="absolute -top-2 left-1.5 w-1 h-2.5 bg-amber-700/30 rounded-full animate-steam-1 pointer-events-none" />
              <span className="absolute -top-2.5 left-3 w-1 h-3 bg-amber-700/25 rounded-full animate-steam-2 pointer-events-none" />
              <div className="w-8 h-8 rounded-xl bg-amber-100/60 border border-amber-200/70 flex items-center justify-center text-lg shadow-2xs group-hover:scale-105 transition-transform duration-200">
                <span role="img" aria-label="tea">☕</span>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-black tracking-tight text-stone-900 leading-none">
                  CHAI KATTA
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-black bg-stone-900 text-amber-300 tracking-wider uppercase shadow-2xs">
                  POS
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-stone-500 font-semibold tracking-wide">
                  Station 01 • Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation with Svelte-Style Segmented Pill */}
            <nav className="hidden md:flex items-center bg-stone-100/80 p-0.5 rounded-xl border border-stone-200/70 shadow-2xs">
              <button
                type="button"
                onClick={() => onSelectTab('pos')}
                className={`relative flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                  currentTab === 'pos'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                <Coffee className={`w-3.5 h-3.5 transition-transform ${currentTab === 'pos' ? 'text-amber-800 scale-105' : 'text-stone-400'}`} />
                <span>POS</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectTab('dashboard')}
                className={`relative flex items-center gap-1.5 px-3.5 py-1 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                  currentTab === 'dashboard'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-900 hover:bg-white/40'
                }`}
              >
                <LayoutDashboard className={`w-3.5 h-3.5 transition-transform ${currentTab === 'dashboard' ? 'text-amber-800 scale-105' : 'text-stone-400'}`} />
                <span>Dashboard</span>
              </button>
            </nav>

            {/* Audio Toggle */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={soundOff ? "Sound muted" : "Sound active"}
              className="w-8 h-8 rounded-xl border border-stone-200/70 bg-white/90 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-white active:scale-90 transition-all duration-150 shadow-2xs"
            >
              {soundOff ? (
                <VolumeX className="w-3.5 h-3.5 text-stone-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-stone-700 animate-pop-in" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav
        id="mobile-bottom-navbar"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          height: 'calc(52px + env(safe-area-inset-bottom, 0px))',
        }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-4 flex items-center justify-around transition-colors duration-200"
      >
        <button
          type="button"
          onClick={() => onSelectTab('pos')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 active:scale-95 ${
            currentTab === 'pos'
              ? 'text-stone-900 font-bold'
              : 'text-stone-500 font-medium'
          }`}
        >
          <Coffee className={`w-5 h-5 mb-0.5 ${currentTab === 'pos' ? 'text-stone-900 stroke-[2.5]' : 'text-stone-500'}`} />
          <span className="text-[10px] tracking-wide">POS</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('dashboard')}
          className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-xl transition-all duration-150 active:scale-95 ${
            currentTab === 'dashboard'
              ? 'text-stone-900 font-bold'
              : 'text-stone-500 font-medium'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 mb-0.5 ${currentTab === 'dashboard' ? 'text-stone-900 stroke-[2.5]' : 'text-stone-500'}`} />
          <span className="text-[10px] tracking-wide">Dashboard</span>
        </button>
      </nav>
    </>
  );
};
