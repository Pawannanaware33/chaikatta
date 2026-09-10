import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { getLocalMockOrders } from './orderService';
import { OrderWithItems } from '../types/database.types';

export type DateFilterType = 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'THIS_MONTH' | 'CUSTOM';

export interface DateRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export interface DashboardKPIs {
  totalRevenue: number;
  totalOrders: number;
  itemsSold: number;
  averageOrderValue: number;
}

export interface ProductSaleMetric {
  productId: string;
  productCode: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface SalesTrendPoint {
  label: string;
  revenue: number;
  orders: number;
}

export interface PaymentMetric {
  method: 'Cash' | 'UPI';
  revenue: number;
  orders: number;
  percentage: number;
}

export interface DashboardAnalyticsData {
  kpis: DashboardKPIs;
  productSales: ProductSaleMetric[];
  trend: SalesTrendPoint[];
  paymentBreakdown: {
    cash: PaymentMetric;
    upi: PaymentMetric;
  };
  bestSellingProduct: {
    name: string;
    quantity: number;
  } | null;
  highestRevenueProduct: {
    name: string;
    revenue: number;
  } | null;
  recentOrders: OrderWithItems[];
}

/**
 * Computes start and end dates based on standard filter options
 */
export function calculateDateRange(
  filter: DateFilterType,
  customRange?: { start: string; end: string }
): DateRange {
  const now = new Date();
  const formatYMD = (d: Date) => d.toISOString().split('T')[0];

  if (filter === 'CUSTOM' && customRange) {
    return {
      startDate: customRange.start,
      endDate: customRange.end,
    };
  }

  const todayStr = formatYMD(now);

  if (filter === 'TODAY') {
    return { startDate: todayStr, endDate: todayStr };
  }

  if (filter === 'YESTERDAY') {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yStr = formatYMD(yesterday);
    return { startDate: yStr, endDate: yStr };
  }

  if (filter === 'THIS_WEEK') {
    // Last 7 days
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    return { startDate: formatYMD(weekStart), endDate: todayStr };
  }

  if (filter === 'THIS_MONTH') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return { startDate: formatYMD(monthStart), endDate: todayStr };
  }

  return { startDate: todayStr, endDate: todayStr };
}

/**
 * Helper to process raw order rows into comprehensive dashboard analytics
 */
function processOrdersToAnalytics(
  ordersData: OrderWithItems[],
  filterType: DateFilterType,
  dateRange: DateRange
): DashboardAnalyticsData {
  let totalRevenue = 0;
  let itemsSold = 0;
  let cashRevenue = 0;
  let cashOrders = 0;
  let upiRevenue = 0;
  let upiOrders = 0;

  // Initialize product statistics for all 6 official products
  const productStatsMap = new Map<string, { quantity: number; revenue: number; name: string; id: string }>();
  INITIAL_PRODUCTS.forEach((p) => {
    productStatsMap.set(p.product_code, {
      id: p.id,
      name: p.name,
      quantity: 0,
      revenue: 0,
    });
  });

  // Trend grouping map
  const trendMap = new Map<string, { revenue: number; orders: number }>();

  ordersData.forEach((order) => {
    const amount = Number(order.total_amount) || 0;
    totalRevenue += amount;

    if (order.payment_method === 'Cash') {
      cashRevenue += amount;
      cashOrders += 1;
    } else if (order.payment_method === 'UPI') {
      upiRevenue += amount;
      upiOrders += 1;
    }

    // Trend Key: by hour if 1 day, else by day
    let trendKey = '';
    if (filterType === 'TODAY' || filterType === 'YESTERDAY' || dateRange.startDate === dateRange.endDate) {
      const timePart = order.order_time || '00:00:00';
      const hour = timePart.split(':')[0];
      trendKey = `${hour}:00`;
    } else {
      const d = new Date(order.order_date);
      trendKey = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    }

    const existingTrend = trendMap.get(trendKey) || { revenue: 0, orders: 0 };
    existingTrend.revenue += amount;
    existingTrend.orders += 1;
    trendMap.set(trendKey, existingTrend);

    // Process items
    (order.items || []).forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const lineTot = Number(item.line_total) || 0;
      
      // Match by product_code or product_id or name
      const pCode = item.product_code || 
        INITIAL_PRODUCTS.find(p => p.id === item.product_id || p.name.toLowerCase() === item.name.toLowerCase())?.product_code;

      itemsSold += qty;

      if (pCode && productStatsMap.has(pCode)) {
        const stats = productStatsMap.get(pCode)!;
        stats.quantity += qty;
        stats.revenue += lineTot;
      } else if (pCode) {
        productStatsMap.set(pCode, {
          id: item.product_id,
          name: item.name || 'Product',
          quantity: qty,
          revenue: lineTot,
        });
      }
    });
  });

  const totalOrders = ordersData.length;
  const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const productSales: ProductSaleMetric[] = Array.from(productStatsMap.entries()).map(([code, data]) => ({
    productId: data.id,
    productCode: code,
    name: data.name,
    quantitySold: data.quantity,
    revenue: data.revenue,
  }));

  // Best selling and highest revenue calculation
  let bestSelling: { name: string; quantity: number } | null = null;
  let highestRevenue: { name: string; revenue: number } | null = null;

  productSales.forEach((p) => {
    if (p.quantitySold > 0) {
      if (!bestSelling || p.quantitySold > bestSelling.quantity) {
        bestSelling = { name: p.name, quantity: p.quantitySold };
      }
    }
    if (p.revenue > 0) {
      if (!highestRevenue || p.revenue > highestRevenue.revenue) {
        highestRevenue = { name: p.name, revenue: p.revenue };
      }
    }
  });

  // Payment Breakdown
  const cashPercentage = totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0;
  const upiPercentage = totalRevenue > 0 ? 100 - cashPercentage : 0;

  // Trend Array
  const trend: SalesTrendPoint[] = Array.from(trendMap.entries()).map(([label, val]) => ({
    label,
    revenue: val.revenue,
    orders: val.orders,
  }));

  // Sort trend chronologically
  trend.sort((a, b) => a.label.localeCompare(b.label));

  // Explicit descending sort: newest orders first (CK-000105, CK-000104...)
  const sortedRecentOrders = [...ordersData].sort((a, b) => {
    const dtA = `${a.order_date}T${a.order_time || '00:00:00'}`;
    const dtB = `${b.order_date}T${b.order_time || '00:00:00'}`;
    if (dtB !== dtA) {
      return dtB.localeCompare(dtA);
    }
    return (b.order_number || '').localeCompare(a.order_number || '');
  });

  return {
    kpis: {
      totalRevenue,
      totalOrders,
      itemsSold,
      averageOrderValue,
    },
    productSales,
    trend,
    paymentBreakdown: {
      cash: {
        method: 'Cash',
        revenue: cashRevenue,
        orders: cashOrders,
        percentage: cashPercentage,
      },
      upi: {
        method: 'UPI',
        revenue: upiRevenue,
        orders: upiOrders,
        percentage: upiPercentage,
      },
    },
    bestSellingProduct: bestSelling,
    highestRevenueProduct: highestRevenue,
    recentOrders: sortedRecentOrders,
  };
}

