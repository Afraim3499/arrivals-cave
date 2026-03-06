import {
    getProductsByCollection,
    getCollectionBySlug,
    searchProducts,
    getCollections,
    getAllProductsDefault,
    getProductsByCollectionDefault,
    isDefaultFilter,
} from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateCollectionJsonLd } from "@/lib/schema";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShopPageProps {
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
            path: `/shop/all`,
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
        title: `${title} - Shop Arrivals Cave`,
        description: description || "",
        path: `/shop/${slug}`,
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

export default async function ShopPage({ params, searchParams }: ShopPageProps) {
    const { locale, slug } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const isAllProducts = slug === "all";
    const isEN = locale === "en";

    let title: string;
    let description: string;
    let products: any[] = [];
    let collection: any = null;

    // Fetch all active collections to display as navigation links in the FilterSidebar
    const allCollections = await getCollections();

    const filterOptions = {
        sort: sParams.sort as "newest" | "price_asc" | "price_desc" | "best_sellers" | undefined,
        minPrice: sParams.minPrice ? parseInt(sParams.minPrice as string) : undefined,
        maxPrice: sParams.maxPrice ? parseInt(sParams.maxPrice as string) : undefined,
        sizes: sParams.size ? (sParams.size as string).split(",") : undefined,
        inStock: sParams.inStock === "true",
    };

    // Use cached default queries when no filters are active (bots, organic traffic)
    // Fall back to uncached searchProducts for filtered requests
    const useDefaultPath = isDefaultFilter(filterOptions);

    if (isAllProducts) {
        title = isEN ? "All Products" : "সকল পণ্য";
        description = isEN
            ? "Browse our complete collection of premium panjabi designs."
            : "আমাদের সম্পূর্ণ প্রিমিয়াম পাঞ্জাবি কালেকশন দেখুন।";
        products = useDefaultPath
            ? await getAllProductsDefault()
            : await searchProducts(filterOptions);
    } else {
        collection = await getCollectionBySlug(slug);
        if (!collection) {
            notFound();
        }

        title = isEN ? collection.title : collection.title_bn || collection.title;
        description = isEN ? collection.description || "" : collection.description_bn || collection.description || "";
        products = useDefaultPath
            ? await getProductsByCollectionDefault(collection.id)
            : await getProductsByCollection(collection.id, filterOptions);
    }

    // Common SEO stats extraction 
    const prices = products ? products.map((p: any) => p.price) : [];
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    const availableSizes = new Set<string>();
    products?.forEach((p: any) => {
        if (p.stock_by_size) {
            Object.keys(p.stock_by_size).forEach(s => availableSizes.add(s));
        }
    });
    const sizesList = Array.from(availableSizes).sort((a, b) => {
        const order = ["M", "L", "XL", "XXL"];
        return order.indexOf(a) - order.indexOf(b);
    });
    const finalSizes = sizesList.length > 0 ? sizesList : ["M", "L", "XL", "XXL"];

    const dynamicSeoText = isEN
        ? `Explore our exclusive ${title} collection, featuring the finest premium Panjabi to buy in Bangladesh. Crafted for comfort and style with high-quality fabrics, these Panjabis come in sizes ${finalSizes.join(", ")}.${products.length > 0 ? (minPrice === maxPrice ? ` Panjabi prices start at ৳${minPrice.toLocaleString()}.` : ` Panjabi prices range from ৳${minPrice.toLocaleString()} to ৳${maxPrice.toLocaleString()}.`) : ""}`
        : `আমাদের এক্সক্লুসিভ ${title} কালেকশনটি দেখুন। বাংলাদেশে কেনার জন্য সেরা প্রিমিয়াম পাঞ্জাবি। আরামদায়ক ফ্যাব্রিকস দিয়ে তৈরি এই পাঞ্জাবিগুলো ${finalSizes.join(", ")} সাইজে পাওয়া যাচ্ছে।${products.length > 0 ? (minPrice === maxPrice ? ` মূল্য শুরু ৳${minPrice.toLocaleString()} থেকে।` : ` মূল্য সীমানা ৳${minPrice.toLocaleString()} থেকে ৳${maxPrice.toLocaleString()}।`) : ""}`;

    const jsonLd = collection ? generateCollectionJsonLd(collection, products, locale) : null;
    const heroImage = collection?.image_url || products?.[0]?.images?.[0];

    return (
        <div className="pb-20">
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}

            <Breadcrumbs items={[{ label: title }]} />

            <div className="border-b border-border bg-neutral-50 dark:bg-neutral-900/20 mb-8 pt-8 pb-12">
                <Container>
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                        {/* 1:1 Structured Image */}
                        {heroImage && (
                            <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 aspect-square relative rounded-2xl overflow-hidden shadow-sm bg-neutral-100 border border-border">
                                <Image
                                    src={heroImage as string}
                                    alt={title}
                                    fill
                                    className="object-cover object-center"
                                    priority
                                />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                            </div>
                        )}

                        {/* Semantic Details & SEO Text */}
                        <div className="flex-1 space-y-6 pt-4">
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                                {title}
                            </h1>

                            <div className="prose prose-stone text-muted-foreground prose-lg max-w-none">
                                {description && <p>{description}</p>}
                                <p>{dynamicSeoText}</p>
                            </div>

                            {/* Quick Summary Strip */}
                            <div className="flex flex-wrap gap-3 mt-4">
                                <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                    <span className="text-muted-foreground">Products:</span> {products?.length || 0}
                                </div>
                                <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                    <span className="text-muted-foreground">Sizes:</span> {finalSizes.join(", ")}
                                </div>
                                {products.length > 0 && (
                                    <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                        <span className="text-muted-foreground">Price:</span> ৳{minPrice.toLocaleString()} - ৳{maxPrice.toLocaleString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container>
                {/* Fast Category Navigation (Pills) */}
                <div className="flex overflow-x-auto gap-3 pb-4 mb-6 scrollbar-hide snap-x md:hidden -mx-4 px-4 lg:mx-0 lg:px-0">
                    <Link
                        href="/shop/all"
                        className={cn(
                            "flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start border",
                            slug === "all" ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-foreground border-border hover:bg-muted"
                        )}
                    >
                        {isEN ? "Shop All" : "সব দেখুন"}
                    </Link>
                    {allCollections.map((coll) => (
                        <Link
                            key={coll.id}
                            href={`/shop/${coll.slug}`}
                            className={cn(
                                "flex-none px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap snap-start border",
                                slug === coll.slug ? "bg-primary text-primary-foreground border-primary shadow-md" : "bg-card text-foreground border-border hover:bg-muted"
                            )}
                        >
                            {isEN ? coll.title : (coll.title_bn || coll.title)}
                        </Link>
                    ))}
                </div>

                {/* Mobile Filter Trigger */}
                <div className="flex lg:hidden mb-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" className="w-full flex items-center justify-center gap-2 rounded-full py-6 text-base font-medium shadow-sm border-border">
                                <SlidersHorizontal className="w-5 h-5" />
                                {isEN ? "Filter & Sort" : "ফিল্টার ও সর্ট"}
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl overflow-y-auto px-6 pt-10 pb-20">
                            <SheetTitle className="sr-only">Filters</SheetTitle>
                            <FilterSidebar currentCollectionSlug={slug} collections={allCollections} />
                            <div className="sticky bottom-0 left-0 right-0 pt-4 pb-2 bg-background/80 backdrop-blur-md mt-6">
                                <SheetTrigger asChild>
                                    <Button className="w-full rounded-full py-6 text-base">
                                        {isEN ? `View Results (${products.length})` : `ফলাফল দেখুন (${products.length})`}
                                    </Button>
                                </SheetTrigger>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            <FilterSidebar currentCollectionSlug={slug} collections={allCollections} />
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
