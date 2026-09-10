import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '../../types/database.types';
import { PRODUCT_ICONS } from '../../data/initialProducts';
import { ProductSymbol } from './ProductSymbol';
import { formatCurrency } from '../../lib/formatters';
import { playPopSound, playDecrementSound } from '../../lib/sound';

interface ProductCardProps {
  product: Product;
  quantity: number;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  shortcutKey?: number;
  isQuickBilling?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantity,
  onIncrement,
  onDecrement,
  shortcutKey,
  isQuickBilling = false,
}) => {
  const [bubbles, setBubbles] = useState<{ id: number }[]>([]);
  const [minusBubbles, setMinusBubbles] = useState<{ id: number }[]>([]);
  const icon = PRODUCT_ICONS[product.product_code] || '☕';
  const hasQuantity = quantity > 0;

  const handlePlus = () => {
    onIncrement(product.id);
    playPopSound();
    const id = Date.now();
    setBubbles((prev) => [...prev.slice(-2), { id }]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 700);
  };

  const handleMinus = () => {
    if (quantity <= 0) return;
    onDecrement(product.id);
    playDecrementSound();
    const id = Date.now();
    setMinusBubbles((prev) => [...prev.slice(-2), { id }]);
    setTimeout(() => {
      setMinusBubbles((prev) => prev.filter((b) => b.id !== id));
    }, 700);
  };

  const handleCardClick = () => {
    handlePlus();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative isolate flex flex-col justify-between rounded-2xl overflow-hidden transition-all duration-150 select-none cursor-pointer svelte-spring-hover h-full min-h-0 ${
        hasQuantity
          ? isQuickBilling
            ? 'bg-amber-50/30 border-2 border-amber-900/80 ring-2 ring-amber-900/15 shadow-[0_6px_20px_rgba(120,53,15,0.12)]'
            : 'bg-amber-50/20 border border-amber-900/40 ring-1 ring-amber-900/10 shadow-[0_4px_12px_rgba(120,53,15,0.06)]'
          : 'bg-white border border-stone-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-amber-900/30 ring-1 ring-black/[0.02]'
      }`}
    >
      {/* Active Quantity Jewel Badge in Top-Right with Svelte Spring Scale */}
      {hasQuantity && (
        <div
          key={quantity}
          className="absolute top-1.5 right-1.5 z-10 px-2 py-0.5 rounded-full bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-amber-300 ring-1 ring-amber-400/30 text-[10px] font-black font-mono shadow-sm animate-svelte-scale tabular-nums"
        >
          × {quantity}
        </div>
      )}

      {/* Product Visual Area with Soft Ambient Lighting (Compact 20-25% Reduction) */}
      <div className="relative w-full flex-1 min-h-[32px] max-h-[50px] sm:max-h-[58px] lg:max-h-[62px] bg-gradient-to-b from-stone-50/80 to-stone-100/50 overflow-hidden flex items-center justify-center [&_[class*='bottom-2']]:hidden [&_svg]:w-9 sm:[&_svg]:w-9.5 [&_svg]:h-9 sm:[&_svg]:h-9.5">
        {/* Floating Mini Icon Badge */}
        <div className="absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded-md bg-white/95 backdrop-blur-xs border border-stone-200/80 flex items-center justify-center text-[11px] shadow-2xs group-hover:scale-105 transition-transform">
          <span>{icon}</span>
        </div>

        {/* Desktop Quick Billing Key Shortcut Indicator */}
        {shortcutKey !== undefined && (
          <div
            className="hidden lg:flex absolute top-1.5 left-7 z-10 h-5 px-1.5 rounded-md bg-stone-900/90 backdrop-blur-xs border border-amber-500/30 text-amber-200 items-center justify-center text-[9.5px] font-mono font-bold shadow-2xs group-hover:scale-105 transition-transform select-none"
            title={`Quick Billing Shortcut: Press key '${shortcutKey}'`}
          >
            <span>[{shortcutKey}]</span>
          </div>
        )}

        <ProductSymbol productCode={product.product_code} size="sm" />
      </div>

      {/* Card Info & Stepper Footer (High Visual Priority) */}
      <div className={`p-1.5 sm:p-2 border-t transition-colors duration-150 flex flex-col justify-between flex-shrink-0 ${
        hasQuantity ? 'bg-amber-50/20 border-amber-900/15' : 'bg-white border-stone-100/90'
      }`}>
        <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5">
          <h3 className="font-bold text-stone-900 text-[11.5px] sm:text-[12.5px] lg:text-[13px] leading-tight truncate" title={product.name}>
            {product.name}
          </h3>
          <span className="font-mono font-black text-amber-950 text-[11.5px] sm:text-[12.5px] lg:text-[13px] tracking-tight flex-shrink-0 tabular-nums">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Compact Stepper with Tactile Physics */}
        <div className="flex items-center justify-between bg-stone-100/70 rounded-xl p-0.5 border border-stone-200/70 h-8 sm:h-8.5 shadow-inner">
          {/* Decrement Button with Floating -1 Bubble & Dynamic Trash/Minus Morph */}
          <div className="relative">
            {minusBubbles.map((b) => (
              <span
                key={b.id}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-rose-700 bg-rose-100/95 border border-rose-300/80 px-1.5 py-0.2 rounded-full shadow-xs animate-float-bubble pointer-events-none z-30 select-none whitespace-nowrap"
              >
                -1
              </span>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleMinus();
              }}
              disabled={quantity <= 0}
              aria-label={quantity === 1 ? `Remove ${product.name}` : `Decrease ${product.name}`}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150 ease-out active:scale-90 ${
                quantity === 1
                  ? 'bg-rose-50 text-rose-600 border border-rose-200/90 shadow-2xs hover:bg-rose-100 hover:text-rose-700'
                  : quantity > 1
                  ? 'bg-white text-stone-800 border border-stone-200/90 shadow-2xs hover:bg-stone-50 hover:text-stone-900'
                  : 'text-stone-300 cursor-not-allowed opacity-25'
              }`}
            >
              {quantity === 1 ? (
                <Trash2 className="w-3.5 h-3.5 stroke-[2.2] transition-transform" />
              ) : (
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </button>
          </div>

          {/* Quantity Display with Animated Number Bump */}
          <div className="flex-1 text-center font-mono overflow-hidden">
            <span
              key={quantity}
              className={`inline-block text-xs sm:text-sm font-black tabular-nums transition-transform ${
                hasQuantity 
                  ? 'text-stone-950 scale-105' 
                  : 'text-stone-400'
              }`}
            >
              {quantity}
            </span>
          </div>

          {/* Increment Button with Floating +1 Bubble */}
          <div className="relative">
            {bubbles.map((b) => (
              <span
                key={b.id}
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-900 bg-amber-200/95 border border-amber-400/80 px-1.5 py-0.2 rounded-full shadow-xs animate-float-bubble pointer-events-none z-30 select-none whitespace-nowrap"
              >
                +1
              </span>
            ))}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePlus();
              }}
              aria-label={`Increase ${product.name}`}
              className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center hover:bg-black active:scale-90 transition-transform duration-100 ease-out shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
