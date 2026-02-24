"use client";

import { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

interface ProductGridProps {
    products: Product[];
    initialLimit?: number;
}

export function ProductGrid({ products, initialLimit = 8 }: ProductGridProps) {
    const t = useTranslations("common");
    const [displayLimit, setDisplayLimit] = useState(initialLimit);

    const visibleProducts = products.slice(0, displayLimit);
    const hasMore = displayLimit < products.length;

    const handleLoadMore = () => {
        setDisplayLimit((prev) => prev + 8);
    };

    const router = useRouter();
    const pathname = usePathname();

    const handleClearFilters = () => {
        router.push(pathname);
    };

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-muted/20 rounded-2xl border border-dashed border-border mt-8">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                    <SearchX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("noResults")}</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                    We couldn't find any products matching your current filters. Try removing some filters or clearing them to see more results.
                </p>
                <Button onClick={handleClearFilters} size="lg" className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                    Clear all filters
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleLoadMore}
                        className="border-primary text-primary hover:bg-primary/10 min-w-[200px]"
                    >
                        {t("loadMore")}
                    </Button>
                </div>
            )}
        </div>
    );
}
