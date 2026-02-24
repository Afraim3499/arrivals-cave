import { Container } from "@/components/layout/Container";
import Image from "next/image";
import { Product } from "@/lib/products";

interface CollectionHeroProps {
    title: string;
    description?: string;
    dynamicSeoText?: string;
    productsCount: number;
    availableSizes: string[];
    priceRange?: { min: number; max: number };
    image?: string;
    locale: string;
}

export function CollectionHero({
    title,
    description,
    dynamicSeoText,
    productsCount,
    availableSizes,
    priceRange,
    image,
    locale,
}: CollectionHeroProps) {
    const isEN = locale === "en";

    return (
        <div className="border-b border-border bg-neutral-50 dark:bg-neutral-900/20 mb-8 pt-8 pb-12">
            <Container>
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
                    {/* 1:1 Structured Image */}
                    {image && (
                        <div className="w-full md:w-[350px] lg:w-[400px] shrink-0 aspect-square relative rounded-2xl overflow-hidden shadow-sm bg-neutral-100 border border-border">
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover object-center"
                                priority
                            />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
                        </div>
                    )}

                    {/* Semantic Details & SEO Text */}
                    <div className="flex-1 space-y-6 pt-4">
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
                            {title}
                        </h1>

                        <div className="prose prose-stone text-muted-foreground prose-lg max-w-none">
                            {description && <p>{description}</p>}
                            {dynamicSeoText && <p>{dynamicSeoText}</p>}
                        </div>

                        {/* Quick Summary Strip */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                <span className="text-muted-foreground">{isEN ? "Products:" : "পণ্য:"}</span> {productsCount}
                            </div>
                            <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                <span className="text-muted-foreground">{isEN ? "Sizes:" : "সাইজ:"}</span> {availableSizes.join(", ")}
                            </div>
                            {priceRange && (
                                <div className="bg-background border border-border px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2">
                                    <span className="text-muted-foreground">{isEN ? "Price:" : "মূল্য:"}</span> ৳{priceRange.min.toLocaleString()} - ৳{priceRange.max.toLocaleString()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
