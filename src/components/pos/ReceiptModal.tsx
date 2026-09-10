import React from 'react';
import { Printer, PlusCircle, X } from 'lucide-react';
import { OrderWithItems } from '../../types/database.types';
import { formatCurrency, formatDate, formatTime } from '../../lib/formatters';

interface ReceiptModalProps {
  order: OrderWithItems;
  onClose: () => void;
  onNewOrder: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  order,
  onClose,
  onNewOrder,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-950/65 backdrop-blur-sm overflow-y-auto animate-fade-in"
    >
      <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200/80 relative my-auto animate-scale-in transition-colors duration-200 ring-1 ring-black/[0.04]">
        {/* Close Button (Hidden on Print) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close receipt"
          className="no-print absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 hover:bg-stone-200 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Printable Receipt Container with Thermal Paper Eject Animation */}
        <div className="no-print h-1.5 w-28 bg-stone-300/80 rounded-full mx-auto mb-2.5 shadow-inner" />
        
        <div
          id="printable-receipt"
          className="font-mono text-stone-800 text-xs sm:text-sm select-text bg-white p-4 rounded-xl border border-stone-200/80 shadow-sm animate-receipt-eject relative overflow-hidden"
        >
          {/* Brand Header */}
          <div className="text-center pb-3 border-b border-dashed border-stone-300">
            <div className="text-xl mb-1">☕</div>
            <h2 className="text-base font-bold tracking-tight text-stone-900 leading-tight">
              CHAI KATTA
            </h2>
            <p className="text-[11px] text-stone-500 font-sans tracking-wide">
              Tea • Coffee • Refreshments
            </p>
          </div>

          {/* Order Meta */}
          <div className="py-3 border-b border-dashed border-stone-200 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Order:</span>
              <span className="font-bold text-stone-900">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Date:</span>
              <span>{formatDate(order.order_date || order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500 font-medium">Time:</span>
              <span>{formatTime(order.order_time || order.created_at)}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-3 border-b border-dashed border-stone-300 space-y-2">
            {order.items.map((item, idx) => (
              <div key={item.id || idx} className="flex justify-between items-baseline text-xs">
                <div className="flex-1 pr-2">
                  <div className="font-semibold text-stone-900">{item.name}</div>
                  <div className="text-[11px] text-stone-500">
                    {item.quantity} × {formatCurrency(item.unit_price)}
                  </div>
                </div>
                <div className="font-bold text-stone-900 text-right">
                  {formatCurrency(item.line_total)}
                </div>
              </div>
            ))}
          </div>

          {/* Total & Payment Method */}
          <div className="py-3 border-b border-dashed border-stone-300 space-y-1.5">
            <div className="flex justify-between items-center text-sm font-bold text-stone-900">
              <span>TOTAL</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-stone-600">
              <span>Payment Method:</span>
              <span className="font-semibold text-stone-800">{order.payment_method}</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 pb-1 text-xs text-stone-500 space-y-0.5">
            <p className="font-semibold text-stone-700">Thank you for visiting!</p>
            <p className="text-[11px]">Have a great day</p>
          </div>
        </div>

        {/* Modal Actions (Hidden on Print) */}
        <div className="no-print mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2.5 animate-slide-up">
          <button
            type="button"
            onClick={handlePrint}
            className="group h-11 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200/80 active:scale-[0.98] transition-all shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-600 group-hover:scale-105 transition-transform" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={onNewOrder}
            className="group h-11 rounded-xl bg-stone-900 hover:bg-black text-white font-extrabold text-xs flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Next Order</span>
            <PlusCircle className="w-3.5 h-3.5 text-stone-300 group-hover:scale-105 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
