"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveHomeSettings(formData: any) {
    const supabase = await createServerSupabaseClient();

    // The data comes in as a JS object.
    const isUpdating = !!formData.id;

    // Remove any client-only state if doing object spreading, 
    // but here we just take the formData directly
    let result;

    if (isUpdating) {
        result = await supabase
            .from("home_settings")
            .update(formData)
            .eq("id", formData.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from("home_settings")
            .insert(formData)
            .select()
            .single();
    }

    if (result.error) {
        return { error: result.error.message };
    }

    // Revalidate the Home Page cache so changes appear immediately
    revalidatePath("/", "layout");
    revalidatePath("/[locale]", "page");

    return { success: true, data: result.data };
}
