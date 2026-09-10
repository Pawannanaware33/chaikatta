import { Product } from '../types/database.types';

export interface ProductDisplayConfig {
  icon: string;
  image: string;
  category: string;
  description: string;
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p001-tea-id',
    product_code: 'P001',
    name: 'Tea',
    price: 15,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p002-lemon-tea-id',
    product_code: 'P002',
    name: 'Lemon Tea',
    price: 20,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p003-black-tea-id',
    product_code: 'P003',
    name: 'Black Tea',
    price: 15,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p004-coffee-id',
    product_code: 'P004',
    name: 'Coffee',
    price: 20,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p005-black-coffee-id',
    product_code: 'P005',
    name: 'Black Coffee',
    price: 20,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p006-water-bottle-id',
    product_code: 'P006',
    name: 'Water Bottle',
    price: 10,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p007-biscuit-id',
    product_code: 'P007',
    name: 'Biscuit',
    price: 5,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p008-small-cigarette-id',
    product_code: 'P008',
    name: 'Small Cigarette',
    price: 15,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'p009-big-cigarette-id',
    product_code: 'P009',
    name: 'Big Cigarette',
    price: 25,
    active: true,
    created_at: '2026-09-01T00:00:00Z',
    updated_at: '2026-09-01T00:00:00Z',
  },
];

export const PRODUCT_ICONS: Record<string, string> = {
  P001: '☕',
  P002: '🍋',
  P003: '🫖',
  P004: '☕',
  P005: '☕',
  P006: '💧',
  P007: '🍪',
  P008: '🚬',
  P009: '🚬',
};

