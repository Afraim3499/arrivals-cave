"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getPromoCodes() {
    try {
        const { data: promoCodes, error } = await supabase
            .from("promo_codes")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return { success: true, promoCodes };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function createPromoCode(code: string, discount_percent: number, is_active: boolean = true) {
    try {
        const { error } = await supabase
            .from("promo_codes")
            .insert({
                code: code.toUpperCase(),
                discount_percent,
                is_active,
            });

        if (error) throw new Error(error.message);

        revalidatePath("/[locale]/portal/promo-codes");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function updatePromoCodeStatus(id: string, is_active: boolean) {
    try {
        const { error } = await supabase
            .from("promo_codes")
            .update({ is_active })
            .eq("id", id);

        if (error) throw new Error(error.message);

        revalidatePath("/[locale]/portal/promo-codes");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deletePromoCode(id: string) {
    try {
        const { error } = await supabase
            .from("promo_codes")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);

        revalidatePath("/[locale]/portal/promo-codes");
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
