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
import { validatePromoCode } from "@/app/[locale]/portal/promo-codes/actions";

export function CartDrawer() {
    const {
        isOpen,
        closeCart,
        items,
        removeItem,
        updateQuantity,
        getTotal,
        clearCart,
        appliedPromo,
        setPromoCode,
    } = useCartStore();
    const t = useTranslations("cart");

    const [promoInput, setPromoInput] = useState("");
    const [promoError, setPromoError] = useState("");
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);

    // Hydration fix
    const [isMounted, setIsMounted] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    useEffect(() => setIsMounted(true), []);

    if (!isMounted) return null;

    const handleApplyPromo = async (code: string) => {
        setIsValidatingPromo(true);
        setPromoError("");
        setPromoInput(code); // ensure input reflects code if auto-applied
        
        try {
            const res = await validatePromoCode(code);
            if (res.success && res.discount) {
                setPromoCode({ code: code.toUpperCase(), discount: res.discount });
            } else {
                setPromoError(res.error || "Invalid promo code");
                setPromoCode(null);
            }
        } catch (err) {
            setPromoError("Failed to apply promo code");
        } finally {
            setIsValidatingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode(null);
        setPromoInput("");
        setPromoError("");
    };

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
                                        const { isDiscounted, currentPrice, originalPrice } = getProductPrices(item.product, appliedPromo?.discount || 0);

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
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-foreground">৳{getTotal().toLocaleString()}</span>
                                        {appliedPromo && (
                                            <span className="text-[10px] text-emerald-500 font-bold">
                                                (-{appliedPromo.discount}% {appliedPromo.code} applied)
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Promo Code UI */}
                                <div className="bg-muted/30 rounded-lg p-3 text-sm border border-border">
                                    <div className="flex flex-col gap-2">
                                        {!appliedPromo ? (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="Promo code"
                                                        value={promoInput}
                                                        onChange={(e) => setPromoInput(e.target.value)}
                                                        className="flex-1 bg-background border border-border rounded-md px-3 py-1.5 text-sm uppercase focus:outline-none focus:border-primary"
                                                    />
                                                    <Button 
                                                        size="sm" 
                                                        variant="secondary"
                                                        onClick={() => handleApplyPromo(promoInput)}
                                                        disabled={!promoInput || isValidatingPromo}
                                                    >
                                                        {isValidatingPromo ? "..." : "Apply"}
                                                    </Button>
                                                </div>
                                                {promoError && <p className="text-xs text-destructive">{promoError}</p>}
                                                <div className="mt-1 flex items-center justify-between bg-primary/10 border border-primary/20 rounded p-2 cursor-pointer hover:bg-primary/20 transition-colors"
                                                     onClick={() => handleApplyPromo('EIDSALAMI')}>
                                                    <div className="flex flex-col">
                                                        <span className="text-[11px] font-bold text-primary flex items-center gap-1">
                                                            Eid Salami Offer <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
                                                        </span>
                                                        <span className="text-[10px] text-muted-foreground">Tap to apply 10% discount</span>
                                                    </div>
                                                    <span className="font-mono text-xs font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded">EIDSALAMI</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
                                                    <div className="flex flex-col leading-tight">
                                                        <span className="font-bold text-emerald-600 text-[11px]">{appliedPromo.code}</span>
                                                        <span className="text-[10px] text-emerald-600/80">{appliedPromo.discount}% OFF applied!</span>
                                                    </div>
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={handleRemovePromo}>
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
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
