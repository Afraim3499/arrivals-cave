import { getProductsByTag, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "kabli",
    slug: "kabli-panjabi",
    titleEN: "Kabli Panjabi",
    titleBN: "কাবলি পাঞ্জাবি",
    h1EN: "Exclusive Kabli Panjabi & Kurta Collection",
    h1BN: "এক্সক্লুসিভ কাবলি পাঞ্জাবি ও কুর্তা কালেকশন",
};

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "Kabli Panjabi - Arrivals Cave" : "কাবলি পাঞ্জাবি - অ্যারাইভালস কেভ",
        description: isEN
            ? "Discover our exclusive Kabli Panjabi and Kurta collection. Traditional elegance combined with modern craftsmanship at Arrivals Cave."
            : "অ্যারাইভালস কেভ-এ আমাদের এক্সক্লুসিভ কাবলি পাঞ্জাবি এবং কুর্তা কালেকশন দেখুন। ঐতিহ্যের সাথে আধুনিক কারুকার্যের অনন্য সমন্বয়।",
        path: `/${PAGE_CONFIG.slug}`,
        locale,
    });
}

export default async function Page({ params, searchParams }: PageProps) {
    const { locale } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const products = await getProductsByTag(PAGE_CONFIG.tag, {
        sort: sParams.sort as any,
        minPrice: sParams.minPrice ? parseInt(sParams.minPrice as string) : undefined,
        maxPrice: sParams.maxPrice ? parseInt(sParams.maxPrice as string) : undefined,
        sizes: sParams.size ? (sParams.size as string).split(",") : undefined,
        
        inStock: sParams.inStock === "true",
    });

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
