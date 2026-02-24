import { getProductsByCollection, getCollectionBySlug, searchProducts } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateCollectionJsonLd } from "@/lib/schema";

interface CollectionPageProps {
    params: Promise<{ locale: string; slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
    const { locale, slug } = await params;

    // Special "all" virtual collection
    if (slug === "all") {
        return generatePageMeta({
            title: locale === "en" ? "All Products - Arrivals Cave" : "সকল পণ্য - Arrivals Cave",
            description: locale === "en"
                ? "Browse our complete collection of premium panjabi designs."
                : "আমাদের সম্পূর্ণ প্রিমিয়াম পাঞ্জাবি কালেকশন দেখুন।",
            path: `/collection/all`,
            locale,
            type: "website"
        });
    }

    const collection = await getCollectionBySlug(slug);
    if (!collection) return {};

    const isEN = locale === "en";
    const title = isEN ? collection.title : (collection.title_bn || collection.title);
    const description = isEN ? collection.description : (collection.description_bn || collection.description);

    return generatePageMeta({
        title: `${title} Collection - Arrivals Cave`,
        description: description || "",
        path: `/collection/${slug}`,
        locale,
        image: collection.image_url || undefined,
        type: "website"
    });
}

export async function generateStaticParams() {
    const { routing } = await import("@/i18n/routing");
    const { createPublicSupabaseClient } = await import("@/lib/supabase/public-server");

    const supabase = createPublicSupabaseClient();
    const { data } = await supabase.from("collections").select("slug").eq("is_active", true);

    // Include the virtual "all" slug
    const slugs = [...(data ?? []).map((c) => c.slug), "all"];

    return routing.locales.flatMap((locale) =>
        slugs.map((slug) => ({ locale, slug }))
    );
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
    const { locale, slug } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const isAllProducts = slug === "all";
    const isEN = locale === "en";

    let title: string;
    let description: string;
    let products;

    const filterOptions = {
        sort: sParams.sort as "newest" | "price_asc" | "price_desc" | "best_sellers" | undefined,
        minPrice: sParams.minPrice ? parseInt(sParams.minPrice as string) : undefined,
        maxPrice: sParams.maxPrice ? parseInt(sParams.maxPrice as string) : undefined,
        sizes: sParams.size ? (sParams.size as string).split(",") : undefined,
        
        inStock: sParams.inStock === "true",
    };

    if (isAllProducts) {
        title = isEN ? "All Products" : "সকল পণ্য";
        description = isEN
            ? "Browse our complete collection of premium panjabi designs."
            : "আমাদের সম্পূর্ণ প্রিমিয়াম পাঞ্জাবি কালেকশন দেখুন।";
        products = await searchProducts(filterOptions);
    } else {
        const collection = await getCollectionBySlug(slug);
        if (!collection) {
            notFound();
        }

        title = isEN ? collection.title : collection.title_bn || collection.title;
        description = isEN ? collection.description || "" : collection.description_bn || collection.description || "";
        products = await getProductsByCollection(collection.id, filterOptions);

        const jsonLd = generateCollectionJsonLd(collection, products, locale);

        return (
            <div className="pb-20">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />

                <Breadcrumbs items={[{ label: title }]} />

                <div className="bg-muted/30 py-12 md:py-20 mb-12 border-b border-border">
                    <Container>
                        <SectionHeading title={title} subtitle={description} center className="mb-0" />
                    </Container>
                </div>

                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24">
                                <FilterSidebar />
                            </div>
                        </aside>
                        <main className="lg:col-span-3">
                            <SortBar totalItems={products.length} />
                            <ProductGrid products={products} />
                        </main>
                    </div>
                </Container>
            </div>
        );
    }

    // Render for "all" products (no JSON-LD for virtual collection)
    return (
        <div className="pb-20">
            <Breadcrumbs items={[{ label: title }]} />

            <div className="bg-muted/30 py-12 md:py-20 mb-12 border-b border-border">
                <Container>
                    <SectionHeading title={title} subtitle={description} center className="mb-0" />
                </Container>
            </div>

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <FilterSidebar />
                        </div>
                    </aside>
                    <main className="lg:col-span-3">
                        <SortBar totalItems={products.length} />
                        <ProductGrid products={products} />
                    </main>
                </div>
            </Container>
        </div>
    );
}
