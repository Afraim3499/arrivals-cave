"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";
import { buildWhatsAppMessage, buildWhatsAppURL } from "@/lib/whatsapp";
import { Product } from "@/lib/products";
import { X, MapPin, Phone, User, Building2, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";

import Image from "next/image";
import { createOrder } from "@/app/[locale]/portal/orders/actions";

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
    const { items: cartItems, getTotal } = useCartStore();
    const isDirect = !!directProduct;

    const items = isDirect ? [{ product: directProduct!, size: directSize || "Free Size", quantity: 1 }] : cartItems;
    const subtotal = isDirect ? Math.round(directProduct!.price * 0.8) : getTotal();
    const maxCashback = 680;
    const units = Math.floor(subtotal / 3100);
    const potentialCashback = Math.min(units * 170, maxCashback);

    const [step, setStep] = useState<"form" | "summary" | "success">("form");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        city: "Dhaka",
        notes: ""
    });

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
            cashback_earned: potentialCashback
        }, items);

        if (response.success && response.friendlyId) {
            setOrderId(response.friendlyId);
            setStep("success");
        } else {
            console.error("Order Failed: ", response.error);
            alert("Something went wrong saving the order. Please try again.");
        }
        // Fallback WhatsApp message logic if backend saving fails but we still want to let them order
        const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801626748116";
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com";
        const trackingLink = `${siteUrl}/track-order?id=${orderId}&phone=${formData.phone}`;

        let message = `*New Order Confirmed (#${orderId})*\n\n`;
        message += `*Customer Details*\nName: ${formData.name}\nPhone: ${formData.phone}\nCity: ${formData.city}\nAddress: ${formData.address}\n`;
        if (formData.notes) message += `Notes: ${formData.notes}\n`;

        message += `\n*Order Items*\n`;
        items.forEach((item) => {
            message += `• ${item.product.title} (Size: ${item.size}) x ${item.quantity}\n`;
        });
        message += `\n*Subtotal:* ৳${subtotal.toLocaleString()}\n`;
        message += `*Cashback Earned:* ৳${potentialCashback.toLocaleString()}\n`;
        message += `\n*Track Order:* ${trackingLink}\n`;
        message += `\nPlease confirm my delivery!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, "_blank");

        // Auto Redirect User to tracking page
        window.location.href = `/track-order?id=${orderId}&phone=${formData.phone}`;
    };

    const handleWhatsAppConfirm = () => {
        const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801626748116";
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com";
        const trackingLink = `${siteUrl}/track-order?id=${orderId}&phone=${formData.phone}`;

        let message = `*New Order Confirmed (#${orderId})*\n\n`;
        message += `*Customer Details*\nName: ${formData.name}\nPhone: ${formData.phone}\nCity: ${formData.city}\nAddress: ${formData.address}\n`;
        if (formData.notes) message += `Notes: ${formData.notes}\n`;

        message += `\n*Order Items*\n`;
        items.forEach((item) => {
            message += `• ${item.product.title} (Size: ${item.size}) x ${item.quantity}\n`;
        });
        message += `\n*Subtotal:* ৳${subtotal.toLocaleString()}\n`;
        message += `*Cashback Earned:* ৳${potentialCashback.toLocaleString()}\n`;
        message += `\n*Track Order:* ${trackingLink}\n`;
        message += `\nPlease confirm my delivery!`;

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        // Open WhatsApp
        window.open(url, "_blank");

        // Auto Redirect User to tracking page
        window.location.href = `/track-order?id=${orderId}&phone=${formData.phone}`;
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
                                        <option value="Dhaka">Inside Dhaka (৳80)</option>
                                        <option value="Outside Dhaka">Outside Dhaka (৳150)</option>
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
                                {items.map((item) => (
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
                                        <div className="font-medium text-sm py-1">
                                            ৳{Math.round(item.product.price * 0.8) * item.quantity}
                                        </div>
                                    </div>
                                ))}
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

                            {/* Cashback Offer UI in Checkout */}
                            <div className="bg-primary/5 rounded-lg p-3 text-sm border border-primary/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-primary">Cashback Offer</span>
                                    <span className="font-bold text-primary">৳{potentialCashback} Earned</span>
                                </div>
                                {potentialCashback < maxCashback ? (
                                    <p className="text-xs text-muted-foreground">
                                        Add <strong className="text-foreground">৳{(3100 - (subtotal % 3100)).toLocaleString()}</strong> more to earn another ৳170 cashback! (Max ৳680).
                                    </p>
                                ) : (
                                    <p className="text-xs font-medium text-[#20BD5A]">
                                        🎉 You have reached the maximum cashback of ৳680!
                                    </p>
                                )}
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
