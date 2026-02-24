"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveSeoPage(formData: any) {
    const supabase = await createServerSupabaseClient();

    const isUpdating = !!formData.id;

    // Transform data
    const pageData = {
        ...formData,
        // FAQ is managed via state array, ensure it is passed correctly
        faq_items: Array.isArray(formData.faq_items) ? formData.faq_items : [],
        // Parse comma separated linked concepts
        linked_collection_slugs: formData.linked_collection_slugsInput ? formData.linked_collection_slugsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        linked_city_slugs: formData.linked_city_slugsInput ? formData.linked_city_slugsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        linked_tags: formData.linked_tagsInput ? formData.linked_tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    };

    // Clean raw inputs
    delete pageData.linked_collection_slugsInput;
    delete pageData.linked_city_slugsInput;
    delete pageData.linked_tagsInput;

    let result;
    if (isUpdating) {
        result = await supabase
            .from("seo_landing_pages")
            .update(pageData)
            .eq("id", formData.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from("seo_landing_pages")
            .insert(pageData)
            .select()
            .single();
    }

    if (result.error) {
        return { error: result.error.message };
    }

    // Revalidate specific SEO page route based on type
    if (pageData.page_type === 'city') {
        revalidatePath(`/[locale]/${pageData.slug}`, 'page');
    } else if (pageData.page_type === 'eid') {
        revalidatePath(`/[locale]/${pageData.slug}`, 'page');
    } else if (pageData.page_type === 'style') {
        revalidatePath(`/[locale]/${pageData.slug}`, 'page');
    }

    return { success: true, data: result.data };
}
