import { getProducts, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "",
    slug: "panjabi-price-in-sylhet",
    titleEN: "Panjabi Price in Sylhet",
    titleBN: "সিলেটে পাঞ্জাবির দাম",
    h1EN: "Panjabi Price in Sylhet – 2026 Collection",
    h1BN: "সিলেটে পাঞ্জাবির দাম – ২০২৬ কালেকশন",
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
        title: isEN ? "Panjabi Price in Sylhet - Arrivals Cave" : "সিলেটে পাঞ্জাবির দাম - অ্যারাইভালস কেভ",
        description: isEN
            ? "Check the latest Panjabi prices in Sylhet. Premium collection with home delivery and high-quality fabrics at Arrivals Cave."
            : "সিলেটে পাঞ্জাবির লেটেস্ট দাম দেখুন। অ্যারাইভালস কেভ-এ প্রিমিয়াম কালেকশন, হোম ডেলিভারি এবং উন্নত মানের ফেব্রিক।",
        path: `/${PAGE_CONFIG.slug}`,
        locale,
    });
}

export default async function Page({ params, searchParams }: PageProps) {
    const { locale } = await params;
    setRequestLocale(locale);

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
