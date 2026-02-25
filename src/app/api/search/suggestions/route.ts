import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get("q") || "").toLowerCase().trim();

    if (!q) {
        return NextResponse.json([]);
    }

    const supabase = createPublicSupabaseClient();
    const suggestions = [];

    // 1. Check for Price Queries (e.g., "under 2000", "2500")
    const priceMatch = q.match(/(?:under|below|around|within)?\s*(\d{4,5})/);
    if (priceMatch) {
        const price = parseInt(priceMatch[1]);
        suggestions.push({
            type: "price",
            title: `Panjabi under ৳${price}`,
            url: `/shop/all?maxPrice=${price}`,
            keywords: ["price", "budget", price.toString()]
        });
    }

    // 2. Search SEO Landing Pages (Cities, Events)
    const { data: pages } = await supabase
        .from("seo_landing_pages")
        .select("slug, title, type")
        .or(`title.ilike.%${q}%,slug.ilike.%${q}%`)
        .eq("is_active", true)
        .limit(5);

    if (pages) {
        pages.forEach(page => {
            suggestions.push({
                type: "landing",
                title: page.title,
                url: `/${page.slug}`,
                category: page.type
            });
        });
    }

    // 2.5 Search Collections (Categories)
    const { data: collections } = await supabase
        .from("collections")
        .select("slug, title, image_url")
        .ilike("title", `%${q}%`)
        .eq("is_active", true)
        .limit(3);

    if (collections) {
        collections.forEach(col => {
            suggestions.push({
                type: "collection",
                title: col.title,
                url: `/shop/${col.slug}`,
                image: col.image_url
            });
        });
    }

    // 3. Search Products
    const { data: products } = await supabase
        .from("products")
        .select("id, title, slug, images, price, compare_at_price, code")
        .or(`title.ilike.%${q}%,code.ilike.%${q}%,seo_meta.ilike.%${q}%,color_label.ilike.%${q}%,fabric.ilike.%${q}%`)
        .eq("is_active", true)
        .limit(10);

    if (products) {
        products.forEach(product => {
            suggestions.push({
                type: "product",
                title: product.title,
                url: `/product/${product.slug}`,
                image: product.images[0],
                price: product.price,
                compare_at_price: product.compare_at_price,
                code: product.code
            });
        });
    }

    // Deduplicate and Sort: Direct landing matches first
    return NextResponse.json(suggestions);
}
