"use client";

import { Product, getProductPrices } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MessageSquare, ShieldCheck, Truck, RefreshCcw, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useTranslations } from "next-intl";
import { ProductGallery } from "./ProductGallery";
import { SizeChips } from "./SizeChips";
import { QuantitySelector } from "./QuantitySelector";
import { CheckoutModal } from "@/components/cart/CheckoutModal";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProductDetailsProps {
    product: Product;
    seoTitle?: string;
}

export function ProductDetails({ product, seoTitle }: ProductDetailsProps) {
    const t = useTranslations("product");
    const tCommon = useTranslations("common");
    const { addItem } = useCartStore();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const { isDiscounted, currentPrice, originalPrice, discountPercent } = getProductPrices(product);

    const stockBySize = (product.stock_by_size as Record<string, number>) || {};
    const sizes = Object.keys(stockBySize).length > 0 ? Object.keys(stockBySize) : ["M", "L", "XL", "XXL"];
    const maxStock = selectedSize ? stockBySize[selectedSize] || 0 : 0;

    useEffect(() => {
        analytics.viewItem(product);

        const handleScroll = () => {
            // Show sticky bar after scrolling past the main add to cart area (approx 600px)
            setIsScrolled(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [product]);

    const handleAddToCart = () => {
        if (!selectedSize) return;
        addItem(product, selectedSize);
        analytics.addToCart(product, selectedSize);
    };

    const handleWhatsAppOrder = () => {
        setIsCheckoutModalOpen(true);
    };

    return (
        <section className="py-12 md:py-20 bg-background">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    {/* Image Gallery */}
                    <ProductGallery images={product.images} title={product.title} />

                    {/* Product Info */}
                    <div className="flex flex-col space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                {product.collection && (
                                    <Link
                                        href={`/shop/${product.collection.slug}`}
                                        className="text-primary hover:text-primary/70 font-medium tracking-widest text-sm uppercase transition-colors"
                                    >
                                        {product.collection.title}
                                    </Link>
                                )}
                                <span className="text-muted-foreground text-sm font-mono">Code: {product.code}</span>
                            </div>

                            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight">
                                {seoTitle || product.title}
                            </h1>

                            <div className="flex items-center gap-6 mt-6">
                                <span className="text-3xl font-bold text-primary">৳{currentPrice.toLocaleString()}</span>
                                {isDiscounted && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl text-muted-foreground line-through opacity-60">৳{originalPrice.toLocaleString()}</span>
                                        <Badge variant="destructive" className="ml-2">
                                            {discountPercent}% OFF
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed border-y border-border py-8">
                            <p>{product.description || "A masterpiece of craftsmanship and style, designed for those who appreciate the finer things in life. Each stitch tells a story of elegance and tradition."}</p>

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {product.color_label && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-bold text-foreground">Color:</span> {product.color_label}
                                    </div>
                                )}
                                {product.fabric && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="font-bold text-foreground">Fabric:</span> {product.fabric}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold uppercase tracking-wider">{t("selectSize")}</span>
                                <Button variant="link" className="p-0 h-auto text-xs text-primary underline">Size Guide</Button>
                            </div>

                            <SizeChips
                                sizes={sizes}
                                stockBySize={stockBySize}
                                selectedSize={selectedSize}
                                onSelect={(s) => { setSelectedSize(s); setQuantity(1); }}
                            />

                            {!selectedSize && <p className="text-xs text-primary font-medium italic">* Selection required before adding to cart</p>}
                        </div>

                        {/* Quantity */}
                        <QuantitySelector
                            quantity={quantity}
                            maxQuantity={maxStock}
                            onChange={setQuantity}
                            disabled={!selectedSize}
                        />

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <div className="flex-1 flex flex-col gap-2">
                                {selectedSize && maxStock > 0 && maxStock <= 3 && (
                                    <div className="text-[#E2136E] text-xs font-bold flex items-center gap-1 animate-pulse">
                                        🔥 Hurry! Only {maxStock} left in this size!
                                    </div>
                                )}
                                <Button
                                    size="lg"
                                    disabled={!selectedSize || maxStock === 0}
                                    onClick={handleAddToCart}
                                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-16 text-lg font-bold rounded-full group shadow-lg shadow-primary/20"
                                >
                                    <ShoppingBag className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                                    {tCommon("addToCart")}
                                </Button>
                            </div>

                            <Button
                                size="lg"
                                variant="outline"
                                onClick={handleWhatsAppOrder}
                                className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10 h-16 text-lg font-bold rounded-full"
                            >
                                <MessageSquare className="mr-2 h-5 w-5" />
                                WhatsApp Order
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-10 border-t border-border mt-auto">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium">Premium Quality</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium">Fast Shipping</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium">Secure Payment</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <RefreshCcw className="h-5 w-5" />
                                </div>
                                <div className="text-sm font-medium">7-Day Returns</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Mobile Sticky Add To Cart Bar */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border z-40 transform transition-transform duration-300 lg:hidden flex gap-4 items-center shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]",
                isScrolled ? "translate-y-0" : "translate-y-full"
            )}>
                <div className="flex-shrink-0 flex flex-col justify-center">
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{product.title}</p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-lg text-primary">৳{currentPrice.toLocaleString()}</p>
                        {isDiscounted && (
                            <p className="text-xs text-muted-foreground line-through">৳{originalPrice.toLocaleString()}</p>
                        )}
                    </div>
                </div>
                <Button
                    disabled={!selectedSize || maxStock === 0}
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-bold rounded-full ml-auto"
                >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {selectedSize ? tCommon("addToCart") : "Select Size"}
                </Button>
            </div>

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                directProduct={selectedSize ? {
                    id: product.id,
                    title: product.title,
                    price: currentPrice,
                    images: product.images,
                    productCode: product.code
                } : undefined}
                directSize={selectedSize || undefined}
            />
        </section>
    );
}
