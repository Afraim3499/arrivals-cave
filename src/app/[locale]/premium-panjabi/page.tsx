import { getProductsByTag, getProductsByTagDefault, isDefaultFilter, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "premium",
    slug: "premium-panjabi",
    titleEN: "Premium Panjabi",
    titleBN: "প্রিমিয়াম পাঞ্জাবি",
    h1EN: "Exclusive Premium Panjabi Collection",
    h1BN: "এক্সক্লুসিভ প্রিমিয়াম পাঞ্জাবি কালেকশন",
};

interface PremiumPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "Premium Panjabi - Arrivals Cave" : "প্রিমিয়াম পাঞ্জাবি - অ্যারাইভালস কেভ",
        description: isEN
            ? "Discover our exclusive premium Panjabi collection. High-quality fabrics, exceptional craftsmanship, and luxury designs at Arrivals Cave."
            : "অ্যারাইভালস কেভ-এ আমাদের এক্সক্লুসিভ প্রিমিয়াম পাঞ্জাবি কালেকশন দেখুন। উচ্চমানের ফেব্রিক, সুনিপুণ কারুকার্য এবং লাক্সারি ডিজাইন।",
        path: `/${PAGE_CONFIG.slug}`,
        locale,
    });
}

export default async function PremiumPage({ params, searchParams }: PremiumPageProps) {
    const { locale } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const filterOptions = {
        sort: sParams.sort as any,
        minPrice: sParams.minPrice ? parseInt(sParams.minPrice as string) : undefined,
        maxPrice: sParams.maxPrice ? parseInt(sParams.maxPrice as string) : undefined,
        sizes: sParams.size ? (sParams.size as string).split(",") : undefined,
        inStock: sParams.inStock === "true",
    };

    const products = isDefaultFilter(filterOptions)
        ? await getProductsByTagDefault(PAGE_CONFIG.tag)
        : await getProductsByTag(PAGE_CONFIG.tag, filterOptions);

    const landing = await getSEOLandingPage(PAGE_CONFIG.slug);

    const isEN = locale === "en";
    const faqData = isEN ? landing?.faq_items : landing?.faq_items_bn;
    const faqJsonLd = faqData ? generateFAQJsonLd(faqData as any) : null;

    return (
        <div className="min-h-screen">
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}
            <TagCategoryPage
                config={PAGE_CONFIG}
                products={products}
                landing={landing}
                locale={locale}
            />
        </div>
    );
}
