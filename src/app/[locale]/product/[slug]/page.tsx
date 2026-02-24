import { getProductBySlug } from "@/lib/products";
import { ProductDetails } from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { MoreProducts } from "@/components/product/MoreProducts";
import { ProductStory } from "@/components/product/ProductStory";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { generatePageMeta } from "@/lib/seo";
import { Metadata } from "next";
import { generateProductJsonLd } from "@/lib/schema";

interface ProductPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 1800; // 30 mins

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return {};

    const isEN = locale === "en";

    // Use seo_title from DB if available, otherwise fallback
    const title = product.seo_title
        || (isEN ? product.title : (product.title_bn || product.title));

    // Use seo_meta from DB if available, otherwise fallback
    const description = product.seo_meta
        || (isEN ? product.description : (product.description_bn || product.description));

    return generatePageMeta({
        title: title.includes("Arrivals Cave") ? title : `${title} | Arrivals Cave`,
        description: description || "",
        path: `/product/${slug}`,
        locale,
        image: product.images[0],
        type: "article"
    });
}

export async function generateStaticParams() {
    const { routing } = await import("@/i18n/routing");
    const { createPublicSupabaseClient } = await import("@/lib/supabase/public-server");

    const supabase = createPublicSupabaseClient();
    const { data } = await supabase.from("products").select("slug").eq("is_active", true);

    return routing.locales.flatMap((locale) =>
        (data ?? []).map((p) => ({ locale, slug: p.slug }))
    );
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const product = await getProductBySlug(slug);
    if (!product) notFound();

    const jsonLd = generateProductJsonLd(product, locale);
    const isEN = locale === "en";

    // Use seo_title as H1 if available
    const h1Title = product.seo_title
        || (isEN ? product.title : (product.title_bn || product.title));

    return (
        <div className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs
                items={[
                    { label: isEN ? "Products" : "পণ্যসমূহ", href: "/shop/all" },
                    { label: isEN ? product.title : (product.title_bn || product.title), href: `/product/${slug}` },
                ]}
            />

            {/* Product Details — Purchase Section */}
            <div className="container mx-auto px-4 py-8">
                <ProductDetails product={product} seoTitle={h1Title} />
            </div>

            {/* Editorial Story Section */}
            <ProductStory
                story={product.story_markdown || product.description || ""}
                uspBullets={product.usp_bullets || []}
                images={product.images}
                productTitle={product.title}
            />

            {/* FAQ Block — City Keyword SEO */}
            <ProductFAQ productTitle={product.title} />

            {/* Related Products — Same collection, with backfill */}
            <RelatedProducts
                currentProductId={product.id}
                collectionId={product.collection_id || ""}
            />

            {/* Shop All — Sitewide product discovery grid */}
            <MoreProducts
                currentProductId={product.id}
                locale={locale}
            />
        </div>
    );
}
