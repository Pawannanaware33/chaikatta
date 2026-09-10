import React, { useState, useEffect, useRef } from 'react';
import { Banknote, QrCode, ShoppingBag, Plus, Minus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Product, PaymentMethod } from '../../types/database.types';
import { formatCurrency } from '../../lib/formatters';
import { playPopSound, playDecrementSound } from '../../lib/sound';

interface MobileCartBarProps {
  products: Product[];
  cartQuantities: Record<string, number>;
  totalItemCount: number;
  totalAmount: number;
  paymentMethod?: PaymentMethod;
  onSelectPaymentMethod?: (method: PaymentMethod) => void;
  onIncrement?: (productId: string) => void;
  onDecrement?: (productId: string) => void;
  onPlaceOrder?: () => void;
  onHeightChange?: (height: number) => void;
  isSubmitting?: boolean;
  isQuickBilling?: boolean;
}

export const MobileCartBar: React.FC<MobileCartBarProps> = ({
  products,
  cartQuantities,
  totalItemCount,
  totalAmount,
  paymentMethod = 'Cash',
  onSelectPaymentMethod,
  onIncrement,
  onDecrement,
  onPlaceOrder,
  onHeightChange,
  isSubmitting = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(totalItemCount);

  // Derived list of active cart items with itemized prices
  const activeItems = products
    .filter((p) => (cartQuantities[p.id] || 0) > 0)
    .map((p) => {
      const qty = cartQuantities[p.id] || 0;
      return {
        product: p,
        quantity: qty,
        lineTotal: qty * p.price,
      };
    });

  const isEmpty = activeItems.length === 0;

  // Auto-expand when first product is added so user immediately sees what was added
  useEffect(() => {
    if (prevCountRef.current === 0 && totalItemCount > 0) {
      setIsExpanded(true);
    }
    prevCountRef.current = totalItemCount;
  }, [totalItemCount]);

  // Dynamically measure checkout bar height and report to parent for bottom spacer
  useEffect(() => {
    if (!containerRef.current || !onHeightChange) return;

    const reportHeight = () => {
      if (containerRef.current) {
        const height = Math.round(containerRef.current.offsetHeight);
        if (height > 0) {
          onHeightChange(height);
        }
      }
    };

    reportHeight();

    const observer = new ResizeObserver(() => {
      reportHeight();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [onHeightChange, isExpanded, activeItems.length, totalItemCount]);

  return (
    <div
      ref={containerRef}
      id="mobile-sticky-checkout"
      style={{
        bottom: 'calc(52px + env(safe-area-inset-bottom, 0px))',
        zIndex: 40,
      }}
      className="lg:hidden fixed left-0 right-0 z-40 bg-[#FAF9F6] border-t border-stone-200/90 shadow-[0_-8px_25px_rgba(0,0,0,0.10)] select-none transition-all duration-200"
    >
      <div className="max-w-md mx-auto px-3 py-2 space-y-2">
        {/* Active Order Section (when cart has products) */}
        {!isEmpty ? (
          <div className="space-y-1.5">
            {/* Expand / Collapse Control Header */}
            <div
              onClick={() => setIsExpanded((prev) => !prev)}
              className="flex items-center justify-between py-1 px-1.5 rounded-lg bg-stone-100/80 border border-stone-200/60 cursor-pointer active:bg-stone-200/70 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-800 flex-shrink-0" />
                <span className="text-[11px] font-black tracking-wider text-stone-900 uppercase">
                  CURRENT ORDER
                </span>
                <span className="text-[10px] font-mono font-bold text-amber-950 bg-amber-200/80 px-1.5 py-0.2 rounded-md border border-amber-300/80 tabular-nums">
                  {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded((prev) => !prev);
                }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-stone-500 hover:text-stone-900 active:scale-90 transition-transform cursor-pointer"
                aria-label={isExpanded ? 'Collapse order details' : 'Expand order details'}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>

            {/* Compact Scrollable Selected Items List (max 22vh to never overtake screen) */}
            {isExpanded && (
              <div className="max-h-[22vh] overflow-y-auto overscroll-contain divide-y divide-stone-200/60 pr-1 py-0.5 space-y-1 rounded-xl bg-white border border-stone-200/70 shadow-2xs">
                {activeItems.map(({ product, quantity, lineTotal }) => (
                  <div
                    key={product.id}
                    className="py-1 px-2 flex items-center justify-between gap-2 text-xs first:pt-1.5 last:pb-1.5"
                  >
                    {/* Item Name & Rate */}
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-stone-900 text-xs leading-tight truncate">
                        {product.name}
                      </div>
                      <div className="text-[10.5px] font-mono text-stone-500 font-medium tabular-nums">
                        {quantity} × {formatCurrency(product.price)}
                      </div>
                    </div>

                    {/* Stepper Controls */}
                    <div className="flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200/80 flex-shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onDecrement) {
                            onDecrement(product.id);
                            playDecrementSound();
                          }
                        }}
                        className="w-7 h-7 rounded-md bg-white text-stone-700 flex items-center justify-center border border-stone-200/90 shadow-2xs active:scale-90 transition-transform cursor-pointer"
                        aria-label={`Decrease ${product.name}`}
                      >
                        {quantity === 1 ? (
                          <Trash2 className="w-3.5 h-3.5 text-rose-600 stroke-[2.2]" />
                        ) : (
                          <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
                      </button>

                      <span className="w-5 text-center font-mono font-black text-xs text-stone-900 tabular-nums">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onIncrement) {
                            onIncrement(product.id);
                            playPopSound();
                          }
                        }}
                        className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center shadow-2xs active:scale-90 transition-transform cursor-pointer hover:bg-black"
                        aria-label={`Increase ${product.name}`}
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Line Subtotal */}
                    <div className="w-14 text-right font-mono font-black text-xs text-amber-950 tabular-nums flex-shrink-0">
                      {formatCurrency(lineTotal)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Summary Row: Total Items (Left) and Total Amount (Right) */}
        <div className="flex items-center justify-between px-1 pt-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-stone-500">
            {totalItemCount} {totalItemCount === 1 ? 'ITEM' : 'ITEMS'}
          </span>
          <span className="text-base font-black font-mono text-amber-950 tabular-nums">
            {formatCurrency(totalAmount)}
          </span>
        </div>

        {/* Payment Method Chips: [ CASH ]  [ UPI ] */}
        <div className="grid grid-cols-2 gap-1.5 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200/80">
          <button
            type="button"
            onClick={() => onSelectPaymentMethod?.('Cash')}
            className={`h-8.5 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs transition-all active:scale-95 cursor-pointer ${
              paymentMethod === 'Cash'
                ? 'bg-stone-900 text-amber-300 shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>CASH</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectPaymentMethod?.('UPI')}
            className={`h-8.5 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs transition-all active:scale-95 cursor-pointer ${
              paymentMethod === 'UPI'
                ? 'bg-stone-900 text-amber-300 shadow-xs font-black'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>UPI</span>
          </button>
        </div>

        {/* Full-width Place Order Button */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isEmpty || isSubmitting}
          className={`w-full h-11 rounded-xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] cursor-pointer ${
            isEmpty || isSubmitting
              ? 'bg-stone-100 text-stone-400 border border-stone-200/80 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white shadow-md hover:from-black hover:to-amber-900 active:scale-95 shadow-amber-950/20'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2 font-bold text-xs">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>RECORDING ORDER...</span>
            </span>
          ) : (
            <span>
              {isEmpty
                ? 'PLACE ORDER →'
                : `PLACE ORDER ${formatCurrency(totalAmount)} →`}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
