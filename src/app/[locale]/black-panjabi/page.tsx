import { getProductsByTag, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "black",
    slug: "black-panjabi",
    titleEN: "Black Panjabi",
    titleBN: "কালো পাঞ্জাবি",
    h1EN: "Classic Black Panjabi Collection",
    h1BN: "ক্লাসিক কালো পাঞ্জাবি কালেকশন",
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
        title: isEN ? "Black Panjabi Collection - Arrivals Cave" : "কালো পাঞ্জাবি কালেকশন - অ্যারাইভালস কেভ",
        description: isEN
            ? "Exploe our classic black Panjabi collection. Timeless elegance, premium comfort, and sophisticated designs in various fabrics."
            : "আমাদের ক্লাসিক কালো পাঞ্জাবি কালেকশন দেখুন। কালজয়ী আভিজাত্য, প্রিমিয়াম কমফোর্ট এবং সলিড কালার ডিজাইন।",
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
