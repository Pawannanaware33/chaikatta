# ☕ CHAI KATTA — Mobile POS & Sales Analytics Dashboard

A simple, fast, commercial-grade, mobile-first Point of Sale (POS) and Business Analytics Dashboard designed for daily operational use at **CHAI KATTA** tea shop.

---

## 🌟 Key Features

### 1. Mobile-First POS Terminal (`/pos`)
- **Fast Touch Order Entry**: Optimized for mobile touchscreens (tested on 320px, 375px, 390px, and 430px viewports without horizontal scrolling).
- **Official 6-Product Menu**:
  1. **Tea** — ₹15 (☕ Masala/Cutting Chai)
  2. **Lemon Tea** — ₹20 (🍋 Fresh Citrus Infused)
  3. **Black Tea** — ₹15 (🫖 Amber Aromatic Brew)
  4. **Coffee** — ₹20 (☕ South Indian Filter Coffee)
  5. **Black Coffee** — ₹20 (☕ Rich Espresso / Americano)
  6. **Water Bottle** — ₹10 (💧 Mineral Water)
  *(Strictly no generic "Other" product)*
- **Touch-Friendly Controls**: Minimum 44px touch targets on `+` and `−` quantity buttons.
- **Quantity Zero-Clamping**: Cannot decrement below 0; minus button automatically disables and dims at 0.
- **Real-Time Dynamic Cart**: Displays only products with quantity > 0, live line totals, and instant total amount calculation formatted in Indian Rupees (e.g. `TOTAL ₹70`).
- **Payment Mode Selection**: Clear, high-contrast toggle between **CASH** (default) and **UPI**.
- **Mobile Sticky Action Bar**: Displays selected items count and total price with a one-tap "View & Pay" shortcut above the bottom navigation bar.
- **Double-Submission Protection**: Submit button locks in `Processing Order...` state during submission, preventing duplicate transactions.
- **Atomic Order Submission**: Orders and order items are committed in a single atomic transaction.
- **Reliable Error Handling**: If database submission fails, displays `"Unable to save the order. Please check your connection and try again."` and **preserves the cart**.
- **Web Audio API Confirmation Chime**: Synthesizes a pleasant dual-tone harmonic chime after verified database save (zero external audio files; non-blocking fail-safe).
- **Thermal Printable Receipt**:
  - Formatted to shop specifications with dashed lines, order number, date, time, itemized breakdown, total, and "Thank You! Visit Again".
  - One-click browser print integration (`window.print()`) with specialized thermal paper print styles (`@media print`).

---

### 2. Business Analytics Dashboard (`/dashboard`)
- **Interactive Date Filters**:
  - `[ TODAY ]`
  - `[ YESTERDAY ]`
  - `[ THIS WEEK ]`
  - `[ THIS MONTH ]`
  - `[ CUSTOM RANGE ]` (with start and end date pickers)
  - All metrics, charts, and tables dynamically re-calculate for the selected date window.
- **Dashboard KPI Cards**:
  - **Total Revenue** (INR formatted, e.g. `₹4,230`)
  - **Total Orders** count
  - **Items Sold** volume
  - **Average Order Value (AOV)**
- **Product Sales Analytics**:
  - Itemized table showing all 6 products with Quantity Sold and Revenue.
  - Interactive Recharts Bar Chart toggling between **Quantity Sold** and **Revenue (₹)**.
- **Sales Revenue Trend Chart**:
  - Hourly trend (`08:00`, `09:00`...) for Today & Yesterday filters.
  - Daily trend (`01 Sep`, `02 Sep`...) for This Week, This Month, and Custom Ranges.
  - Rendered using Recharts AreaChart with warm tea-brew amber gradient.
- **Payment Method Breakdown**:
  - Compares **Cash** vs. **UPI** collection.
  - Displays revenue, order counts, percentage shares, and comparison progress bar.
- **Dynamic Top Performers**:
  - 🏆 **Best Selling Product** (highest quantity sold).
  - 🔥 **Highest Revenue Product** (highest monetary collection).
- **Descending Order History**:
  - Orders are strictly displayed in **descending chronological order** (most recent orders first: `CK-000105`, `CK-000104`...).
  - Shows order number, date, time, items breakdown, amount, and payment badge.
  - Clicking any order opens the receipt modal for viewing and reprinting.
- **Empty State Safeguard**:
  - If no sales occurred in a selected range, cleanly displays `₹0` / `0` with a prompt to record orders in the POS instead of NaN or broken charts.

---

## 🏗️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (custom warm Indian tea-shop palette, custom shadows, and print styling)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Audio**: Web Audio API (native browser synthesis)
- **Backend / Database**: Supabase (PostgreSQL)
- **Business Intelligence**: Normalized relational data model ready for direct Power BI consumption

---

## 🗄️ Database Architecture (Supabase / PostgreSQL)

### Relational Model

