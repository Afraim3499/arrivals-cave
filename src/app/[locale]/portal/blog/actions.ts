"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveBlogPost(formData: any) {
    const supabase = await createServerSupabaseClient();

    const isUpdating = !!formData.id;

    const postData = {
        ...formData,
        tags: formData.tagsInput ? formData.tagsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        linked_product_slugs: formData.linked_productsInput ? formData.linked_productsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        linked_collection_slugs: formData.linked_collectionsInput ? formData.linked_collectionsInput.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
    };

    delete postData.tagsInput;
    delete postData.linked_productsInput;
    delete postData.linked_collectionsInput;

    // Set published_at if publishing for the first time
    if (postData.is_published && !postData.published_at) {
        postData.published_at = new Date().toISOString();
    } else if (!postData.is_published) {
        postData.published_at = null;
    }

    let result;
    if (isUpdating) {
        result = await supabase
            .from("blog_posts")
            .update(postData)
            .eq("id", formData.id)
            .select()
            .single();
    } else {
        result = await supabase
            .from("blog_posts")
            .insert(postData)
            .select()
            .single();
    }

    if (result.error) {
        return { error: result.error.message };
    }

    // Revalidate routes
    revalidatePath(`/[locale]/blog`, 'page');
    if (postData.slug) {
        revalidatePath(`/[locale]/blog/${postData.slug}`, 'page');
    }

    return { success: true, data: result.data };
}
