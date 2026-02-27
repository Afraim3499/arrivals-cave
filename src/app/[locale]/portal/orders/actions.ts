"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { sendOrderEvents } from "@/lib/facebook-capi";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// We use the service role key to bypass RLS for inserting admin-level data if needed,
// but for simple public inserts, anon key is fine if RLS allows it.
// We'll use service role for robust order creation.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function createOrder(orderData: any, items: any[]) {
    try {
        // Generate a friendly ID (e.g. ORD-6X9P)
        const randomString = Math.random().toString(36).substring(2, 6).toUpperCase();
        const friendlyId = `ORD-${randomString}`;

        // 1. Insert the Order
        const { data: order, error: orderError } = await supabase
            .from("orders")
            .insert({
                friendly_id: friendlyId,
                customer_name: orderData.name,
                customer_phone: orderData.phone,
                customer_email: orderData.email || null,
                shipping_address: orderData.address,
                city: orderData.city,
                order_notes: orderData.notes || null,
                subtotal: orderData.subtotal,
                cashback_earned: orderData.cashback_earned,
                status: "Pending",
                cashback_status: "Pending"
            })
            .select()
            .single();

        if (orderError) throw new Error(orderError.message);

        // 2. Insert the Order Items
        const orderItemsData = items.map((item) => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.title,
            product_code: item.product.productCode || null,
            size: item.size,
            quantity: item.quantity,
            price: Math.round(item.product.price * 0.8), // Storing the applied 20% discount price
            image_url: item.product.images?.[0] || null
        }));

        const { error: itemsError } = await supabase
            .from("order_items")
            .insert(orderItemsData);

        if (itemsError) throw new Error(itemsError.message);

        // Fire Facebook CAPI events (non-blocking — errors are logged, never break orders)
        sendOrderEvents({
            name: orderData.name,
            phone: orderData.phone,
            email: orderData.email || null,
            city: orderData.city,
            subtotal: orderData.subtotal,
            friendlyId: friendlyId,
            items: items.map((item: any) => ({
                productId: item.product.id,
                productName: item.product.title,
                quantity: item.quantity,
            })),
        }).catch((err) => console.error("[FB CAPI] Order events failed:", err));

        return { success: true, friendlyId: friendlyId, orderId: order.id };
    } catch (error: any) {
        console.error("Failed to create order:", error);
        return { success: false, error: error.message };
    }
}

export async function trackOrder(friendlyId: string, phone: string) {
    try {
        const { data: order, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .eq("friendly_id", friendlyId)
            .eq("customer_phone", phone)
            .single();

        if (error || !order) {
            return { success: false, error: "Order not found. Please check your Order ID and Phone Number." };
        }

        return { success: true, order };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function getAdminOrders() {
    try {
        const { data: orders, error } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return { success: true, orders };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updateOrderStatus(orderId: string, status: string, cashbackStatus: string) {
    try {
        const { error } = await supabase
            .from("orders")
            .update({ status, cashback_status: cashbackStatus })
            .eq("id", orderId);

        if (error) throw new Error(error.message);

        revalidatePath("/[locale]/portal/orders");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
