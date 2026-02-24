import { Suspense } from "react";
import { Product, getSEOLandingPage } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { SortBar } from "@/components/product/SortBar";
import { Database } from "@/lib/types/database";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { cn } from "@/lib/utils";
import { InternalLinks } from "@/components/seo/InternalLinks";
import { PriceRangeInfo } from "@/components/seo/PriceRangeInfo";
import { Gem, ShieldCheck, TrendingUp } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string;
}

interface TagCategoryPageProps {
    config: {
        tag: string;
        slug: string;
        titleEN: string;
        titleBN: string;
        h1EN: string;
        h1BN: string;
    };
    products: Product[];
    landing: Database["public"]["Tables"]["seo_landing_pages"]["Row"] | null;
    locale: string;
}

export function TagCategoryPage({ config, products, landing, locale }: TagCategoryPageProps) {
    const isEN = locale === "en";
    const title = isEN ? config.h1EN : config.h1BN;

    // SEO Content from DB or config
    const introMarkdown = isEN
        ? landing?.content_markdown
        : landing?.content_markdown_bn || landing?.content_markdown;

    const faqItems = (isEN
        ? (landing?.faq_items as unknown as FAQItem[])
        : (landing?.faq_items_bn as unknown as FAQItem[] || landing?.faq_items as unknown as FAQItem[])) || [];

    return (
        <div className="pb-20">
            <Breadcrumbs
                items={[
                    { label: title }
                ]}
            />

            {/* Header Section */}
            <div className="bg-muted/30 py-12 md:py-20 mb-12 border-b border-border">
                <Container>
                    <SectionHeading
                        title={title}
                        subtitle={isEN ? landing?.meta_description || "" : landing?.meta_description_bn || ""}
                        center
                        className="mb-0"
                    />
                </Container>
            </div>

            <PriceRangeInfo products={products} locale={locale} />

            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Suspense fallback={<div className="animate-pulse h-48 bg-muted/30 rounded-xl" />}>
                                <FilterSidebar />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Product Grid & Sort */}
                    <main className="lg:col-span-3">
                        <Suspense fallback={<div className="animate-pulse h-10 bg-muted/30 rounded-lg mb-4" />}>
                            <SortBar totalItems={products.length} />
                        </Suspense>
                        <ProductGrid products={products} />

                        {/* High-Impact Context & Competitive Block */}
                        {(introMarkdown || faqItems.length > 0) && (
                            <section className="mt-20 pt-20 border-t border-border">
                                <div className="grid md:grid-cols-2 gap-16 items-start">
                                    <div className="space-y-6">
                                        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                                            {isEN ? `${config.titleEN}` : `${config.titleBN}`}
                                        </h2>
                                        {introMarkdown && (
                                            <div
                                                className="prose prose-lg dark:prose-invert text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: introMarkdown }}
                                            />
                                        )}
                                    </div>

                                    <div className="bg-muted/50 rounded-3xl p-8 md:p-12 border border-border">
                                        <h3 className="text-2xl font-bold mb-6">
                                            {isEN ? "How We Beat the Market" : "আমরা কীভাবে অন্যদের থেকে সেরা"}
                                        </h3>
                                        <ul className="space-y-6">
                                            {[
                                                { icon: Gem, title: isEN ? "Unmatched Quality" : "অতুলনীয় মান", desc: isEN ? "We use pure imported fabrics that outclass established brands." : "আমরা ইম্পোর্টেড প্রিমিয়াম কাপড় ব্যবহার করি।" },
                                                { icon: TrendingUp, title: isEN ? "Direct-to-Consumer Pricing" : "সাশ্রয়ী মূল্য", desc: isEN ? "No middleman markups. Luxury quality at sensible budgets." : "মাঝখানে কোনো ব্রোকার নেই, তাই প্রিমিয়াম পাঞ্জাবি পাচ্ছেন সেরা দামে।" },
                                                { icon: ShieldCheck, title: isEN ? "Perfected Tailoring" : "নিখুঁত টেইলারিং", desc: isEN ? "Engineered fits designed specifically for the modern Bangladeshi gentleman." : "বাংলাদেশী পুরুষদের জন্য বিশেষভাবে ডিজাইন করা ফিটিং।" },
                                            ].map((feature, idx) => (
                                                <li key={idx} className="flex gap-4 text-left">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                        <feature.icon className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-lg">{feature.title}</h4>
                                                        <p className="text-muted-foreground text-sm">{feature.desc}</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* FAQ Section */}
                        {faqItems.length > 0 && (
                            <section className="mt-16 pt-16 border-t border-border">
                                <h3 className="font-display text-2xl md:text-3xl font-bold mb-8">
                                    {isEN ? "Frequently Asked Questions" : "সাধারণ কিছু প্রশ্ন"}
                                </h3>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqItems.map((item, idx) => (
                                        <AccordionItem key={idx} value={`faq-${idx}`}>
                                            <AccordionTrigger className="text-left font-medium">
                                                {item.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}
                    </main>
                </div>
            </Container>

            <InternalLinks locale={locale} currentSlug={config.slug} />
        </div>
    );
}
