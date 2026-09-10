import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { SalesTrendPoint, DateFilterType } from '../../services/analyticsService';
import { formatCurrency } from '../../lib/formatters';
import { TrendingUp } from 'lucide-react';
interface SalesTrendChartProps {
  trendData: SalesTrendPoint[];
  filterType: DateFilterType;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ trendData, filterType }) => {
  const isHourly = filterType === 'TODAY' || filterType === 'YESTERDAY';
  const subtitle = isHourly ? 'Revenue trend by hour' : 'Revenue trend by day';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 shadow-xs svelte-spring-hover hover:shadow-warm transition-all duration-300">
      <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
        <div>
          <span className="editorial-eyebrow text-stone-400 block mb-0.5">
            REVENUE VELOCITY
          </span>
          <h3 className="font-black text-stone-900 text-lg sm:text-xl tracking-tight flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-stone-700" />
            <span>Sales Trend</span>
          </h3>
          <p className="text-xs text-stone-400 font-medium">{subtitle}</p>
        </div>
      </div>

      {trendData.length === 0 ? (
        <div className="py-12 text-center text-stone-500 text-xs font-medium">
          No sales recorded in this timeframe to plot trend.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="chaiTrendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#292524" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#292524" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#78716C', fontWeight: 500 }}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#78716C' }}
                tickFormatter={(val) => `₹${val}`}
              />
              <Tooltip
                formatter={(val: number) => [formatCurrency(val), 'Revenue']}
                labelFormatter={(label) => isHourly ? `Time: ${label}` : `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  borderColor: '#E7E5E4',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  color: '#1C1917',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: '#1C1917',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#292524"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#chaiTrendGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
