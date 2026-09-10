import React from 'react';
import { Coffee, ArrowRight } from 'lucide-react';

interface DashboardEmptyStateProps {
  onGoToPOS: () => void;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({ onGoToPOS }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-8 sm:p-12 text-center shadow-xs my-6 max-w-md mx-auto transition-colors duration-200">
      <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-4 border border-stone-200/60 transition-colors">
        <Coffee className="w-5 h-5 stroke-[1.75]" />
      </div>

      <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1.5 transition-colors">
        No sales recorded for this period
      </h3>

      <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6 leading-relaxed">
        Record orders from the POS terminal to view live metrics, product breakdowns, and sales trends.
      </p>

      <button
        type="button"
        onClick={onGoToPOS}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-medium text-xs hover:bg-stone-800 active:scale-95 transition-all shadow-xs"
      >
        <span>Open POS Register</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
