import { getNewArrivalsDefault } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generatePageMeta } from "@/lib/seo";

interface NewArrivalsPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";

    return generatePageMeta({
        title: isEN ? "New Arrivals - Arrivals Cave" : "নতুন আগমন - Arrivals Cave",
        description: isEN
            ? "Discover the latest arrivals in our premium panjabi collection. Fresh designs, new styles."
            : "আমাদের প্রিমিয়াম পাঞ্জাবি কালেকশনে নতুন আগমন দেখুন। নতুন ডিজাইন, নতুন স্টাইল।",
        path: "/new-arrivals",
        locale,
    });
}

export default async function NewArrivalsPage({ params, searchParams }: NewArrivalsPageProps) {
    const { locale } = await params;
    const sParams = await searchParams;
    setRequestLocale(locale);

    const isEN = locale === "en";

    // Use cached default listing (no collection join, 1h TTL)
    const products = await getNewArrivalsDefault();

    const title = isEN ? "New Arrivals" : "নতুন আগমন";
    const description = isEN
        ? "Discover the latest arrivals in our premium panjabi collection."
        : "আমাদের প্রিমিয়াম পাঞ্জাবি কালেকশনে নতুন আগমন দেখুন।";

    return (
        <div className="pb-20">
            <Breadcrumbs items={[{ label: title }]} />

            <div className="bg-muted/30 py-12 md:py-20 mb-12 border-b border-border">
                <Container>
                    <SectionHeading title={title} subtitle={description} center className="mb-0" />
                </Container>
            </div>

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <FilterSidebar />
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
