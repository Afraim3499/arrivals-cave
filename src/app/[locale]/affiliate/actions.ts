"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getAffiliateStats(code: string) {
    try {
        if (!code) return { success: false, error: "Please enter a code" };
        
        const cleanCode = code.toUpperCase().trim();

        // 1. Verify if the code is a valid promo code first
        const { data: promoCode, error: promoError } = await supabase
            .from("promo_codes")
            .select("*")
            .eq("code", cleanCode)
            .single();

        if (promoError || !promoCode) {
            return { success: false, error: "Promo code not found or invalid" };
        }

        // 2. Fetch all orders that used this code
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("id, friendly_id, created_at, status, subtotal, customer_name, customer_city")
            .eq("promo_code", cleanCode)
            .order("created_at", { ascending: false });

        if (ordersError) throw new Error(ordersError.message);

        // 3. Calculate statistics
        const totalUses = orders.length;
        
        const confirmedOrders = orders.filter(order => 
            // In Arrivals Cave, valid statuses that count towards successful commissions
            order.status === "Confirmed" || 
            order.status === "Dispatched" || 
            order.status === "Delivered"
        );
        
        const confirmedSalesCount = confirmedOrders.length;
        
        // Sum the subtotal for confirmed orders
        const totalSalesAmount = confirmedOrders.reduce((sum, order) => sum + (order.subtotal || 0), 0);
        
        // Affiliate commission is 10% of the checkout bill for confirmed orders
        const estimatedCommission = Math.round(totalSalesAmount * 0.10);

        return { 
            success: true, 
            stats: {
                totalUses,
                confirmedSalesCount,
                totalSalesAmount,
                estimatedCommission,
                discountPercent: promoCode.discount_percent
            },
            recentOrders: orders.slice(0, 50) // Return up to 50 most recent
        };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to fetch stats" };
    }
}
