import React from 'react';
import { IndianRupee, ShoppingCart, Coffee, TrendingUp } from 'lucide-react';
import { DashboardKPIs } from '../../services/analyticsService';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface KPICardProps {
  kpis: DashboardKPIs;
}

export const KPICards: React.FC<KPICardProps> = ({ kpis }) => {
  const cards: {
    title: string;
    rawValue: number;
    type: 'currency' | 'number';
    subtitle: string;
    icon: React.ElementType;
  }[] = [
    {
      title: 'TOTAL REVENUE',
      rawValue: kpis.totalRevenue,
      type: 'currency',
      subtitle: 'Gross period sales',
      icon: IndianRupee,
    },
    {
      title: 'TOTAL ORDERS',
      rawValue: kpis.totalOrders,
      type: 'number',
      subtitle: 'Completed transactions',
      icon: ShoppingCart,
    },
    {
      title: 'ITEMS SOLD',
      rawValue: kpis.itemsSold,
      type: 'number',
      subtitle: 'Total units dispensed',
      icon: Coffee,
    },
    {
      title: 'AVG ORDER VALUE',
      rawValue: kpis.averageOrderValue,
      type: 'currency',
      subtitle: 'Per transaction revenue',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="group bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/70 shadow-[0_1px_3px_rgba(0,0,0,0.03),0_6px_16px_rgba(0,0,0,0.03)] flex flex-col justify-between svelte-spring-hover hover:border-amber-900/30 hover:shadow-[0_8px_24px_rgba(120,53,15,0.08)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] relative overflow-hidden animate-svelte-fly ring-1 ring-black/[0.02]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="editorial-eyebrow text-stone-400 group-hover:text-stone-600 transition-colors">
                {card.title}
              </span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-stone-100/80 border border-stone-200/70 text-stone-700 group-hover:scale-110 group-hover:bg-amber-50 group-hover:text-amber-800 group-hover:border-amber-200/80 transition-all duration-300 shadow-2xs">
                <Icon className="w-4 h-4 stroke-[2.25]" />
              </div>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-stone-900 font-mono tracking-tight leading-none py-0.5 group-hover:translate-x-0.5 transition-transform duration-200 tabular-nums">
                <AnimatedNumber
                  value={card.rawValue}
                  type={card.type}
                  duration={750}
                />
              </div>
              <p className="text-xs text-stone-400 font-medium mt-1">
                {card.subtitle}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
