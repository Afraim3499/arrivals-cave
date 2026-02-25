"use client";

import { Product, getProductPrices } from "@/lib/products";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const t = useTranslations("product");
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        // Default size selection logic could be complex (modal?), for now default to 'L' or show toast 'Select Size on page'
        // Actually, best UX is to go to product page or open a quick view.
        // Given the requirement "Add to Cart" button on card implies quick add.
        // I'll assume a default or force user to click card to go to details.
        // Let's make it "Quick Add" (L size default) or just link to product.
        // Phase 1 requirements: "WhatsApp Checkout" focus.
        // Let's make the button navigate to the product page for size selection.
    };

    const { isDiscounted, currentPrice, originalPrice, discountPercent } = getProductPrices(product);

    return (
        <Link href={`/product/${product.slug}`} className="group block h-full">
            <Card className="h-full border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {product.images[0] && (
                        <Image
                            src={product.images[0]}
                            alt={product.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.is_eid_pick && (
                            <Badge className="bg-primary text-primary-foreground hover:bg-primary/90">
                                {t("eidPick")}
                            </Badge>
                        )}
                        {product.is_new_arrival && (
                            <Badge variant="secondary" className="bg-white/90 text-black">
                                {t("newArrival")}
                            </Badge>
                        )}
                        {isDiscounted && (
                            <Badge variant="destructive">
                                {t("sale", { percent: discountPercent })}
                            </Badge>
                        )}
                    </div>
                </div>

                <CardContent className="p-4">
                    <h3 className="font-display text-lg font-medium leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-primary">
                            ৳{currentPrice.toLocaleString()}
                        </span>
                        {isDiscounted && (
                            <span className="text-sm text-muted-foreground line-through">
                                ৳{originalPrice.toLocaleString()}
                            </span>
                        )}
                    </div>
                </CardContent>
                {/*
        <CardFooter className="p-4 pt-0">
           Optional: Add to Cart button here if needed
        </CardFooter>
        */}
            </Card>
        </Link>
    );
}
