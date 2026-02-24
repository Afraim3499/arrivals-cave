import { MetadataRoute } from "next";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { routing } from "@/i18n/routing";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscave.com";
    const supabase = createPublicSupabaseClient();
    const locales = routing.locales;

    // Fetch dynamic content
    const [{ data: products }, { data: collections }, { data: blogPosts }] = await Promise.all([
        supabase.from("products").select("slug, updated_at").eq("is_active", true),
        supabase.from("collections").select("slug").eq("is_active", true),
        supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
    ]);

    const routes: MetadataRoute.Sitemap = [];

    // Static & Special Routes (pre-locale)
    const staticPaths = [
        "",
        "/premium-panjabi",
        "/eid-panjabi-collection",
        "/eid-premium-embroidered-panjabi",
        "/embroidered-panjabi",
        "/short-panjabi",
        "/black-panjabi",
        "/white-panjabi",
        "/cotton-panjabi",
        "/silk-panjabi",
        "/blog",
        "/contact",
        "/size-guide",
        "/delivery-return",
    ];

    const cityLandingPages = [
        "/panjabi-price-in-bangladesh",
        "/panjabi-price-in-dhaka",
        "/panjabi-price-in-chattogram",
        "/panjabi-price-in-sylhet",
        "/panjabi-price-in-coxs-bazar",
    ];

    // Generate entries for each locale
    locales.forEach((locale) => {
        // Base & Special paths
        [...staticPaths, ...cityLandingPages].forEach((path) => {
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: path === "" ? 1 : 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                    ),
                },
            });
        });

        // Collections
        collections?.forEach((c) => {
            const path = `/shop/${c.slug}`;
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: new Date(),
                changeFrequency: "weekly",
                priority: 0.9,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                    ),
                },
            });
        });

        // Products
        products?.forEach((p) => {
            const path = `/product/${p.slug}`;
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
                changeFrequency: "daily",
                priority: 0.8,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                    ),
                },
            });
        });

        // Blog Posts
        blogPosts?.forEach((b) => {
            const path = `/blog/${b.slug}`;
            routes.push({
                url: `${baseUrl}/${locale}${path}`,
                lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
                changeFrequency: "monthly",
                priority: 0.6,
                alternates: {
                    languages: Object.fromEntries(
                        locales.map((l) => [l, `${baseUrl}/${l}${path}`])
                    ),
                },
            });
        });
    });

    return routes;
}
