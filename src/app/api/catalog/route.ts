import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { getProductPrices } from "@/lib/products";
import { NextResponse } from "next/server";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscavebd.com";
    const supabase = createPublicSupabaseClient();

    // Fetch all active products with their collection data
    const { data: products, error } = await supabase
        .from("products")
        .select("*, collection:collections(*)")
        .eq("is_active", true);

    if (error) {
        console.error("Error fetching products for catalog:", error);
        return new NextResponse("Error fetching products", { status: 500 });
    }

    // Generate XML content
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Arrivals Cave Product Catalog</title>
        <description>Complete product feed for Arrivals Cave Bangladesh</description>
        <link>${baseUrl}</link>`;

    products?.forEach((product) => {
        const { currentPrice, originalPrice } = getProductPrices(product);
        const isEid = product.is_eid_pick || product.tags?.includes("eid");

        // Better Title Fallback
        const title = product.seo_title || product.title;

        // Better Description Fallback
        let description = product.seo_meta || product.description;
        if (!description && product.story_markdown) {
            // Strip markdown for the feed description
            description = product.story_markdown.replace(/[#*`_]/g, "").slice(0, 160);
        }
        if (!description) {
            description = `${title} - Premium Panjabi for Men. Handcrafted with ${product.fabric || "Premium Fabric"} in ${product.color_label || "Classic Colors"}. Perfect for Eid 2026.`;
        }

        const mainImage = product.images[0]?.startsWith("http")
            ? product.images[0]
            : `${baseUrl}${product.images[0]}`;

        xml += `
        <item>
            <g:id>${product.slug}</g:id>
            <g:title><![CDATA[${title}]]></g:title>
            <g:description><![CDATA[${description}]]></g:description>
            <g:link>${baseUrl}/en/product/${product.slug}</g:link>
            <g:image_link>${mainImage}</g:image_link>
            <g:condition>new</g:condition>
            <g:availability>in_stock</g:availability>
            <g:price>${originalPrice}.00 BDT</g:price>
            <g:sale_price>${currentPrice}.00 BDT</g:sale_price>
            <g:brand>Arrivals Cave</g:brand>
            <g:google_product_category>166</g:google_product_category>
            <g:product_type><![CDATA[Clothing > Panjabi]]></g:product_type>
            ${isEid ? `<g:custom_label_0>Eid</g:custom_label_0>` : ""}
            <g:color><![CDATA[${product.color_label}]]></g:color>
            <g:material><![CDATA[${product.fabric}]]></g:material>
        </item>`;
    });

    xml += `
    </channel>
</rss>`;

    return new NextResponse(xml, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
        },
    });
}
