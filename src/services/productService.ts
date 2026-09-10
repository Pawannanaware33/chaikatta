import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types/database.types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

/**
 * Service to manage products from Supabase
 */
export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_PRODUCTS;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('product_code', { ascending: true });

    if (error) {
      console.warn('Error fetching products from Supabase, using initial defaults:', error.message);
      return INITIAL_PRODUCTS;
    }

    if (!data || data.length === 0) {
      return INITIAL_PRODUCTS;
    }

    return data.map((item) => ({
      ...item,
      price: Number(item.price), // Ensure numeric value
    }));
  } catch (err) {
    console.warn('Network error fetching products, using initial defaults:', err);
    return INITIAL_PRODUCTS;
  }
}
