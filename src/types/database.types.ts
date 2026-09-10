export type PaymentMethod = 'Cash' | 'UPI';

export interface Product {
  id: string;
  product_code: string;
  name: string;
  price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  order_date: string;
  order_time: string;
  total_amount: number;
  payment_method: PaymentMethod;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  created_at: string;
}

export interface OrderItemDetail {
  id?: string;
  product_id: string;
  name: string;
  product_code?: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface OrderWithItems extends Order {
  items: OrderItemDetail[];
}

export interface CreateOrderInput {
  payment_method: PaymentMethod;
  items: {
    product_id: string;
    name?: string;
    quantity: number;
    unit_price: number;
  }[];
}