/**
 * Fetches analytics with live Supabase support and local demo fallback
 */
export async function fetchDashboardAnalytics(
  dateRange: DateRange,
  filterType: DateFilterType
): Promise<DashboardAnalyticsData> {
  const emptyResult: DashboardAnalyticsData = {
    kpis: { totalRevenue: 0, totalOrders: 0, itemsSold: 0, averageOrderValue: 0 },
    productSales: INITIAL_PRODUCTS.map((p) => ({
      productId: p.id,
      productCode: p.product_code,
      name: p.name,
      quantitySold: 0,
      revenue: 0,
    })),
    trend: [],
    paymentBreakdown: {
      cash: { method: 'Cash', revenue: 0, orders: 0, percentage: 0 },
      upi: { method: 'UPI', revenue: 0, orders: 0, percentage: 0 },
    },
    bestSellingProduct: null,
    highestRevenueProduct: null,
    recentOrders: [],
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          order_date,
          order_time,
          total_amount,
          payment_method,
          created_at,
          order_items (
            id,
            product_id,
            quantity,
            unit_price,
            line_total,
            products (name, product_code)
          )
        `)
        .gte('order_date', dateRange.startDate)
        .lte('order_date', dateRange.endDate)
        .order('order_date', { ascending: true })
        .order('order_time', { ascending: true });

      if (!error && data && data.length > 0) {
        const mappedOrders: OrderWithItems[] = data.map((o: any) => ({
          ...o,
          total_amount: Number(o.total_amount),
          items: (o.order_items || []).map((oi: any) => ({
            id: oi.id,
            product_id: oi.product_id,
            name: oi.products?.name || '',
            product_code: oi.products?.product_code || '',
            quantity: Number(oi.quantity),
            unit_price: Number(oi.unit_price),
            line_total: Number(oi.line_total),
          })),
        }));

        return processOrdersToAnalytics(mappedOrders, filterType, dateRange);
      }
    } catch (e) {
      console.warn('Supabase analytics query error, checking local store:', e);
    }
  }

  // Local / Demo Store Fallback
  const allOrders = getLocalMockOrders();
  const filtered = allOrders.filter(
    (o) => o.order_date >= dateRange.startDate && o.order_date <= dateRange.endDate
  );

  if (filtered.length === 0) {
    return emptyResult;
  }

  // Sort ascending for chronological trend
  filtered.sort((a, b) => {
    const da = `${a.order_date}T${a.order_time}`;
    const db = `${b.order_date}T${b.order_time}`;
    return da.localeCompare(db);
  });

  return processOrdersToAnalytics(filtered, filterType, dateRange);
}
