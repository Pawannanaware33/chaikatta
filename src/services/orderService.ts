import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { CreateOrderInput, OrderWithItems } from '../types/database.types';

const STORAGE_KEY = 'chai_katta_orders_v2';

function loadPersistedOrders(): OrderWithItems[] {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Strictly remove any legacy demo orders
          return parsed.filter((o: OrderWithItems) => !o.id.startsWith('demo-'));
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load orders from localStorage:', e);
  }
  return [];
}

function savePersistedOrders(orders: OrderWithItems[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
    }
  } catch (e) {
    console.warn('Failed to save orders to localStorage:', e);
  }
}

function getNextOrderNumber(orders: OrderWithItems[]): string {
  let maxSeq = 0;
  orders.forEach((o) => {
    if (o.order_number && o.order_number.startsWith('CK-')) {
      const num = parseInt(o.order_number.replace('CK-', ''), 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  });
  return `CK-${String(maxSeq + 1).padStart(6, '0')}`;
}

// Persistent store initialized with 0 orders (all demo data cleared)
let localMockOrders: OrderWithItems[] = loadPersistedOrders();

export function getLocalMockOrders(): OrderWithItems[] {
  localMockOrders = loadPersistedOrders();
  return localMockOrders;
}

export function clearAllOrders(): void {
  localMockOrders = [];
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('chai_katta_orders'); // remove old key if present
  }
}

export function resetLocalOrders(): void {
  clearAllOrders();
}

/**
 * Creates an order atomically in Supabase PostgreSQL database (or persistent local store)
 */
export async function createOrder(
  input: CreateOrderInput
): Promise<{ success: boolean; order?: OrderWithItems; error?: string }> {
  const { payment_method, items } = input;

  // Validation
  if (!items || items.length === 0) {
    return { success: false, error: 'Cannot place an empty order. Please select at least one item.' };
  }

  for (const item of items) {
    if (item.quantity <= 0) {
      return { success: false, error: 'Product quantity must be greater than zero.' };
    }
  }

  // Calculate total
  const total_amount = items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);

  if (!isSupabaseConfigured) {
    // Current persistent orders
    const currentOrders = loadPersistedOrders();
    const orderNumber = getNextOrderNumber(currentOrders);
    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const orderTime = now.toTimeString().split(' ')[0];

    const mockOrder: OrderWithItems = {
      id: `local-${Date.now()}`,
      order_number: orderNumber,
      order_date: orderDate,
      order_time: orderTime,
      total_amount,
      payment_method,
      created_at: now.toISOString(),
      items: items.map((i, idx) => ({
        id: `local-item-${Date.now()}-${idx}`,
        product_id: i.product_id,
        name: i.name || '',
        quantity: i.quantity,
        unit_price: i.unit_price,
        line_total: i.quantity * i.unit_price,
      })),
    };

    // Save to persistent storage so refreshing the page NEVER loses orders
    currentOrders.unshift(mockOrder);
    savePersistedOrders(currentOrders);
    localMockOrders = currentOrders;

    return { success: true, order: mockOrder };
  }

  try {
    // Attempt transactional creation via PostgreSQL stored procedure
    const { data: rpcData, error: rpcError } = await supabase.rpc('create_order_atomic', {
      p_payment_method: payment_method,
      p_items: items,
    });

    if (!rpcError && rpcData) {
      return { success: true, order: rpcData as OrderWithItems };
    }

    if (rpcError) {
      console.warn('RPC create_order_atomic failed, falling back to direct table inserts:', rpcError.message);
    }

    // Fallback: Direct table inserts
    // Step 1: Generate human-readable order number
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    const orderSeq = (count ?? 0) + 1;
    const orderNumber = `CK-${String(orderSeq).padStart(6, '0')}`;

    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const orderTime = now.toTimeString().split(' ')[0];

    // Step 2: Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        order_date: orderDate,
        order_time: orderTime,
        total_amount,
        payment_method,
      })
      .select()
      .single();

    if (orderError || !orderData) {
      return {
        success: false,
        error: orderError?.message || 'Unable to save the order. Please check your connection and try again.',
      };
    }

    // Step 3: Insert order items
    const orderItemsToInsert = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
      line_total: item.quantity * item.unit_price,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)
      .select('*, products(name, product_code)');

    if (itemsError) {
      console.error('Error inserting order items:', itemsError);
      return {
        success: false,
        error: 'Unable to save order items. Please check your connection and try again.',
      };
    }

    const orderWithItems: OrderWithItems = {
      ...orderData,
      total_amount: Number(orderData.total_amount),
      items: (itemsData || []).map((oi: any) => ({
        id: oi.id,
        product_id: oi.product_id,
        name: oi.products?.name || '',
        product_code: oi.products?.product_code || '',
        quantity: oi.quantity,
        unit_price: Number(oi.unit_price),
        line_total: Number(oi.line_total),
      })),
    };

    return { success: true, order: orderWithItems };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown database error';
    return {
      success: false,
      error: `Unable to save the order. Please check your connection and try again. (${msg})`,
    };
  }
}

/**
 * Fetches recent orders for receipt viewing or dashboard
 */
export async function getRecentOrders(limit = 20): Promise<OrderWithItems[]> {
  if (!isSupabaseConfigured) {
    return getLocalMockOrders().slice(0, limit);
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        items:order_items (
          id,
          product_id,
          quantity,
          unit_price,
          line_total,
          products (name, product_code)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.warn('Error fetching recent orders:', error?.message);
      return getLocalMockOrders().slice(0, limit);
    }

    return data.map((order: any) => ({
      ...order,
      total_amount: Number(order.total_amount),
      items: (order.items || []).map((oi: any) => ({
        id: oi.id,
        product_id: oi.product_id,
        name: oi.products?.name || '',
        product_code: oi.products?.product_code || '',
        quantity: oi.quantity,
        unit_price: Number(oi.unit_price),
        line_total: Number(oi.line_total),
      })),
    }));
  } catch {
    return localMockOrders.slice(0, limit);
  }
}
