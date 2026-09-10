import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  Cell 
} from 'recharts';
import { ProductSaleMetric } from '../../services/analyticsService';
import { PRODUCT_ICONS } from '../../data/initialProducts';
import { formatCurrency } from '../../lib/formatters';
import { BarChart3, Table as TableIcon } from 'lucide-react';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface ProductSalesSectionProps {
  productSales: ProductSaleMetric[];
}

export const ProductSalesSection: React.FC<ProductSalesSectionProps> = ({ productSales }) => {
  const [activeChart, setActiveChart] = useState<'quantity' | 'revenue'>('quantity');

  // Sophisticated minimal palette
  const chartColors = ['#292524', '#44403c', '#57534e', '#78716c', '#a8a29e', '#78350f'];

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-6 shadow-xs svelte-spring-hover hover:shadow-warm transition-all duration-300 space-y-5 sm:space-y-6">
      {/* Header & Chart Mode Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-stone-100">
        <div>
          <span className="editorial-eyebrow text-stone-400 block mb-0.5">
            ITEM DISPENSATION
          </span>
          <h3 className="font-black text-stone-900 text-base sm:text-xl tracking-tight flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-stone-700" />
            <span>Product Sales</span>
          </h3>
          <p className="text-xs text-stone-400 font-medium">
            Menu item volume and revenue performance
          </p>
        </div>

        {/* Minimal Toggle between Quantity Sold & Revenue Charts */}
        <div className="flex items-center gap-1 bg-stone-100/90 p-0.5 sm:p-1 rounded-xl border border-stone-200/70 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveChart('quantity')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all duration-150 active:scale-95 svelte-spring-press ${
              activeChart === 'quantity'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Quantity Sold
          </button>
          <button
            type="button"
            onClick={() => setActiveChart('revenue')}
            className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg font-bold text-[11px] sm:text-xs transition-all duration-150 active:scale-95 svelte-spring-press ${
              activeChart === 'revenue'
                ? 'bg-white text-stone-900 shadow-xs border border-stone-200/80'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Revenue (₹)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Table View (Cols 5) */}
        <div className="lg:col-span-5 overflow-x-auto">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TableIcon className="w-3.5 h-3.5" />
            <span>Item Performance</span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-[10px] sm:text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2">Product</th>
                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-right">Qty Sold</th>
                <th className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {productSales.map((p) => {
                const icon = PRODUCT_ICONS[p.productCode] || '☕';
                return (
                  <tr key={p.productCode} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2 px-1.5 sm:py-2.5 sm:px-2 font-medium text-stone-800 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
                      <span className="text-sm sm:text-base">{icon}</span>
                      <span className="truncate">{p.name}</span>
                    </td>
                    <td className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-right font-mono font-semibold text-stone-600">
                      <AnimatedNumber value={p.quantitySold} type="number" duration={450} />
                    </td>
                    <td className="py-2 px-1.5 sm:py-2.5 sm:px-2 text-right font-mono font-bold text-stone-900">
                      <AnimatedNumber value={p.revenue} type="currency" duration={450} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Visual Chart View (Cols 7) */}
        <div className="lg:col-span-7 bg-stone-50/60 p-3 sm:p-4 rounded-xl border border-stone-200/60 transition-colors">
          <div className="text-xs font-semibold text-stone-600 mb-3 sm:mb-4 flex items-center justify-between">
            <span>
              {activeChart === 'quantity' ? 'Units Sold by Product' : 'Revenue by Product'}
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productSales} margin={{ top: 10, right: 10, left: -20, bottom: 35 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#78716C', fontWeight: 500 }}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  tickFormatter={(val: string) => val.length > 9 ? `${val.slice(0, 8)}…` : val}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#78716C' }}
                  tickFormatter={(val) => activeChart === 'revenue' ? `₹${val}` : val}
                />
                <Tooltip
                  formatter={(val: number) => [
                    activeChart === 'revenue' ? formatCurrency(val) : `${val} units`,
                    activeChart === 'revenue' ? 'Revenue' : 'Units Sold',
                  ]}
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
                <Bar 
                  dataKey={activeChart === 'quantity' ? 'quantitySold' : 'revenue'} 
                  radius={[4, 4, 0, 0]}
                >
                  {productSales.map((entry, index) => (
                    <Cell 
                      key={`cell-${entry.productCode}`} 
                      fill={chartColors[index % chartColors.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
