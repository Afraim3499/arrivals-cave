import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type SeoPage = Database["public"]["Tables"]["seo_landing_pages"]["Row"];

export const getRecentPosts = async (limit = 3) => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);

    if (error) return [];
    return data as BlogPost[];
};

export const getPostBySlug = async (slug: string) => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    if (error) return null;
    return data as BlogPost;
};

export const getPostsByCluster = async (
    cluster: "eid" | "price-city" | "style" | "sizing" | "general"
) => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("cluster", cluster)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    if (error) return [];
    return data as BlogPost[];
};

export const getSeoLandingPage = async (slug: string) => {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from("seo_landing_pages")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();

    if (error) return null;
    return data as SeoPage;
};

export const getBlogPosts = async () => {
    const supabase = await createServerSupabaseClient();
    // Portal needs both published and draft posts
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return { posts: [] };
    return { posts: data as BlogPost[] };
};
