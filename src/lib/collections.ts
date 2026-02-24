import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export const getCollections = async () => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("collections")
        .select("*")
        .order("title", { ascending: true });

    if (error) {
        console.error("Error fetching collections:", error);
        return [];
    }

    return data as Collection[];
};

export const getCollectionBySlug = async (slug: string) => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) {
        return null;
    }

    return data as Collection;
};
