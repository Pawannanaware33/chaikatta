import React from 'react';
import { History, Receipt, ChevronRight } from 'lucide-react';
import { OrderWithItems } from '../../types/database.types';
import { formatCurrency, formatTime, formatDate } from '../../lib/formatters';

interface RecentOrdersTableProps {
  orders: OrderWithItems[];
  onSelectOrder: (order: OrderWithItems) => void;
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  orders,
  onSelectOrder,
}) => {
  // Guarantee strict descending order (latest / newest orders first)
  const sortedOrders = [...orders].sort((a, b) => {
    const dtA = `${a.order_date}T${a.order_time || '00:00:00'}`;
    const dtB = `${b.order_date}T${b.order_time || '00:00:00'}`;
    if (dtB !== dtA) {
      return dtB.localeCompare(dtA);
    }
    return (b.order_number || '').localeCompare(a.order_number || '');
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 shadow-xs flex flex-col h-[380px] sm:h-[410px] w-full transition-colors duration-200">
      <div className="flex items-center justify-between pb-3.5 border-b border-stone-100 mb-3 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-stone-900 text-base sm:text-lg tracking-tight flex items-center gap-2">
              <History className="w-4 h-4 text-stone-600" />
              <span>Order History</span>
            </h3>
            <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200/60">
              Newest first ↓
            </span>
            {sortedOrders.length > 5 && (
              <span className="hidden sm:inline-block text-[11px] font-medium text-stone-400">
                • Scroll to view all
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 font-medium mt-0.5">
            Click any row to preview or reprint receipt
          </p>
        </div>
        <span className="text-xs font-semibold text-stone-600 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60 flex-shrink-0">
          {sortedOrders.length} {sortedOrders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      {sortedOrders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-stone-400 text-xs">
          <History className="w-8 h-8 text-stone-300 mb-2 stroke-[1.5]" />
          <p className="font-medium">No orders found for this time period.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto rounded-xl border border-stone-200/70 bg-white">
          <table className="w-full text-left border-collapse min-w-[550px]">
            <thead className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-xs border-b border-stone-200/80 shadow-2xs">
              <tr className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-2.5 px-3">Order #</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-center">Payment</th>
                <th className="py-2.5 px-3 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {sortedOrders.map((order) => {
                const itemsSummary = (order.items || [])
                  .map((i) => `${i.name} × ${i.quantity}`)
                  .join(', ') || 'Item(s)';

                return (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-stone-50/90 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-900">
                      {order.order_number}
                    </td>

                    <td className="py-2.5 px-3 text-stone-600">
                      <div className="font-semibold text-stone-800">
                        {formatTime(order.order_time)}
                      </div>
                      <div className="text-[11px] text-stone-500 font-normal">
                        {formatDate(order.order_date || order.created_at)}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-medium text-stone-600 max-w-[220px] truncate" title={itemsSummary}>
                      {itemsSummary}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                      {formatCurrency(order.total_amount)}
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200/80">
                        {order.payment_method}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 group-hover:text-stone-900 transition-colors">
                        <Receipt className="w-3.5 h-3.5" />
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
