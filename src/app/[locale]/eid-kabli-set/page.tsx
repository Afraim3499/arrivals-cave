import { getProductsByTag, getSEOLandingPage } from "@/lib/products";
import { TagCategoryPage } from "@/components/product/TagCategoryPage";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";
import { generateFAQJsonLd } from "@/lib/schema";

const PAGE_CONFIG = {
    tag: "kabli",
    slug: "eid-kabli-set",
    titleEN: "Eid Kabli Set",
    titleBN: "ঈদ কাবলি সেট",
    h1EN: "Eid Special Kabli Set Collection",
    h1BN: "ঈদ স্পেশাল কাবলি সেট কালেকশন",
};

interface PageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "Eid Kabli Set Collection - Arrivals Cave" : "ঈদ কাবলি সেট কালেকশন - অ্যারাইভালস কেভ",
        description: isEN
            ? "Shop our Eid special Kabli Panjabi sets. Traditional designs with a modern touch, perfect for your Eid celebrations at Arrivals Cave."
            : "আমাদের ঈদ স্পেশাল কাবলি সেট কালেকশন দেখুন। আধুনিকতার ছোঁয়ায় ঐতিহ্যবাহী ডিজাইন, আপনার ঈদের আভিজাত্য বাড়াতে সেরা পছন্দ।",
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
