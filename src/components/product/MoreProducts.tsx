import { getProducts } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { ProductCard } from "./ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface MoreProductsProps {
    currentProductId: string;
    locale?: string;
}

export async function MoreProducts({ currentProductId, locale = "en" }: MoreProductsProps) {
    const isEN = locale === "en";

    // Fetch 13 to have enough after excluding current product
    const allProducts = await getProducts(13);
    const products = allProducts
        .filter(p => p.id !== currentProductId)
        .slice(0, 12);

    if (products.length === 0) return null;

    return (
        <section className="py-20 bg-background border-t border-border/30">
            <Container>
                {/* Header */}
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 mb-2">
                            Browse Catalog
                        </p>
                        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                            {isEN ? "Shop All Products" : "সব পণ্য দেখুন"}
                        </h2>
                        <p className="text-muted-foreground text-sm mt-2">
                            {isEN
                                ? "Premium Panjabi for every occasion — Eid, Jummah & beyond"
                                : "ঈদ, জুম্মাহ ও প্রতিটি অনুষ্ঠানের জন্য প্রিমিয়াম পাঞ্জাবি"}
                        </p>
                    </div>
                    <Link
                        href="/shop/all"
                        className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-gold transition-colors group"
                    >
                        <span>{isEN ? "View All" : "সব দেখুন"}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                {/* Mobile View All CTA */}
                <div className="mt-10 flex justify-center sm:hidden">
                    <Link
                        href="/shop/all"
                        className="flex items-center gap-2 px-6 py-3 border border-primary text-primary text-sm font-medium rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                        {isEN ? "View All Products" : "সব পণ্য দেখুন"}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </Container>
        </section>
    );
}
