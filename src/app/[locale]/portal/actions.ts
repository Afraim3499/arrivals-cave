"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Product Actions
export async function saveProduct(formData: any) {
    const supabase = await createServerSupabaseClient();

    // Basic validation extracted from form
    const isUpdating = !!formData.id;
    const productData = {
        ...formData,
        // ensure tags and usp_bullets are arrays
        tags: Array.isArray(formData.tags) ? formData.tags : formData.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        usp_bullets: Array.isArray(formData.usp_bullets) ? formData.usp_bullets : (formData.usp_bullets ? formData.usp_bullets.split("\n").map((b: string) => b.trim()).filter(Boolean) : []),
    };

    // Images are already an array in formData and should be saved directly to the DB

    let result;
    if (isUpdating) {
        result = await supabase
            .from("products")
            .update(productData)
            .eq("id", formData.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from("products")
            .insert(productData)
            .select()
            .single();
    }

    if (result.error) {
        return { error: result.error.message };
    }

    // Handle Dynamic Cache Revalidation
    // 1. Revalidate the product's specific page
    revalidatePath(`/[locale]/product/${productData.slug}`, 'page');

    // 2. Revalidate the linked collection page
    if (productData.collection_id) {
        const { data: collection } = await supabase.from('collections').select('slug').eq('id', productData.collection_id).single();
        if (collection) {
            revalidatePath(`/[locale]/collection/${collection.slug}`, 'page');
        }
    }

    // 3. Revalidate style/tag pages
    if (productData.tags && productData.tags.length > 0) {
        productData.tags.forEach((tag: string) => {
            // Very naive dynamic revalidation - essentially hits all potential virtual routes
            revalidatePath(`/[locale]/${tag}-panjabi`, 'page');
            revalidatePath(`/[locale]/${tag}`, 'page');
        });
    }

    // 4. Revalidate campaign clusters
    if (productData.is_eid_pick) {
        revalidatePath(`/[locale]/eid-panjabi-collection`, 'page');
    }

    if (productData.is_best_seller || productData.is_new_arrival) {
        revalidatePath(`/[locale]`, 'page'); // Homepage
        // City pages usually show best sellers
        revalidatePath(`/[locale]/panjabi-price-[slug]`, 'page');
    }

    return { success: true, data: result.data };
}

export async function deleteProduct(id: string) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return { error: error.message };

    // Normally you'd want to revalidate here too, keeping it simple for now
    revalidatePath("/", "layout"); // Revalidate broadly on delete to be safe
    return { success: true };
}