```
PRODUCTS (1) ──────────< ORDER_ITEMS >────────── (1) ORDERS
```

### Table Definitions

1. **`products`**:
   - `id` (`UUID`, Primary Key, `DEFAULT gen_random_uuid()`)
   - `product_code` (`TEXT`, Unique, Not Null, e.g. `'P001'`)
   - `name` (`TEXT`, Not Null, e.g. `'Tea'`)
   - `price` (`NUMERIC(10, 2)`, Not Null, `CHECK (price >= 0)`)
   - `active` (`BOOLEAN`, Not Null, `DEFAULT true`)
   - `created_at` (`TIMESTAMPTZ`, `DEFAULT now()`)
   - `updated_at` (`TIMESTAMPTZ`, `DEFAULT now()`)

2. **`orders`**:
   - `id` (`UUID`, Primary Key, `DEFAULT gen_random_uuid()`)
   - `order_number` (`TEXT`, Unique, Not Null, e.g. `'CK-000001'`)
   - `order_date` (`DATE`, Not Null, `DEFAULT CURRENT_DATE`)
   - `order_time` (`TIME`, Not Null, `DEFAULT CURRENT_TIME`)
   - `total_amount` (`NUMERIC(10, 2)`, Not Null, `CHECK (total_amount >= 0)`)
   - `payment_method` (`TEXT`, Not Null, `CHECK (payment_method IN ('Cash', 'UPI'))`)
   - `created_at` (`TIMESTAMPTZ`, `DEFAULT now()`)

3. **`order_items`**:
   - `id` (`UUID`, Primary Key, `DEFAULT gen_random_uuid()`)
   - `order_id` (`UUID`, Foreign Key → `orders.id` `ON DELETE CASCADE`)
   - `product_id` (`UUID`, Foreign Key → `products.id` `ON DELETE RESTRICT`)
   - `quantity` (`INTEGER`, Not Null, `CHECK (quantity > 0)`)
   - `unit_price` (`NUMERIC(10, 2)`, Not Null, `CHECK (unit_price >= 0)`)
   - `line_total` (`NUMERIC(10, 2)`, Not Null, `CHECK (line_total >= 0)`)
   - `created_at` (`TIMESTAMPTZ`, `DEFAULT now()`)

### Transactional Function & Sequence
- Sequence: `order_number_seq` auto-generates sequential order IDs (`CK-000001`, `CK-000002`...).
- Stored Procedure: `create_order_atomic(p_payment_method, p_items)` commits order headers and line items in a single transaction with automatic rollback on error.
- Indexes on `orders(order_date)`, `orders(created_at)`, `order_items(order_id)`, and `order_items(product_id)`.

---

## 📊 Power BI Compatibility

The database has been designed for zero-friction ingestion into Power BI:
- Prices and amounts are stored as unformatted `NUMERIC(10, 2)` values (e.g. `15.00` not `"₹15"`).
- Quantities are stored as clean `INTEGER` values.
- Dates and timestamps are stored in standard ISO formats (`DATE`, `TIME`, `TIMESTAMPTZ`).
- A pre-built flat reporting view `view_bi_sales_flat` is included in `supabase/schema.sql` for instant drag-and-drop report building in Power BI.

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
*(Only the public `anon` key is used; the `service_role` key is never exposed on the client.)*

> **Note**: The application includes an in-memory resilient mock store with realistic historical orders across Today, Yesterday, This Week, and This Month, so you can run, test, and place orders immediately even before connecting to live Supabase!

### 3. Initialize Supabase Database
1. Open your project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Paste and run the contents of `supabase/schema.sql`.
4. (Optional) Run `supabase/seed_demo_data.sql` to populate realistic multi-day test sales.

### 4. Run Development Server
```bash
npm run dev
```
Open in browser:
- **Local**: `http://localhost:5173/`
- **Network (Mobile Testing)**: `http://<your-local-ip>:5173/`

### 5. Build for Production
```bash
npm run build
```

---

## 🧪 Acceptance Test Cases

| Test | Flow | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **TEST 1** | Tea × 2, Coffee × 1, Water Bottle × 2, UPI | Total = ₹70, Unique Order #, Receipt generated, Sound played, Cart reset | **PASS ✓** |
| **TEST 2** | Tea × 3, Cash | Total = ₹45, Cash +₹45, Tea volume +3 | **PASS ✓** |
| **TEST 3** | Black Tea × 2, Lemon Tea × 1 | Black Tea = ₹30, Lemon Tea = ₹20, Total = ₹50 | **PASS ✓** |
| **TEST 4** | Date Filters (Today, Yesterday, Week, Month, Custom) | All KPIs, charts, payment split, and recent orders update dynamically | **PASS ✓** |
| **TEST 5** | Order History Sorting | Transactions strictly ordered descending (newest first) | **PASS ✓** |#   c h a i k a t t a  
 #   c h a i k a t t a  
 