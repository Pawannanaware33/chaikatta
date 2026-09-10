import React from 'react';
import { Trophy } from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface BestSellerCardProps {
  bestSelling: { name: string; quantity: number } | null;
  highestRevenue: { name: string; revenue: number } | null;
}

export const BestSellerCard: React.FC<BestSellerCardProps> = ({
  bestSelling,
  highestRevenue,
}) => {
  return (
    <div className="bg-white text-stone-900 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between border border-stone-200/80 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ease-out h-full w-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-stone-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Top Performers
            </h3>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
            Live
          </span>
        </div>

        <div className="space-y-3">
          {/* Best Selling by Volume */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mb-1 uppercase tracking-wider">
              <span>Best Selling (Units)</span>
            </div>
            {bestSelling ? (
              <div>
                <div className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  {bestSelling.name}
                </div>
                <div className="text-xs text-stone-600 font-mono font-semibold mt-0.5">
                  <AnimatedNumber value={bestSelling.quantity} type="number" duration={500} /> units sold
                </div>
              </div>
            ) : (
              <div className="text-xs text-stone-500">No sales recorded yet</div>
            )}
          </div>

          {/* Highest Revenue */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70">
            <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium mb-1 uppercase tracking-wider">
              <span>Highest Revenue</span>
            </div>
            {highestRevenue ? (
              <div>
                <div className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                  {highestRevenue.name}
                </div>
                <div className="text-xs text-stone-600 font-mono font-semibold mt-0.5">
                  <AnimatedNumber value={highestRevenue.revenue} type="currency" duration={500} /> generated
                </div>
              </div>
            ) : (
              <div className="text-xs text-stone-500">No sales recorded yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500 text-center">
        Computed from order line items
      </div>
    </div>
  );
};
