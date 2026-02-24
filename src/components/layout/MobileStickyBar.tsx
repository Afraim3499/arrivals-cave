"use client";

import { usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Filter, ListOrdered, ShoppingBag, ArrowLeft, MessageSquare, Share2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

export function MobileStickyBar() {
    const pathname = usePathname();
    const router = useRouter();
    const t = useTranslations("common");
    const { openCart, getCount } = useCartStore();
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => setIsMounted(true), []);

    // Cart count — only read after mount to prevent hydration mismatch
    const cartCount = isMounted ? getCount() : 0;

    const isProductPage = pathname.includes("/product/");
    const isCollectionPage = pathname.includes("/shop/") ||
        pathname.includes("/premium-panjabi") ||
        pathname.includes("-panjabi") ||
        pathname.includes("/search");
    const isBlogPage = pathname.includes("/blog/");
    const isCartPage = pathname.includes("/cart");

    if (pathname === "/") return null; // Home page doesn't need it? Spec says "Home: none"

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border md:hidden safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-4">
                {isProductPage ? (
                    <>
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold">
                            <ArrowLeft className="h-5 w-5" />
                            {t("back")}
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 text-black font-bold flex-1 mx-2"
                            onClick={() => {
                                // Trigger add to cart in the product page context
                                // This usually requires a global event or context
                                window.dispatchEvent(new CustomEvent("add-to-cart-triggered"));
                            }}
                        >
                            {t("addToCart")}
                        </Button>
                        <Button
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-500/10 flex flex-col gap-1 h-auto px-2"
                            onClick={() => {
                                window.dispatchEvent(new CustomEvent("whatsapp-buy-triggered"));
                            }}
                        >
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-[10px] uppercase font-bold">{t("whatsappBuy")}</span>
                        </Button>
                    </>
                ) : isCollectionPage ? (
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold"
                            onClick={() => window.dispatchEvent(new CustomEvent("open-filters"))}
                        >
                            <Filter className="h-5 w-5" />
                            {t("filter")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold"
                            onClick={() => window.dispatchEvent(new CustomEvent("open-sort"))}
                        >
                            <ListOrdered className="h-5 w-5" />
                            {t("sort")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold relative"
                            onClick={openCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {t("cart")}
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-black flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </>
                ) : isBlogPage ? (
                    <>
                        <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold">
                            <Share2 className="h-5 w-5" />
                            {t("share")}
                        </Button>
                        <div className="flex-1" />
                        <Button
                            variant="outline"
                            className="border-green-500 text-green-500 hover:bg-green-500/10 flex flex-col gap-1 h-auto"
                            onClick={() => window.open("https://wa.me/8801751299259", "_blank")}
                        >
                            <MessageSquare className="h-5 w-5" />
                            <span className="text-[10px] uppercase font-bold">WhatsApp</span>
                        </Button>
                    </>
                ) : (
                    // Default / Fallback
                    <>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold"
                            onClick={() => router.push("/")}
                        >
                            <ArrowLeft className="h-5 w-5" />
                            {t("home")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto text-[10px] uppercase font-bold relative"
                            onClick={openCart}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            {t("cart")}
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-2 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-black flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
