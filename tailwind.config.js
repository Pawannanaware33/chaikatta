/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        chai: {
          50: '#FDF9F5',
          100: '#F8EFE6',
          200: '#EED9C7',
          300: '#DFBBA0',
          400: '#CB9671',
          500: '#B06F41',
          600: '#8E5026',
          700: '#723C1B',
          800: '#522912',
          900: '#34180A',
          950: '#1E0C04',
        },
        surface: {
          DEFAULT: '#FAF7F2',
          card: '#FFFFFF',
          muted: '#F3EDE4',
          border: '#E6DDD2',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(40, 20, 10, 0.04), 0 1px 2px -1px rgba(40, 20, 10, 0.04)',
        'warm': '0 4px 14px 0 rgba(70, 35, 15, 0.06)',
        'warm-lg': '0 10px 25px -3px rgba(70, 35, 15, 0.08), 0 4px 6px -4px rgba(70, 35, 15, 0.04)',
        'card': '0 1px 3px 0 rgba(28, 25, 23, 0.04), 0 6px 16px -2px rgba(28, 25, 23, 0.03)',
        'card-hover': '0 4px 20px -2px rgba(120, 53, 15, 0.09), 0 2px 6px -1px rgba(120, 53, 15, 0.04)',
        'card-active': '0 8px 24px -4px rgba(120, 53, 15, 0.14), 0 2px 8px -2px rgba(120, 53, 15, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'spring-bounce': 'springBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'pop-in': 'popIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-ring': 'pulseRing 1.6s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'receipt-eject': 'receiptEject 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scanline': 'scanline 2.4s ease-in-out infinite',
        'shimmer': 'shimmer 2.2s infinite linear',
        'number-bump': 'numberBump 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'badge-pulse': 'badgePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'svelte-fly': 'svelteFly 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'svelte-fly-up': 'svelteFlyUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'svelte-scale': 'svelteScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'svelte-slide': 'svelteSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'svelte-fade': 'svelteFade 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        springBounce: {
          '0%': { opacity: '0', transform: 'scale(0.4)' },
          '50%': { opacity: '1', transform: 'scale(1.15)' },
          '75%': { transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.5)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 14px rgba(16, 185, 129, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' },
        },
        receiptEject: {
          '0%': { opacity: '0', transform: 'translateY(-28px) scaleY(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scaleY(1)' },
        },
        scanline: {
          '0%': { top: '0%', opacity: '0.8' },
          '50%': { top: '92%', opacity: '1' },
          '100%': { top: '0%', opacity: '0.8' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
        numberBump: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        },
        badgePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        svelteFly: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        svelteFlyUp: {
          '0%': { opacity: '0', transform: 'translateY(24px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        svelteScale: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        svelteSlide: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        svelteFade: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },
  plugins: [],
}
