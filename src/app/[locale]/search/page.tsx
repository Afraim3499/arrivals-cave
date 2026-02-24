import { searchProducts } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generateHreflangMetadata } from "@/lib/seo";

interface SearchPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: SearchPageProps): Promise<Metadata> {
    const { locale } = await params;
    const sParams = await searchParams;
    const q = sParams.q as string || "";

    const title = locale === "bn"
        ? `"${q}" এর ফলাফল | Arrivals Cave`
        : `Search results for "${q}" | Arrivals Cave`;

    return {
        title,
        ...generateHreflangMetadata(`/search?q=${q}`)
    };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
    const { locale } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const q = sParams.q as string || "";

    const products = await searchProducts({
        q,
        sort: sParams.sort as any,
        minPrice: sParams.minPrice ? parseInt(sParams.minPrice as string) : undefined,
        maxPrice: sParams.maxPrice ? parseInt(sParams.maxPrice as string) : undefined,
        sizes: sParams.size ? (sParams.size as string).split(",") : undefined,
        
        inStock: sParams.inStock === "true",
    });

    const PAGE_CONFIG = {
        tag: "", // Not tag-based
        slug: "search",
        titleEN: `Search: ${q}`,
        titleBN: `অনুসন্ধান: ${q}`,
        h1EN: `Search Results for "${q}"`,
        h1BN: `"${q}" এর অনুসন্ধান ফলাফল`,
    };

    return (
        <TagCategoryPage
            config={PAGE_CONFIG}
            products={products}
            landing={null}
            locale={locale}
        />
    );
}
