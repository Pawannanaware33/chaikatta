import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { POSPage } from './pages/POSPage';
import { DashboardPage } from './pages/DashboardPage';
import { SuccessModal } from './components/pos/SuccessModal';
import { ReceiptModal } from './components/pos/ReceiptModal';
import { UpiQrModal } from './components/pos/UpiQrModal';
import { Product, PaymentMethod, OrderWithItems } from './types/database.types';
import { getProducts } from './services/productService';
import { createOrder } from './services/orderService';
import { playSuccessSound } from './lib/sound';
import { AlertTriangle, X } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'pos' | 'dashboard'>('pos');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Completed order & modal states
  const [completedOrder, setCompletedOrder] = useState<OrderWithItems | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showUpiQrModal, setShowUpiQrModal] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
    }
    load();
  }, []);

  const handleIncrement = (productId: string) => {
    setCartQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
    if (submitError) setSubmitError(null);
  };

  const handleDecrement = (productId: string) => {
    setCartQuantities((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return {
        ...prev,
        [productId]: current - 1,
      };
    });
    if (submitError) setSubmitError(null);
  };

  const handleResetOrder = () => {
    setCartQuantities({});
    setPaymentMethod('Cash');
    setSubmitError(null);
  };

  // Global Escape key handler to close open dialogs without clearing cart
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showReceiptModal) {
          setShowReceiptModal(false);
        } else if (showSuccessModal) {
          setShowSuccessModal(false);
        } else if (showUpiQrModal) {
          setShowUpiQrModal(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showReceiptModal, showSuccessModal, showUpiQrModal]);

  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Prevent duplicate submission

    // Build list of active items
    const orderItems = products
      .filter((p) => (cartQuantities[p.id] || 0) > 0)
      .map((p) => ({
        product_id: p.id,
        name: p.name,
        quantity: cartQuantities[p.id],
        unit_price: p.price,
      }));

    if (orderItems.length === 0) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createOrder({
        payment_method: paymentMethod,
        items: orderItems,
      });

      if (result.success && result.order) {
        // 1. Play confirmation sound safely (never blocks)
        playSuccessSound();

        // 2. Clear cart ONLY after successful database save
        setCartQuantities({});
        setPaymentMethod('Cash');

        // 3. Show success screen with order details
        setCompletedOrder(result.order);
        setShowSuccessModal(true);
      } else {
        // Submission failed: Do NOT clear cart, show required error message
        setSubmitError(
          result.error || 'Unable to save the order. Please check your connection and try again.'
        );
      }
    } catch {
      // Network/system failure: Do NOT clear cart
      setSubmitError('Unable to save the order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewReceipt = () => {
    setShowSuccessModal(false);
    setShowReceiptModal(true);
  };

  const handleNewOrder = () => {
    setShowSuccessModal(false);
    setShowReceiptModal(false);
    setCompletedOrder(null);
    setCartQuantities({});
    setPaymentMethod('Cash');
    setSubmitError(null);
  };

  const currentCartTotal = products.reduce((sum, p) => {
    const qty = cartQuantities[p.id] || 0;
    return sum + qty * p.price;
  }, 0);

  return (
    <div className={`flex flex-col text-stone-900 selection:bg-stone-200 ${
      currentTab === 'pos' ? 'h-screen overflow-hidden' : 'min-h-screen'
    }`}>
      {/* Top Navbar & Mobile Bottom Bar */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Error Alert Banner */}
      {submitError && (
        <div className="w-full bg-rose-50 border-b border-rose-200 text-rose-900 px-4 py-2 flex items-center justify-between text-xs font-semibold flex-shrink-0 animate-in slide-in-from-top duration-200">
          <div className="max-w-6xl mx-auto w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
            <button
              onClick={() => setSubmitError(null)}
              className="text-rose-500 hover:text-rose-800 p-1"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area with Svelte-Style View Transition */}
      <main className={`flex-1 flex flex-col ${currentTab === 'pos' ? 'min-h-0 overflow-hidden' : ''}`}>
        <div key={currentTab} className={`flex-1 flex flex-col ${currentTab === 'pos' ? 'min-h-0 overflow-hidden' : ''} animate-svelte-fly`}>
          {currentTab === 'pos' ? (
            <POSPage
              cartQuantities={cartQuantities}
              paymentMethod={paymentMethod}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              onSelectPaymentMethod={setPaymentMethod}
              onPlaceOrder={handlePlaceOrder}
              onResetOrder={handleResetOrder}
              onShowUpiQr={() => setShowUpiQrModal(true)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <DashboardPage onGoToPOS={() => setCurrentTab('pos')} />
          )}
        </div>
      </main>

      {/* Dynamic Customer-Facing UPI QR Modal */}
      {showUpiQrModal && currentCartTotal > 0 && (
        <UpiQrModal
          amount={currentCartTotal}
          onConfirmPayment={async () => {
            setShowUpiQrModal(false);
            await handlePlaceOrder();
          }}
          onClose={() => setShowUpiQrModal(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && completedOrder && (
        <SuccessModal
          order={completedOrder}
          onViewReceipt={handleViewReceipt}
          onNewOrder={handleNewOrder}
        />
      )}

      {/* Receipt Modal */}
      {showReceiptModal && completedOrder && (
        <ReceiptModal
          order={completedOrder}
          onClose={() => setShowReceiptModal(false)}
          onNewOrder={handleNewOrder}
        />
      )}
    </div>
  );
}

export default App;
