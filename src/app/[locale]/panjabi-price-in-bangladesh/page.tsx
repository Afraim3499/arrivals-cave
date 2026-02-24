import { getProducts, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "", // No specific tag for city pages, show latest
    slug: "panjabi-price-in-bangladesh",
    titleEN: "Panjabi Price in Bangladesh",
    titleBN: "বাংলাদেশে পাঞ্জাবির দাম",
    h1EN: "Panjabi Price in Bangladesh – 2026 Collection",
    h1BN: "বাংলাদেশে পাঞ্জাবির দাম – ২০২৬ কালেকশন",
};

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const landing = await getSEOLandingPage(PAGE_CONFIG.slug);
    const isEN = locale === "en";

    const title = isEN
        ? (landing?.title || PAGE_CONFIG.titleEN)
        : (landing?.title_bn || PAGE_CONFIG.titleBN);

    const description = isEN
        ? (landing?.meta_description || `Find the latest Panjabi prices in Bangladesh. Shop from our premium collection with home delivery.`)
        : (landing?.meta_description_bn || `বাংলাদেশে পাঞ্জাবির লেটেস্ট দাম জানুন। আমাদের প্রিমিয়াম কালেকশন থেকে অনলাইনে অর্ডার করুন।`);

    return generatePageMeta({
        title: `${title} - Arrivals Cave`,
        description: description || "",
        path: `/${PAGE_CONFIG.slug}`,
        locale,
    });
}

export default async function Page({ params, searchParams }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

    // City pages show general products
    const products = await getProducts(20);
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
