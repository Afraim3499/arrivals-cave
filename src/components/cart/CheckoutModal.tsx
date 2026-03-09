"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";
import { buildWhatsAppMessage, buildWhatsAppURL } from "@/lib/whatsapp";
import { Product, getProductPrices } from "@/lib/products";
import { X, MapPin, Phone, User, Building2, CheckCircle2, Loader2, ArrowRight, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

import Image from "next/image";
import { createOrder } from "@/app/[locale]/portal/orders/actions";
import { validatePromoCode } from "@/app/[locale]/portal/promo-codes/actions";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    directProduct?: {
        id: string;
        title: string;
        price: number;
        images: string[];
        productCode?: string;
    };
    directSize?: string;
}

export function CheckoutModal({ isOpen, onClose, directProduct, directSize }: CheckoutModalProps) {
    const { items: cartItems, getTotal, appliedPromo, setPromoCode } = useCartStore();
    const isDirect = !!directProduct;

    const items = isDirect ? [{ product: directProduct!, size: directSize || "Free Size", quantity: 1 }] : cartItems;
    
    // For direct purchases (Buy Now), we still need to calculate the discount if a promo is applied globally
    const directDiscount = appliedPromo?.discount || 0;
    const directPrice = isDirect ? Math.round(directProduct!.price * (1 - (directDiscount / 100))) : 0;
    const subtotal = isDirect ? directPrice : getTotal();

    const [step, setStep] = useState<"form" | "summary" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "Chattogram",
        notes: ""
    });

    const [promoInput, setPromoInput] = useState("");
    const [promoError, setPromoError] = useState("");
    const [isValidatingPromo, setIsValidatingPromo] = useState(false);

    useEffect(() => {
        if (isOpen) {
            analytics.beginCheckout(
                items.map((item) => {
                    const { currentPrice } = getProductPrices(item.product as any, appliedPromo?.discount || 0);
                    return {
                        code: (item.product as any).code || item.product.id,
                        slug: (item.product as any).slug || (item.product as any).code,
                        title: item.product.title,
                        price: currentPrice,
                        quantity: item.quantity,
                    };
                }),
                subtotal
            );
        }
    }, [isOpen, items, subtotal]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("summary");
    };

    const handleConfirmOrder = async () => {
        setIsSubmitting(true);
        // Save to Database
        const response = await createOrder({
            ...formData,
            subtotal,
            promo_code: appliedPromo?.code || null
        }, items, appliedPromo?.discount || 0);

        if (response.success && response.friendlyId) {
            setOrderId(response.friendlyId);
            setStep("success");

            // Fire client-side Facebook Pixel Purchase event for deduplication with CAPI
            if (typeof window !== "undefined" && (window as any).fbq) {
                (window as any).fbq("track", "Purchase", {
                    currency: "BDT",
                    value: subtotal,
                    content_type: "product",
                    content_ids: items.map((item) => (item.product as any).slug || item.product.id),
                    contents: items.map((item) => ({
                        id: (item.product as any).slug || item.product.id,
                        quantity: item.quantity,
                    })),
                    order_id: response.friendlyId,
                });
            }
        } else {
            console.error("Order Failed: ", response.error);
            alert("Something went wrong saving the order. Please try again.");
            setStep("success"); // Still let them fallback to WhatsApp if DB fails
        }
        setIsSubmitting(false);
    };

    const handleWhatsAppConfirm = () => {
        let phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801626748116";
        phone = phone.replace(/[^0-9]/g, '');
        if (phone.length === 11 && phone.startsWith('01')) {
            phone = '88' + phone;
        }
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com";
        const trackingLink = `${siteUrl}/track-order?id=${orderId}&phone=${formData.phone}`;

        const deliveryCharge = formData.city === "Chattogram" ? "৳70" : "৳130–৳150";
        const totalWithDelivery = `৳${subtotal.toLocaleString()} + ${deliveryCharge} (delivery)`;

        let message = `*New Order Confirmed (#${orderId})*\n\n`;
        message += `*Customer Details*\nName: ${formData.name}\nPhone: ${formData.phone}\nCity: ${formData.city}\nAddress: ${formData.address}\n`;
        message += `*Delivery Charge:* ${deliveryCharge}\n`;
        if (formData.notes) message += `Notes: ${formData.notes}\n`;

        message += `\n*Order Items*\n`;
        items.forEach((item) => {
            const { currentPrice } = getProductPrices(item.product as any, appliedPromo?.discount || 0);
            message += `• ${item.product.title} (Size: ${item.size}) x ${item.quantity} = ৳${currentPrice * item.quantity}\n`;
        });
        message += `\n*Subtotal:* ৳${subtotal.toLocaleString()}\n`;
        if (appliedPromo) {
            message += `*Promo Applied:* ${appliedPromo.code} (-${appliedPromo.discount}%)\n`;
        }
        message += `*Total Amount:* ${totalWithDelivery}\n`;
        message += `\n*Track Order:* ${trackingLink}\n`;
        message += `\nPlease confirm my delivery!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp (works reliably here because it's a direct, synchronous UI click event)
        window.open(url, "_blank");

        // Auto Redirect User to tracking page after a tiny delay so mobile browsers don't kill the popup
        setTimeout(() => {
            setPromoCode(null); // clear promo
            window.location.href = `/order-confirmed?id=${orderId}&phone=${formData.phone}`;
        }, 500);
    };

    const handleApplyPromo = async (code: string) => {
        setIsValidatingPromo(true);
        setPromoError("");
        setPromoInput(code);
        
        try {
            const res = await validatePromoCode(code);
            if (res.success && res.discount) {
                setPromoCode({ code: code.toUpperCase(), discount: res.discount });
            } else {
                setPromoError(res.error || "Invalid promo code");
                setPromoCode(null);
            }
        } catch (err) {
            setPromoError("Failed to apply");
        } finally {
            setIsValidatingPromo(false);
        }
    };

    const handleRemovePromo = () => {
        setPromoCode(null);
        setPromoInput("");
        setPromoError("");
    };

    return (
        <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4 opacity-100 transition-opacity duration-300">
            <div className="bg-background w-full sm:w-[500px] sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] translate-y-0 transition-transform duration-300">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
                    <h2 className="text-xl font-display font-bold text-foreground">
                        {step === "form" ? "Delivery Details" : step === "summary" ? "Review Order" : "Order Confirmed!"}
                    </h2>
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted -mr-2 text-muted-foreground hover:text-foreground">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {step === "form" && (
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2 text-foreground">
                                        <User className="h-4 w-4 text-muted-foreground" /> Full Name
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2 text-foreground">
                                        <Phone className="h-4 w-4 text-muted-foreground" /> Phone Number
                                    </label>
                                    <input
                                        required
                                        type="tel"
                                        placeholder="e.g. 01700000000"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2 text-foreground">
                                        <Building2 className="h-4 w-4 text-muted-foreground" /> City
                                    </label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
                                    >
                                        <option value="Chattogram">Inside Chattogram (৳70)</option>
                                        <option value="Outside Chattogram">Outside Chattogram (৳130–৳150)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2 text-foreground">
                                        <MapPin className="h-4 w-4 text-muted-foreground" /> Full Address
                                    </label>
                                    <textarea
                                        required
                                        placeholder="House #, Road #, Area"
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2 text-foreground">
                                        💬 Order Notes (Optional)
                                    </label>
                                    <textarea
                                        placeholder="Any special requests or details..."
                                        rows={2}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
                                    />
                                </div>
                            </div>
                        </form>
                    )}

                    {step === "summary" && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                {items.map((item) => {
                                    const { currentPrice, isDiscounted, originalPrice } = getProductPrices(item.product, appliedPromo?.discount || 0);
                                    return (
                                        <div key={`${item.product.id}-${item.size}`} className="flex gap-4 p-3 rounded-xl border border-border bg-muted/20">
                                            <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0 border border-border">
                                                {item.product.images[0] && (
                                                    <Image src={item.product.images[0]} alt={item.product.title} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 py-1">
                                                <h4 className="font-medium text-sm line-clamp-1">{item.product.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-medium text-sm py-1 flex flex-col items-end">
                                                <span>৳{currentPrice * item.quantity}</span>
                                                {isDiscounted && <span className="text-[10px] text-muted-foreground line-through">৳{originalPrice * item.quantity}</span>}
                                            </div>
                                        </div>
                                    )
                                })}
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

                            <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground font-medium">Order Total</span>
                                    <span className="font-bold text-lg">৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-primary uppercase font-bold tracking-widest">
                                    <Loader2 className="h-3 w-3 animate-spin" /> Saving direct to CRM
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Delivery To:</h4>
                                <p className="text-sm font-medium">{formData.name} • {formData.phone}</p>
                                <p className="text-sm text-muted-foreground">{formData.address}, {formData.city}</p>
                            </div>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="flex flex-col items-center justify-center text-center py-6 space-y-6 animate-in zoom-in duration-300">
                            <div className="h-20 w-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold font-display">Order Successful!</h3>
                                <p className="text-muted-foreground text-sm">Your order has been saved securely.</p>
                            </div>
                            <div className="bg-muted w-full p-4 rounded-xl border border-border">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Your Tracking ID</p>
                                <p className="text-xl font-bold font-mono tracking-widest text-primary">{orderId}</p>
                            </div>
                            <p className="text-sm max-w-xs text-muted-foreground pb-4">
                                Tap the button below to send this tracking ID to us on WhatsApp and quickly finalize the delivery charge!
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border bg-card/50">
                    {step === "form" ? (
                        <Button type="submit" form="checkout-form" className="w-full py-6 text-base font-semibold rounded-xl">
                            Review contents & Proceed
                        </Button>
                    ) : step === "summary" ? (
                        <Button
                            className="w-full py-6 text-base font-bold rounded-xl"
                            onClick={handleConfirmOrder}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Saving Order...</>
                            ) : (
                                "Confirm Order"
                            )}
                        </Button>
                    ) : (
                        <Button
                            className="w-full py-6 text-base font-bold rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center gap-2"
                            onClick={handleWhatsAppConfirm}
                        >
                            Confirm on WhatsApp <ArrowRight className="h-5 w-5" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
