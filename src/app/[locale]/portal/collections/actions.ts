"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveCollection(formData: any) {
    const supabase = await createServerSupabaseClient();

    const isUpdating = !!formData.id;
    const collectionData = { ...formData };

    let result;
    if (isUpdating) {
        result = await supabase
            .from("collections")
            .update(collectionData)
            .eq("id", formData.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from("collections")
            .insert(collectionData)
            .select()
            .single();
    }

    if (result.error) {
        return { error: result.error.message };
    }

    // Revalidate entire generic store and specific collection page
    revalidatePath(`/[locale]/collection/${collectionData.slug}`, 'page');
    revalidatePath(`/[locale]`, 'page'); // Might affect homepage nav/grids

    return { success: true, data: result.data };
}
