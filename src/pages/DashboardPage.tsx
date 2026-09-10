import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchDashboardAnalytics, 
  calculateDateRange, 
  DateFilterType, 
  DashboardAnalyticsData 
} from '../services/analyticsService';
import { OrderWithItems } from '../types/database.types';
import { DateFilterBar } from '../components/dashboard/DateFilterBar';
import { KPICards } from '../components/dashboard/KPICard';
import { ProductSalesSection } from '../components/dashboard/ProductSalesSection';
import { SalesTrendChart } from '../components/dashboard/SalesTrendChart';
import { PaymentBreakdownCard } from '../components/dashboard/PaymentBreakdownCard';
import { BestSellerCard } from '../components/dashboard/BestSellerCard';
import { RecentOrdersTable } from '../components/dashboard/RecentOrdersTable';
import { DashboardEmptyState } from '../components/dashboard/DashboardEmptyState';
import { ReceiptModal } from '../components/pos/ReceiptModal';
import { clearAllOrders } from '../services/orderService';
import { RefreshCw, Download, Trash2 } from 'lucide-react';

interface DashboardPageProps {
  onGoToPOS: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onGoToPOS }) => {
  const [filterType, setFilterType] = useState<DateFilterType>('TODAY');
  const [customStart, setCustomStart] = useState(() => new Date().toISOString().split('T')[0]);
  const [customEnd, setCustomEnd] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderForReceipt, setSelectedOrderForReceipt] = useState<OrderWithItems | null>(null);

  const [analytics, setAnalytics] = useState<DashboardAnalyticsData | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const range = calculateDateRange(filterType, { start: customStart, end: customEnd });
    const data = await fetchDashboardAnalytics(range, filterType);
    setAnalytics(data);
    setLoading(false);
  }, [filterType, customStart, customEnd]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCustomDateChange = (start: string, end: string) => {
    setCustomStart(start);
    setCustomEnd(end);
    setFilterType('CUSTOM');
  };

  const handleExportCsv = () => {
    if (!analytics || analytics.recentOrders.length === 0) return;

    const headers = [
      'Order Number',
      'Order Date',
      'Order Time',
      'Product Code',
      'Product Name',
      'Quantity',
      'Unit Price',
      'Line Total',
      'Payment Method',
      'Order Total'
    ];

    const rows: string[] = [headers.join(',')];

    analytics.recentOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        rows.push([
          `"${order.order_number}"`,
          `"${order.order_date}"`,
          `"${order.order_time}"`,
          `"${item.product_code || ''}"`,
          `"${item.name || ''}"`,
          item.quantity,
          item.unit_price,
          item.line_total,
          `"${order.payment_method}"`,
          order.total_amount,
        ].join(','));
      });
    });

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chai_katta_sales_${filterType.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all sales data? This will remove all orders and reset the order counter back to CK-000001.')) {
      clearAllOrders();
      loadData();
    }
  };

  const hasOrders = (analytics?.kpis.totalOrders ?? 0) > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-3.5 sm:px-6 py-4 sm:py-6 pb-28 md:pb-12 space-y-6 animate-fade-in">
      {/* Top Header with Editorial Typography */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80">
        <div>
          <span className="editorial-eyebrow text-stone-400 block mb-1">
            CHAI KATTA • PERFORMANCE & METRICS
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
            Sales Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {hasOrders && (
            <>
              <button
                type="button"
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-white border border-stone-200 shadow-2xs hover:bg-stone-50 active:scale-95 transition-all svelte-spring-press"
              >
                <Download className="w-3.5 h-3.5 text-stone-500" />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                onClick={handleClearData}
                title="Clear all recorded sales data"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-stone-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-stone-200 shadow-2xs active:scale-95 transition-all svelte-spring-press"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-stone-700 bg-white border border-stone-200 shadow-2xs hover:bg-stone-50 active:scale-95 transition-all disabled:opacity-50 svelte-spring-press"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-stone-500 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <DateFilterBar
        currentFilter={filterType}
        customStartDate={customStart}
        customEndDate={customEnd}
        onSelectFilter={setFilterType}
        onCustomDateChange={handleCustomDateChange}
      />

      {/* Loading Skeleton or Content with Svelte Staggered Cascade */}
      {loading && !analytics ? (
        <div className="py-16 text-center text-stone-500 animate-svelte-fade">
          <RefreshCw className="w-6 h-6 animate-spin text-stone-600 mx-auto mb-2" />
          <p className="text-sm font-bold">Loading sales analytics...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          {/* KPI Summary Cards with Big Type */}
          <KPICards kpis={analytics.kpis} />

          {/* Conditional: Empty State or Visual Visualizations */}
          {!hasOrders ? (
            <DashboardEmptyState onGoToPOS={onGoToPOS} />
          ) : (
            <>
              {/* Product Sales Section: Table & Recharts Bar Chart */}
              <div className="animate-svelte-fly" style={{ animationDelay: '100ms' }}>
                <ProductSalesSection productSales={analytics.productSales} />
              </div>

              {/* Middle Row: Trend Chart & Payment Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-svelte-fly" style={{ animationDelay: '160ms' }}>
                <div className="lg:col-span-7">
                  <SalesTrendChart 
                    trendData={analytics.trend} 
                    filterType={filterType} 
                  />
                </div>
                <div className="lg:col-span-5">
                  <PaymentBreakdownCard 
                    paymentBreakdown={analytics.paymentBreakdown} 
                  />
                </div>
              </div>

              {/* Bottom Row: Best Sellers & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch animate-svelte-fly" style={{ animationDelay: '220ms' }}>
                <div className="lg:col-span-4 flex flex-col">
                  <BestSellerCard 
                    bestSelling={analytics.bestSellingProduct}
                    highestRevenue={analytics.highestRevenueProduct}
                  />
                </div>
                <div className="lg:col-span-8 flex flex-col">
                  <RecentOrdersTable
                    orders={analytics.recentOrders}
                    onSelectOrder={(order) => setSelectedOrderForReceipt(order)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      ) : null}

      {/* Reprint / View Receipt Modal from Dashboard */}
      {selectedOrderForReceipt && (
        <ReceiptModal
          order={selectedOrderForReceipt}
          onClose={() => setSelectedOrderForReceipt(null)}
          onNewOrder={() => {
            setSelectedOrderForReceipt(null);
            onGoToPOS();
          }}
        />
      )}
    </div>
  );
};
