"use client";

import { useCartStore } from "@/stores/cart-store";
import { getProductPrices } from "@/lib/products";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { CheckoutModal } from "@/components/cart/CheckoutModal";

export function CartDrawer() {
    const {
        isOpen,
        closeCart,
        items,
        removeItem,
        updateQuantity,
        getTotal,
        clearCart,
    } = useCartStore();
    const t = useTranslations("cart");

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return null;

    const handleCheckoutClick = () => {
        closeCart(); // Close the cart drawer
        setIsCheckoutOpen(true); // Open the checkout modal
    };

    return (
        <>
            <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
                <SheetContent className="w-full sm:max-w-md flex flex-col bg-background border-l border-border">
                    <SheetHeader>
                        <SheetTitle className="font-display text-2xl text-primary">
                            {t("title")}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="flex-1 overflow-hidden mt-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <p className="text-xl font-medium">{t("empty")}</p>
                                <p className="text-muted-foreground">{t("emptyDesc")}</p>
                                <Button
                                    variant="outline"
                                    className="mt-4 border-primary text-primary hover:bg-primary/10"
                                    onClick={closeCart}
                                >
                                    {t("continueShopping")}
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="h-full pr-4">
                                <div className="space-y-6">
                                    {items.map((item) => {
                                        const { isDiscounted, currentPrice, originalPrice } = getProductPrices(item.product);

                                        return (
                                            <div
                                                key={`${item.product.id}-${item.size}`}
                                                className="flex gap-4"
                                            >
                                                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border">
                                                    {item.product.images[0] && (
                                                        <Image
                                                            src={item.product.images[0]}
                                                            alt={item.product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex flex-1 flex-col justify-between">
                                                    <div>
                                                        <h3 className="font-medium line-clamp-1">
                                                            {item.product.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Size: {item.size}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between mt-2">
                                                        <div className="flex items-center gap-2 border border-border rounded-md">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-none"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.product.id,
                                                                        item.size,
                                                                        item.quantity - 1
                                                                    )
                                                                }
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </Button>
                                                            <span className="text-sm w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 rounded-none"
                                                                onClick={() =>
                                                                    updateQuantity(
                                                                        item.product.id,
                                                                        item.size,
                                                                        item.quantity + 1
                                                                    )
                                                                }
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </Button>
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            <span className="font-medium text-primary flex flex-col items-end">
                                                                <span>৳{currentPrice * item.quantity}</span>
                                                                {isDiscounted && <span className="text-[10px] text-muted-foreground line-through">৳{originalPrice * item.quantity}</span>}
                                                            </span>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                                onClick={() =>
                                                                    removeItem(item.product.id, item.size)
                                                                }
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="px-6 py-4 border-t border-border mt-auto">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">{t("subtotal")}</span>
                                    <span className="font-medium text-foreground">৳{getTotal().toLocaleString()}</span>
                                </div>

                                {/* Cashback Offer UI */}
                                {(() => {
                                    const total = getTotal();
                                    const maxCashback = 680; // 170 * 4
                                    const units = Math.floor(total / 3100);
                                    const potentialCashback = Math.min(units * 170, maxCashback);
                                    const remainder = total % 3100;
                                    const neededForNext = 3100 - remainder;

                                    return (
                                        <div className="bg-primary/5 rounded-lg p-3 text-sm border border-primary/20">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-primary">Cashback Offer</span>
                                                <span className="font-bold text-primary">৳{potentialCashback} Earned</span>
                                            </div>
                                            {potentialCashback < maxCashback ? (
                                                <>
                                                    <div className="w-full bg-primary/20 h-2 rounded-full overflow-hidden mb-2">
                                                        <div className="bg-primary h-full transition-all duration-500" style={{ width: `${(remainder / 3100) * 100}%` }} />
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">
                                                        Add <strong className="text-foreground">৳{neededForNext.toLocaleString()}</strong> more to earn another ৳170 cashback! (Max ৳680).
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-xs font-medium text-[#20BD5A]">
                                                    🎉 You have reached the maximum cashback of ৳680!
                                                </p>
                                            )}
                                            <p className="text-[10px] text-muted-foreground mt-2 italic leading-tight">* Cashback will be sent via bKash or Nagad after the full payment is completed. No free shipping.</p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {items.length > 0 && (
                        <SheetFooter className="px-6 pb-6 pt-4 border-t border-border sm:justify-center">
                            <div className="w-full space-y-4">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>{t("subtotal")}</span>
                                    <span className="text-primary">৳{getTotal().toLocaleString()}</span>
                                </div>
                                <Button
                                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white py-6 text-lg font-semibold rounded-full"
                                    onClick={handleCheckoutClick}
                                >
                                    {t("checkout")}
                                </Button>
                                <p className="text-[11px] text-center text-muted-foreground mt-2">
                                    Only delivery charge is taken in advance for order confirmation.
                                </p>
                            </div>
                        </SheetFooter>
                    )}
                </SheetContent>
            </Sheet>

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
            />
        </>
    );
}
