"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function OrderConfirmedContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id") || "";
    const phone = searchParams.get("phone") || "";

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-16">
            <Container>
                <div className="max-w-lg mx-auto text-center space-y-8">

                    {/* Success Icon */}
                    <div className="flex items-center justify-center">
                        <div className="h-28 w-28 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5">
                            <CheckCircle2 className="h-14 w-14 text-primary" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                            Order Confirmed! 🎉
                        </h1>
                        <p className="text-muted-foreground text-base">
                            Thank you for your order. We&apos;ve received it and will be in touch shortly via WhatsApp.
                        </p>
                    </div>

                    {/* Order ID Card */}
                    {orderId && (
                        <div className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-2">
                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Your Order / Tracking ID
                            </p>
                            <p className="text-3xl font-mono font-bold tracking-widest text-primary">
                                {orderId}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Save this ID to track your order status anytime.
                            </p>
                        </div>
                    )}

                    {/* What's Next */}
                    <div className="bg-muted/50 rounded-2xl p-6 text-left space-y-3 border border-border">
                        <h2 className="font-semibold text-sm uppercase tracking-widest text-muted-foreground">What happens next?</h2>
                        <ul className="space-y-2 text-sm text-foreground">
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5">1.</span>
                                Our team will contact you on WhatsApp to confirm delivery details.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5">2.</span>
                                Your order will be dispatched within 1–2 business days.
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-primary font-bold mt-0.5">3.</span>
                                Use your tracking ID above to check your order status at any time.
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {orderId && phone && (
                            <Button asChild className="flex-1 h-12 text-base font-bold rounded-xl">
                                <Link href={`/track-order?id=${orderId}&phone=${phone}`}>
                                    <Package className="mr-2 h-5 w-5" />
                                    Track My Order
                                </Link>
                            </Button>
                        )}
                        <Button asChild variant="outline" className="flex-1 h-12 text-base font-semibold rounded-xl">
                            <Link href="/shop">
                                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                </div>
            </Container>
        </div>
    );
}

export default function OrderConfirmedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <OrderConfirmedContent />
        </Suspense>
    );
}
