import { getProductsByTag, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "eid",
    slug: "eid-panjabi-collection",
    titleEN: "Eid Panjabi Collection",
    titleBN: "ঈদ পাঞ্জাবি কালেকশন",
    h1EN: "Premium Eid Panjabi Collection 2026",
    h1BN: "প্রিমিয়াম ঈদ পাঞ্জাবি কালেকশন ২০২৬",
};

interface EidPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "Eid Panjabi Collection 2026 - Arrivals Cave" : "ঈদ পাঞ্জাবি কালেকশন ২০২৬ - অ্যারাইভালস কেভ",
        description: isEN
            ? "Celebrate Eid with our exclusive Panjabi collection. Premium fabrics, exquisite embroidery, and timeless designs for the perfect festive look."
            : "আমাদের এক্সক্লুসিভ পাঞ্জাবি কালেকশনের সাথে আপনার ঈদ উদযাপন করুন। প্রিমিয়াম ফেব্রিক, সুনিপুণ কারুকার্য এবং কালজয়ী ডিজাইন।",
        path: `/${PAGE_CONFIG.slug}`,
        locale,
    });
}

export default async function EidPage({ params, searchParams }: EidPageProps) {
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
