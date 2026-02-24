import { Hero } from "@/components/landing/Hero";
import { FeaturedCollections } from "@/components/landing/FeaturedCollections";
import { NewArrivals } from "@/components/landing/NewArrivals";
import { EidBanner } from "@/components/landing/EidBanner";
import { Testimonials } from "@/components/landing/Testimonials";
import { BlogPreview } from "@/components/landing/BlogPreview";
import { setRequestLocale } from "next-intl/server";
import { getHomeSettings } from "@/lib/settings";
import { Metadata } from "next";
import { generateHreflangMetadata } from "@/lib/seo";

import { generatePageMeta } from "@/lib/seo";
import { generateOrganizationJsonLd } from "@/lib/schema";

export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "Arrivals Cave | Premium Panjabi & Luxury Traditional Menswear" : "অ্যারাইভালস কেভ | প্রিমিয়াম পাঞ্জাবি ও লাক্সারি ট্র্যাডিশনাল মেনসওয়্যয়ার",
        description: isEN
            ? "Discover premium panjabi and traditional wear in Bangladesh. Exclusive Eid collection, high-quality fabrics, and exquisite craftsmanship at Arrivals Cave."
            : "বাংলাদেশে প্রিমিয়াম পাঞ্জাবি ও ট্র্যাডিশনাল পোশাক। অ্যারাইভালস কেভ-এ অনন্য ঈদ কালেকশন, উন্নত মানের ফেব্রিক এবং নিখুঁত কারুকার্য।",
        path: "",
        locale,
    });
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch settings here (Server Component)
    const settings = await getHomeSettings();

    return (
        <div className="flex flex-col min-h-screen">
            <Hero settings={settings} />
            <EidBanner />
            <FeaturedCollections />
            <NewArrivals />
            <Testimonials />
            <BlogPreview locale={locale as "en" | "bn"} />
        </div>
    );
}
