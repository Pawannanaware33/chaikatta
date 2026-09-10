import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Receipt, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderWithItems } from '../../types/database.types';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface SuccessModalProps {
  order: OrderWithItems;
  onViewReceipt: () => void;
  onNewOrder: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  order,
  onViewReceipt,
  onNewOrder,
}) => {
  // Fire satisfying multi-wave confetti on mount
  useEffect(() => {
    try {
      // Wave 1: Center explosion
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#10B981', '#F59E0B', '#B06F41', '#34D399', '#FBBF24'],
        disableForReducedMotion: true,
      });

      // Wave 2: Left & Right cannons (staggered)
      const timer = setTimeout(() => {
        confetti({
          particleCount: 45,
          angle: 60,
          spread: 55,
          origin: { x: 0.15, y: 0.75 },
          colors: ['#10B981', '#F59E0B', '#B06F41'],
          disableForReducedMotion: true,
        });
        confetti({
          particleCount: 45,
          angle: 120,
          spread: 55,
          origin: { x: 0.85, y: 0.75 },
          colors: ['#10B981', '#F59E0B', '#B06F41'],
          disableForReducedMotion: true,
        });
      }, 160);

      return () => clearTimeout(timer);
    } catch {
      // Confetti fallback
    }
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-stone-950/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div className="bg-white w-full max-w-sm max-h-[92dvh] overflow-y-auto rounded-3xl p-5 sm:p-7 shadow-2xl border border-stone-200/80 text-center my-auto animate-spring-bounce transition-all duration-300 relative ring-1 ring-black/[0.04]">
        
        {/* Animated Drawing Checkmark Seal with Expanding Pulse Ring */}
        <div className="relative w-16 h-16 mx-auto mb-2.5 flex items-center justify-center">
          {/* Glowing Green Halo Ripple */}
          <div className="absolute inset-0 rounded-full bg-emerald-400/25 animate-pulse-ring pointer-events-none" />

          {/* SVG Animated Checkmark & Circular Path */}
          <div className="relative z-10 w-13 h-13 rounded-full bg-emerald-50 border border-emerald-200/90 flex items-center justify-center shadow-md">
            <svg
              className="w-8 h-8 text-emerald-600"
              viewBox="0 0 52 52"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Circular Stroke Draw */}
              <circle
                cx="26"
                cy="26"
                r="23"
                className="stroke-current stroke-[3] opacity-30 animate-circle-draw"
                strokeLinecap="round"
              />
              {/* Inner Checkmark Path Stroke Draw */}
              <path
                d="M15 27 L23 35 L37 19"
                className="stroke-current stroke-[4] animate-checkmark-draw"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Verified Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1 shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Payment Verified</span>
        </div>

        {/* Title & Medium Total */}
        <h3 className="text-lg font-black text-stone-900 tracking-tight">
          ORDER COMPLETED
        </h3>
        <div className="mt-0.5 mb-3 overflow-hidden">
          <span className="text-2xl sm:text-3xl font-black font-mono text-amber-950 tracking-tight inline-block animate-number-bump tabular-nums">
            <AnimatedNumber value={order.total_amount} type="currency" duration={700} />
          </span>
        </div>

        {/* Order Details Card */}
        <div className="bg-stone-50 rounded-xl p-3.5 my-3 border border-stone-200/80 text-left space-y-1.5 animate-slide-up shadow-2xs">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              Order Number
            </span>
            <span className="font-mono font-black text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs tabular-nums">
              {order.order_number}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              Payment Mode
            </span>
            <span className="font-bold text-stone-800 bg-stone-200/70 px-2 py-0.5 rounded-md border border-stone-300">
              {order.payment_method}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pt-0.5">
            <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">
              Items Count
            </span>
            <span className="font-bold text-stone-800 tabular-nums">
              <AnimatedNumber value={order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0} type="number" duration={400} /> items
            </span>
          </div>
        </div>

        {/* Action Buttons Side by Side with Svelte Spring Physics */}
        <div className="grid grid-cols-2 gap-2.5 pt-1 animate-slide-up">
          <button
            type="button"
            onClick={onViewReceipt}
            className="group h-11 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200/80 active:scale-[0.97] transition-all svelte-spring-press shadow-2xs"
          >
            <Receipt className="w-3.5 h-3.5 text-stone-600 group-hover:scale-105 transition-transform" />
            <span>Receipt</span>
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="group h-11 rounded-xl bg-stone-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all shadow-sm svelte-spring-press"
          >
            <span>Next Order</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
