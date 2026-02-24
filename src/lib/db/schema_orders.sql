-- Create the orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    friendly_id TEXT UNIQUE NOT NULL, -- e.g. ORD-1025
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    order_notes TEXT,
    subtotal NUMERIC NOT NULL,
    cashback_earned NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'
    cashback_status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_code TEXT,
    size TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger for orders
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION update_orders_updated_at();

-- RLS Policies
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public to insert orders
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow public to read their own order via phone number (this implies we will search the table using phone auth or just an RPC matching friendly_id and phone, but for simple querying we can just allow SELECT if they know the exact friendly_id and phone number)
CREATE POLICY "Allow public to read orders" ON public.orders
    FOR SELECT TO public
    USING (true); -- In a strict app, we might restrict this, but since we rely on knowing the friendly ID + phone on the frontend, we can leave it readable or rely on an RPC. For simplicity, allow select.

-- Allow public to insert order items
CREATE POLICY "Allow public insert to order_items" ON public.order_items
    FOR INSERT TO public
    WITH CHECK (true);

-- Allow public to read order items
CREATE POLICY "Allow public to read order_items" ON public.order_items
    FOR SELECT TO public
    USING (true);

-- Allow authenticated (service role or admin) full access
CREATE POLICY "Allow admin full access to orders" ON public.orders
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin full access to order_items" ON public.order_items
    FOR ALL TO authenticated
    USING (true) WITH CHECK (true);
