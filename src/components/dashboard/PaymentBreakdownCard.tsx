import React from 'react';
import { Banknote, QrCode, CreditCard } from 'lucide-react';
import { PaymentMetric } from '../../services/analyticsService';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface PaymentBreakdownCardProps {
  paymentBreakdown: {
    cash: PaymentMetric;
    upi: PaymentMetric;
  };
}

export const PaymentBreakdownCard: React.FC<PaymentBreakdownCardProps> = ({ paymentBreakdown }) => {
  const { cash, upi } = paymentBreakdown;
  const totalRev = cash.revenue + upi.revenue;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div>
            <h3 className="font-bold text-stone-900 text-lg tracking-tight flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-stone-600" />
              <span>Payment Methods</span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">Cash vs. UPI Collection</p>
          </div>
        </div>

        {/* Visual Ratio Bar */}
        <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden flex mb-5 border border-stone-200/80">
          <div 
            style={{ width: `${cash.percentage}%` }} 
            className="h-full bg-stone-900 transition-all duration-300"
            title={`Cash: ${cash.percentage}%`}
          />
          <div 
            style={{ width: `${upi.percentage}%` }} 
            className="h-full bg-stone-500 transition-all duration-300"
            title={`UPI: ${upi.percentage}%`}
          />
        </div>

        {/* Comparison Details */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {/* CASH */}
          <div className="p-3 sm:p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                <Banknote className="w-3.5 h-3.5 text-stone-600" />
                <span>Cash</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold font-mono text-stone-700 bg-stone-200/70 px-1.5 py-0.5 rounded">
                <AnimatedNumber value={cash.percentage} type="percent" duration={500} />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-stone-900 font-mono transition-colors tabular-nums">
              <AnimatedNumber value={cash.revenue} type="currency" duration={500} />
            </div>
            <div className="text-[10.5px] sm:text-[11px] text-stone-500 mt-0.5">
              <AnimatedNumber value={cash.orders} type="number" duration={400} /> {cash.orders === 1 ? 'order' : 'orders'}
            </div>
          </div>

          {/* UPI */}
          <div className="p-3 sm:p-4 rounded-xl bg-stone-50/70 border border-stone-200/70 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                <QrCode className="w-3.5 h-3.5 text-stone-600" />
                <span>UPI</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold font-mono text-stone-700 bg-stone-200/70 px-1.5 py-0.5 rounded">
                <AnimatedNumber value={upi.percentage} type="percent" duration={500} />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-stone-900 font-mono transition-colors tabular-nums">
              <AnimatedNumber value={upi.revenue} type="currency" duration={500} />
            </div>
            <div className="text-[10.5px] sm:text-[11px] text-stone-500 mt-0.5">
              <AnimatedNumber value={upi.orders} type="number" duration={400} /> {upi.orders === 1 ? 'order' : 'orders'}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-stone-100 text-xs text-stone-500 text-center">
        Total Recorded: <strong className="text-stone-800 font-mono font-bold"><AnimatedNumber value={totalRev} type="currency" duration={500} /></strong>
      </div>
    </div>
  );
};
