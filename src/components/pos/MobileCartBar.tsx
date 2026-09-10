import React, { useState, useEffect, useRef } from 'react';
import { Banknote, QrCode, ShoppingBag, Plus, Minus, Trash2, ChevronUp, X } from 'lucide-react';
import { Product, PaymentMethod } from '../../types/database.types';
import { formatCurrency } from '../../lib/formatters';
import { playPopSound, playDecrementSound } from '../../lib/sound';
import { PaymentSelector } from './PaymentSelector';

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
  onShowUpiQr?: () => void;
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
  onShowUpiQr,
  onHeightChange,
  isSubmitting = false,
  isQuickBilling = false,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

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

  // Auto-close sheet when cart becomes empty
  useEffect(() => {
    if (isEmpty) {
      setIsSheetOpen(false);
    }
  }, [isEmpty]);

  // Report height for bottom grid clearance
  useEffect(() => {
    if (!onHeightChange) return;

    if (isEmpty) {
      onHeightChange(0);
      return;
    }

    if (barRef.current) {
      const height = Math.round(barRef.current.offsetHeight);
      if (height > 0) {
        onHeightChange(height);
      }
    }
  }, [onHeightChange, isEmpty]);

  if (isEmpty) {
    return null;
  }

  return (
    <>
      {/* Backdrop overlay when sheet is open */}
      {isSheetOpen && (
        <div
          role="presentation"
          onClick={() => setIsSheetOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-stone-950/50 backdrop-blur-xs animate-fade-in"
        />
      )}

      {/* Expandable Bottom Sheet Drawer */}
      {isSheetOpen && (
        <div
          style={{
            bottom: 'calc(52px + env(safe-area-inset-bottom, 0px))',
            zIndex: 45,
          }}
          className="md:hidden fixed left-0 right-0 max-h-[75vh] flex flex-col bg-[#FAF9F6] rounded-t-3xl border-t border-stone-200 shadow-2xl animate-slide-up"
        >
          {/* Sheet Handle & Header */}
          <div className="px-4 pt-3 pb-2 border-b border-stone-200/80 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center text-amber-900">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black tracking-wider text-stone-900 uppercase">
                  ORDER DETAILS
                </span>
                <span className="text-[10px] text-stone-500 font-medium ml-2 tabular-nums">
                  ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSheetOpen(false)}
              className="w-7 h-7 rounded-full bg-stone-200/70 text-stone-600 flex items-center justify-center hover:bg-stone-300 transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Itemized List */}
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-stone-200/70 p-3 space-y-1.5">
            {activeItems.map(({ product, quantity, lineTotal }) => (
              <div
                key={product.id}
                className="py-2 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-stone-900 text-xs truncate">
                    {product.name}
                  </div>
                  <div className="text-[11px] font-mono text-stone-500 font-medium tabular-nums">
                    {quantity} × {formatCurrency(product.price)}
                  </div>
                </div>

                {/* Stepper */}
                <div className="flex items-center gap-1.5 bg-stone-100/90 p-0.5 rounded-lg border border-stone-200 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onDecrement) {
                        onDecrement(product.id);
                        playDecrementSound();
                      }
                    }}
                    className="w-7 h-7 rounded-md bg-white text-stone-700 flex items-center justify-center border border-stone-200 shadow-2xs active:scale-90 transition-transform cursor-pointer"
                    aria-label={`Decrease ${product.name}`}
                  >
                    {quantity === 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-rose-600 stroke-[2.2]" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                    )}
                  </button>

                  <span className="w-6 text-center font-mono font-black text-xs text-stone-900 tabular-nums">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onIncrement) {
                        onIncrement(product.id);
                        playPopSound();
                      }
                    }}
                    className="w-7 h-7 rounded-md bg-stone-900 text-white flex items-center justify-center shadow-2xs active:scale-90 transition-transform cursor-pointer"
                    aria-label={`Increase ${product.name}`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="w-16 text-right font-mono font-black text-xs text-amber-950 tabular-nums flex-shrink-0">
                  {formatCurrency(lineTotal)}
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method Selector inside Sheet */}
          <div className="p-3 bg-white border-t border-stone-200/80 space-y-2.5 flex-shrink-0">
            {onSelectPaymentMethod && (
              <PaymentSelector
                selectedMethod={paymentMethod}
                onSelectMethod={onSelectPaymentMethod}
                totalAmount={totalAmount}
                isQuickBilling={isQuickBilling}
              />
            )}

            {/* UPI QR Code Trigger on Mobile */}
            {paymentMethod === 'UPI' && onShowUpiQr && (
              <button
                type="button"
                onClick={() => {
                  setIsSheetOpen(false);
                  onShowUpiQr();
                }}
                className="w-full h-8.5 rounded-lg bg-amber-50 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-200 active:scale-[0.98] transition-all shadow-2xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-amber-700" />
                <span>Show Customer UPI QR ({formatCurrency(totalAmount)})</span>
              </button>
            )}

            {/* Place Order CTA Button */}
            <button
              type="button"
              onClick={() => {
                setIsSheetOpen(false);
                if (onPlaceOrder) onPlaceOrder();
              }}
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>RECORDING ORDER...</span>
                </span>
              ) : (
                <span>CONFIRM & PAY {formatCurrency(totalAmount)} →</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Compact Bottom Sticky Bar */}
      <div
        ref={barRef}
        id="mobile-sticky-checkout"
        style={{
          bottom: 'calc(52px + env(safe-area-inset-bottom, 0px))',
          zIndex: 40,
        }}
        className="md:hidden fixed left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] select-none px-3 py-2 animate-slide-up"
      >
        <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
          {/* Left: Tappable Cart Summary (Opens Details Sheet) */}
          <button
            type="button"
            onClick={() => setIsSheetOpen(true)}
            className="flex items-center gap-2 py-1 px-2 -ml-1 rounded-xl hover:bg-stone-100 active:bg-stone-200/60 transition-colors text-left cursor-pointer group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-amber-100/90 flex items-center justify-center text-amber-900 flex-shrink-0">
              <ShoppingBag className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-stone-900 text-amber-300 text-[9px] font-mono font-black flex items-center justify-center ring-1 ring-white">
                {totalItemCount}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-black font-mono text-stone-900 leading-tight tabular-nums">
                {formatCurrency(totalAmount)}
              </span>
              <span className="text-[10px] font-bold text-amber-800 flex items-center gap-0.5 leading-none">
                <span>View items</span>
                <ChevronUp className="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </div>
          </button>

          {/* Right: Quick Payment Mode Switcher & Direct Pay CTA */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Payment Mode Pills */}
            <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => onSelectPaymentMethod?.('Cash')}
                className={`h-7 px-2 rounded-md font-black text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'Cash'
                    ? 'bg-stone-900 text-amber-300 shadow-xs'
                    : 'text-stone-600'
                }`}
              >
                <Banknote className="w-3 h-3" />
                <span>CASH</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectPaymentMethod?.('UPI')}
                className={`h-7 px-2 rounded-md font-black text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-stone-900 text-amber-300 shadow-xs'
                    : 'text-stone-600'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>UPI</span>
              </button>
            </div>

            {/* Direct Pay Button */}
            <button
              type="button"
              onClick={onPlaceOrder}
              disabled={isSubmitting}
              className="h-8.5 px-3 rounded-xl bg-gradient-to-r from-stone-900 to-amber-950 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>PAY →</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
