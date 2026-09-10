import React from 'react';
import { ShoppingBag, ArrowRight, QrCode } from 'lucide-react';
import { Product, PaymentMethod } from '../../types/database.types';
import { PRODUCT_ICONS } from '../../data/initialProducts';
import { PaymentSelector } from './PaymentSelector';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface CartSummaryProps {
  products: Product[];
  cartQuantities: Record<string, number>;
  paymentMethod: PaymentMethod;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onPlaceOrder: () => void;
  onShowUpiQr?: () => void;
  isSubmitting?: boolean;
  isQuickBilling?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  products,
  cartQuantities,
  paymentMethod,
  onSelectPaymentMethod,
  onPlaceOrder,
  onShowUpiQr,
  isSubmitting = false,
  isQuickBilling = false,
}) => {
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

  const totalAmount = activeItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const totalItemCount = activeItems.reduce((sum, item) => sum + item.quantity, 0);
  const isEmpty = activeItems.length === 0;

  return (
    <div className="h-full flex flex-col justify-between bg-white rounded-2xl border border-stone-200/70 p-3 sm:p-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.03)] min-h-0 overflow-hidden ring-1 ring-black/[0.02]">
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-1.5 flex-shrink-0">
          <div className="flex items-center gap-2 text-stone-900">
            <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-800">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <h3 className="font-extrabold text-xs uppercase tracking-wider">
              CURRENT ORDER
            </h3>
          </div>
          {!isEmpty ? (
            <span className="text-[10px] font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/70 animate-svelte-scale tabular-nums">
              <AnimatedNumber value={totalItemCount} type="number" duration={250} /> {totalItemCount === 1 ? 'item' : 'items'}
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
              Empty
            </span>
          )}
        </div>

        {/* Item List or Empty State */}
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center py-6 text-stone-400">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-center justify-center mb-2 shadow-2xs">
              <ShoppingBag className="w-6 h-6 text-stone-300 stroke-[1.5]" />
            </div>
            <p className="text-xs font-bold text-stone-700">Order is empty</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Tap menu items to add to ticket</p>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1 py-1">
            {activeItems.map(({ product, quantity, lineTotal }, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-stone-50/80 hover:bg-stone-100/80 border border-stone-200/60 transition-colors duration-150 animate-svelte-fly"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5.5 h-5.5 rounded-lg bg-white border border-stone-200/80 flex items-center justify-center text-xs shadow-2xs">
                    {PRODUCT_ICONS[product.product_code] || '☕'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-bold text-stone-900 text-xs">{product.name}</span>
                    <span className="text-[10px] font-mono text-stone-600 font-bold bg-white px-1.5 py-0.2 rounded-md border border-stone-200 shadow-2xs tabular-nums">
                      × <AnimatedNumber value={quantity} type="number" duration={200} />
                    </span>
                  </div>
                </div>
                <span className="font-bold font-mono text-amber-950 text-xs tabular-nums">
                  <AnimatedNumber value={lineTotal} type="currency" duration={250} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Area: Totals, Payment & Place Order */}
      <div className="space-y-2 pt-2 border-t border-stone-100 flex-shrink-0">
        {/* Luxury Espresso Terminal Total Display */}
        <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white rounded-xl p-2.5 sm:p-3 border border-stone-800/90 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
                TOTAL DUE
              </span>
              <span className="text-[9px] font-mono text-stone-400 font-medium">
                (INR)
              </span>
            </div>
            <span className="text-[10px] text-stone-400 font-medium leading-none block mt-0.5">
              Net Payable
            </span>
          </div>
          <div className="overflow-hidden text-right">
            <span
              className="text-xl sm:text-2xl font-black text-amber-200 font-mono tracking-tight inline-block leading-none tabular-nums drop-shadow-xs"
            >
              <AnimatedNumber value={totalAmount} type="currency" duration={350} />
            </span>
          </div>
        </div>

        {/* Payment Selector with animated Cash Tender Calculator */}
        <PaymentSelector
          selectedMethod={paymentMethod}
          onSelectMethod={onSelectPaymentMethod}
          totalAmount={totalAmount}
          isQuickBilling={isQuickBilling}
        />

        {/* Dynamic UPI QR Code Action */}
        {paymentMethod === 'UPI' && !isEmpty && onShowUpiQr && (
          <button
            type="button"
            onClick={onShowUpiQr}
            className="group w-full h-8 rounded-lg bg-amber-50/90 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 border border-amber-200 hover:bg-amber-100 active:scale-[0.97] transition-all shadow-2xs"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-700" />
            <span>SHOW QR (<AnimatedNumber value={totalAmount} type="currency" duration={350} />)</span>
          </button>
        )}

        {/* Place Order CTA with Shimmer */}
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isEmpty || isSubmitting}
          className={`relative overflow-hidden w-full h-11 sm:h-12 rounded-xl font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] group shadow-sm cursor-pointer ${
            isEmpty || isSubmitting
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950 text-white hover:from-black hover:to-amber-900 hover:shadow-md hover:shadow-amber-950/20'
          }`}
        >
          {/* Shimmer Light Reflection Sweep (When Active) */}
          {!isEmpty && !isSubmitting && (
            <span
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-shimmer pointer-events-none"
              aria-hidden="true"
            />
          )}

          {isSubmitting ? (
            <span className="flex items-center gap-2 font-bold text-xs">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>RECORDING ORDER...</span>
            </span>
          ) : (
            <>
              <span className="tracking-wider flex items-center gap-1.5">
                <span>{isQuickBilling ? '⚡ QUICK BILL & PAY' : 'PLACE ORDER & PAY'}</span>
                {!isEmpty && (
                  <span className="opacity-80 font-mono text-xs font-bold tabular-nums">
                    (<AnimatedNumber value={totalAmount} type="currency" duration={250} />)
                  </span>
                )}
              </span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3] group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
