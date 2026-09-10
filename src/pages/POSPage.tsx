import React, { useState, useEffect } from 'react';
import { Product, PaymentMethod } from '../types/database.types';
import { getProducts } from '../services/productService';
import { ProductCard } from '../components/pos/ProductCard';
import { CartSummary } from '../components/pos/CartSummary';
import { MobileCartBar } from '../components/pos/MobileCartBar';
import { CafeLiveBackground } from '../components/pos/CafeLiveBackground';
import { RefreshCw, Keyboard, X } from 'lucide-react';
import { playPopSound } from '../lib/sound';

interface POSPageProps {
  cartQuantities: Record<string, number>;
  paymentMethod: PaymentMethod;
  onIncrement: (productId: string) => void;
  onDecrement: (productId: string) => void;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onPlaceOrder: () => void;
  onResetOrder: () => void;
  onShowUpiQr?: () => void;
  isSubmitting?: boolean;
}

export const POSPage: React.FC<POSPageProps> = ({
  cartQuantities,
  paymentMethod,
  onIncrement,
  onDecrement,
  onSelectPaymentMethod,
  onPlaceOrder,
  onResetOrder,
  onShowUpiQr,
  isSubmitting = false,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [mobileCheckoutHeight, setMobileCheckoutHeight] = useState<number>(130);
  const [isQuickBilling, setIsQuickBilling] = useState<boolean>(() => {
    try {
      return localStorage.getItem('chai_katta_quick_billing') === 'true';
    } catch {
      return false;
    }
  });

  const toggleQuickBilling = () => {
    setIsQuickBilling((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('chai_katta_quick_billing', String(next));
      } catch {
        // Storage unavailable
      }
      return next;
    });
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalItemsCount = Object.values(cartQuantities).reduce((a, b) => a + b, 0);

  // Compute total amount
  const totalAmount = products.reduce((sum, p) => {
    const qty = cartQuantities[p.id] || 0;
    return sum + qty * p.price;
  }, 0);

  // Desktop keyboard shortcuts (1-9, C, U, Enter, Esc, ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC handler: Close shortcuts dialog if open (never clears cart)
      if (e.key === 'Escape') {
        if (showShortcutsHelp) {
          setShowShortcutsHelp(false);
          return;
        }
        return;
      }

      // Quick Billing shortcuts below require isQuickBilling to be true and desktop viewport
      if (!isQuickBilling) return;

      // Desktop only check (match Tailwind 'lg' breakpoint: 1024px)
      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
        return;
      }

      // Ignore modifier keys (Ctrl, Alt, Meta)
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      // Ignore key repeats from held-down keys to prevent duplicate actions
      if (e.repeat) {
        return;
      }

      // Ignore if user is typing inside an input, textarea, select, or editable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      // Keyboard shortcut help toggle via '?' key
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault();
        setShowShortcutsHelp((prev) => !prev);
        return;
      }

      // Ignore if any modal dialog is currently open
      if (document.querySelector('[role="dialog"]') || showShortcutsHelp) {
        return;
      }

      // Ignore remaining shortcuts if Shift is pressed
      if (e.shiftKey) {
        return;
      }

      const key = e.key.toLowerCase();

      // Payment Method: C -> Cash
      if (key === 'c') {
        e.preventDefault();
        onSelectPaymentMethod('Cash');
        playPopSound();
        return;
      }

      // Payment Method: U -> UPI
      if (key === 'u') {
        e.preventDefault();
        onSelectPaymentMethod('UPI');
        playPopSound();
        return;
      }

      // Enter -> Place Order
      if (e.key === 'Enter') {
        // - cart contains at least one product
        // - payment method is selected
        // - no modal is open (checked above)
        // - user is not typing inside an input (checked above)
        // - order not currently submitting
        if (totalItemsCount > 0 && paymentMethod && !isSubmitting) {
          e.preventDefault();
          onPlaceOrder();
        }
        return;
      }

      // Number keys 1-9 for products (adds exactly +1)
      let digit: number | null = null;
      if (e.key >= '1' && e.key <= '9') {
        digit = parseInt(e.key, 10);
      } else if (e.code && e.code.startsWith('Numpad') && e.code.length === 7) {
        const numpadNum = parseInt(e.code.replace('Numpad', ''), 10);
        if (numpadNum >= 1 && numpadNum <= 9) {
          digit = numpadNum;
        }
      }

      if (digit !== null) {
        const productIndex = digit - 1;
        const targetProduct = products[productIndex];

        if (targetProduct) {
          e.preventDefault();
          onIncrement(targetProduct.id);
          playPopSound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isQuickBilling,
    showShortcutsHelp,
    products,
    totalItemsCount,
    paymentMethod,
    isSubmitting,
    onIncrement,
    onSelectPaymentMethod,
    onPlaceOrder,
  ]);

  return (
    <div className="relative w-full h-full flex flex-col p-2 sm:p-3 max-w-6xl mx-auto overflow-hidden animate-fade-in">
      {/* Aesthetic Minimal Live Cafe Background */}
      <CafeLiveBackground />

      {/* Compact POS Top Bar */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-200/70 flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs sm:text-sm font-extrabold text-stone-900 tracking-tight">
              COUNTER REGISTER
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200/70 text-stone-500 text-[9px] font-bold uppercase tracking-wider hidden sm:inline-flex">
              9 Items
            </span>
          </div>

          {totalItemsCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-900 text-amber-300 shadow-2xs animate-svelte-scale tabular-nums">
              {totalItemsCount} {totalItemsCount === 1 ? 'item selected' : 'items selected'}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Billing Toggle */}
          <button
            type="button"
            onClick={toggleQuickBilling}
            title={isQuickBilling ? 'Turn off Quick Billing' : 'Turn on Quick Billing'}
            aria-pressed={isQuickBilling}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all active:scale-95 shadow-2xs svelte-spring-press flex items-center gap-1.5 select-none ${
              isQuickBilling
                ? 'bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-200/80 ring-1 ring-amber-400/30 font-extrabold'
                : 'bg-white border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            }`}
          >
            <span>⚡</span>
            <span>{isQuickBilling ? 'Quick Billing ON' : 'Quick Billing'}</span>
          </button>

          {/* Desktop Keyboard Shortcuts Help Trigger */}
          {isQuickBilling && (
            <button
              type="button"
              onClick={() => setShowShortcutsHelp((prev) => !prev)}
              title="View Quick Billing keyboard shortcuts (or press ?)"
              className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg border border-stone-200/80 bg-white text-stone-600 hover:text-stone-900 hover:border-amber-900/40 hover:bg-amber-50/40 transition-all active:scale-95 shadow-2xs select-none cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5 text-stone-500" />
              <span>Shortcuts</span>
              <kbd className="text-[9px] font-mono font-bold text-stone-400 bg-stone-100 px-1 rounded border border-stone-200">?</kbd>
            </button>
          )}

          {totalItemsCount > 0 && (
            <button
              type="button"
              onClick={onResetOrder}
              className="text-[11px] font-bold text-stone-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-stone-200 bg-white transition-all active:scale-95 shadow-2xs svelte-spring-press"
            >
              Clear Order
            </button>
          )}
        </div>
      </div>

        {/* Main Responsive Layout: Left 3x3 Grid, Right Cart on Desktop */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5 min-h-0 overflow-hidden">
          {/* Products Grid Column (2 cols on mobile, 3 cols on wider screens, 3x3 on desktop) */}
          <div className="lg:col-span-8 h-full min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden pb-4 lg:pb-0 relative isolate z-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center flex-1 text-stone-500 py-12">
                <RefreshCw className="w-6 h-6 animate-spin text-stone-600 mb-2" />
                <p className="text-xs font-medium">Loading menu products...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 min-[431px]:grid-cols-3 gap-2 sm:gap-2.5 w-full lg:h-full lg:grid-rows-3 min-h-0">
                {products.map((product, index) => (
                  <div key={product.id} className="h-[108px] min-[431px]:h-28 lg:h-full lg:max-h-[135px] min-h-0">
                    <ProductCard
                      product={product}
                      quantity={cartQuantities[product.id] || 0}
                      onIncrement={onIncrement}
                      onDecrement={onDecrement}
                      shortcutKey={isQuickBilling && index < 9 ? index + 1 : undefined}
                      isQuickBilling={isQuickBilling}
                    />
                  </div>
                ))}

                {/* Dynamic Bottom Spacer ensuring full clearance for Sticky Checkout + Bottom Navigation + Safe Area */}
                <div
                  style={{
                    height: `${mobileCheckoutHeight + 52 + 16}px`,
                  }}
                  className="col-span-full w-full flex-shrink-0 lg:hidden pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* Desktop Order Summary Column (side-by-side, hidden on mobile) */}
          <div className="hidden lg:flex lg:col-span-4 h-full min-h-0 flex-col overflow-hidden sticky top-0">
            <CartSummary
              products={products}
              cartQuantities={cartQuantities}
              paymentMethod={paymentMethod}
              onSelectPaymentMethod={onSelectPaymentMethod}
              onPlaceOrder={onPlaceOrder}
              onShowUpiQr={onShowUpiQr}
              isSubmitting={isSubmitting}
              isQuickBilling={isQuickBilling}
            />
          </div>
        </div>

        {/* Mobile Sticky Action Bar */}
        <MobileCartBar
          products={products}
          cartQuantities={cartQuantities}
          totalItemCount={totalItemsCount}
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          onSelectPaymentMethod={onSelectPaymentMethod}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          onPlaceOrder={onPlaceOrder}
          onHeightChange={setMobileCheckoutHeight}
          isSubmitting={isSubmitting}
          isQuickBilling={isQuickBilling}
        />

      {/* Compact Quick Billing Shortcuts Modal (Desktop only) */}
      {showShortcutsHelp && isQuickBilling && (
        <div
          role="dialog"
          aria-modal="true"
          className="hidden lg:flex fixed inset-0 z-[65] items-center justify-center bg-stone-950/40 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowShortcutsHelp(false)}
        >
          <div
            className="w-72 bg-white rounded-2xl p-4 shadow-2xl border border-stone-200 ring-1 ring-black/[0.06] animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-100">
              <span className="text-[11px] font-black text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="text-amber-600">⚡</span> QUICK BILLING SHORTCUTS
              </span>
              <button
                type="button"
                onClick={() => setShowShortcutsHelp(false)}
                className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close shortcuts"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-stone-50/80 border border-stone-100">
                <span className="text-stone-600 font-medium">Add product</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-mono font-black text-[11px] border border-stone-200 shadow-2xs">
                  1–9
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-stone-50/80 border border-stone-100">
                <span className="text-stone-600 font-medium">Cash</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-mono font-black text-[11px] border border-stone-200 shadow-2xs">
                  C
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-stone-50/80 border border-stone-100">
                <span className="text-stone-600 font-medium">UPI</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-mono font-black text-[11px] border border-stone-200 shadow-2xs">
                  U
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-stone-50/80 border border-stone-100">
                <span className="text-stone-600 font-medium">Place order</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-mono font-black text-[11px] border border-stone-200 shadow-2xs">
                  Enter
                </kbd>
              </div>

              <div className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-stone-50/80 border border-stone-100">
                <span className="text-stone-600 font-medium">Close</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white text-stone-800 font-mono font-black text-[11px] border border-stone-200 shadow-2xs">
                  Esc
                </kbd>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-stone-100 text-center">
              <span className="text-[10px] text-stone-400 font-medium">
                Press <kbd className="font-mono font-bold text-stone-600">Esc</kbd> anytime to dismiss
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
