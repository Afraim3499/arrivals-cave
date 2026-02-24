"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { trackOrder } from "@/app/[locale]/portal/orders/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import Image from "next/image";

function TrackOrderContent() {
    const searchParams = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [phone, setPhone] = useState(searchParams.get("phone") || "");
    const [isLoading, setIsLoading] = useState(false);
    const [orderData, setOrderData] = useState<any>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!orderId || !phone) {
            setError("Please enter both your Tracking ID and Phone Number.");
            return;
        }

        setIsLoading(true);
        setError("");

        // Ensure ID has ORD- format just in case
        const formattedId = orderId.toUpperCase().startsWith("ORD-") ? orderId.toUpperCase() : `ORD-${orderId.toUpperCase()}`;

        const res = await trackOrder(formattedId, phone);
        if (res.success) {
            setOrderData(res.order);
        } else {
            setError(res.error || "Order not found or details mismatch.");
            setOrderData(null);
        }
        setIsLoading(false);
    };

    // Auto-fetch if params are present in URL
    useEffect(() => {
        if (searchParams.get("id") && searchParams.get("phone")) {
            handleTrack();
        }
    }, [searchParams]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "text-yellow-600 bg-yellow-100 border-yellow-200";
            case "Confirmed": return "text-blue-600 bg-blue-100 border-blue-200";
            case "Dispatched": return "text-purple-600 bg-purple-100 border-purple-200";
            case "Delivered": return "text-emerald-700 bg-emerald-100 border-emerald-200";
            case "Cancelled": return "text-red-600 bg-red-100 border-red-200";
            default: return "text-muted-foreground bg-muted border-border";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Pending": return <Loader2 className="h-5 w-5 animate-spin" />;
            case "Confirmed": return <CheckCircle2 className="h-5 w-5" />;
            case "Dispatched": return <Truck className="h-5 w-5" />;
            case "Delivered": return <Package className="h-5 w-5" />;
            case "Cancelled": return <AlertCircle className="h-5 w-5" />;
            default: return <Search className="h-5 w-5" />;
        }
    };

    return (
        <div className="pb-24 min-h-[70vh]">
            <div className="bg-muted/30 py-16 mb-12 border-b border-border">
                <Container>
                    <SectionHeading
                        title="Track Your Order"
                        subtitle="Enter your Order ID (Tracking ID) and associated phone number to see live updates."
                        center
                    />
                </Container>
            </div>

            <Container>
                <div className="max-w-xl mx-auto space-y-8">
                    {/* Search Form */}
                    <form onSubmit={handleTrack} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Tracking ID</label>
                                <Input
                                    placeholder="e.g. ORD-1234"
                                    className="h-12 bg-muted/50"
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Phone Number</label>
                                <Input
                                    placeholder="e.g. 017XXXXX"
                                    className="h-12 bg-muted/50"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>
                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Search className="mr-2 h-5 w-5" />}
                            Track Order Details
                        </Button>
                    </form>

                    {/* Order Result */}
                    {orderData && (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                            {/* General Status Card */}
                            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                                <div className={`px-6 py-4 flex items-center justify-between border-b ${getStatusColor(orderData.status).split(' ')[1]}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-full bg-white/50 ${getStatusColor(orderData.status).split(' ')[0]}`}>
                                            {getStatusIcon(orderData.status)}
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-wider font-bold opacity-70">Order Status</p>
                                            <h3 className={`font-bold text-lg ${getStatusColor(orderData.status).split(' ')[0]}`}>
                                                {orderData.status}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs uppercase tracking-wider font-bold opacity-70">Order ID</p>
                                        <p className="font-mono font-bold text-lg">{orderData.friendly_id}</p>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground mb-1">Date</p>
                                            <p className="font-medium">{new Date(orderData.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Delivery to</p>
                                            <p className="font-medium capitalize">{orderData.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Receiving by</p>
                                            <p className="font-medium">{orderData.customer_name}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground mb-1">Amount</p>
                                            <p className="font-bold text-primary">৳{orderData.subtotal.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Cashback Status Card */}
                            {orderData.cashback_earned > 0 && (
                                <div className={`border rounded-2xl p-6 md:p-8 ${orderData.cashback_status === 'Paid' ? 'bg-[#20BD5A]/10 border-[#20BD5A]/30' : 'bg-primary/5 border-primary/20'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">💰</div>
                                            <div>
                                                <h3 className="font-bold text-lg text-primary">Cashback Offer</h3>
                                                <p className="text-sm text-muted-foreground">Cashback Earned: ৳{orderData.cashback_earned}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${orderData.cashback_status === 'Paid' ? 'bg-[#20BD5A] text-white' : 'bg-primary/20 text-primary'}`}>
                                                {orderData.cashback_status === 'Paid' ? 'Paid to Phone' : 'Pending Full Payment'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-4 italic">* Cashback is sent to the phone number associated with the order after final delivery is confirmed and payment is collected.</p>
                                </div>
                            )}

                            {/* Items Card */}
                            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8">
                                <h3 className="font-bold font-display text-xl mb-6">Order Items</h3>
                                <div className="space-y-4">
                                    {orderData.order_items.map((item: any) => (
                                        <div key={item.id} className="flex gap-4 items-center">
                                            <div className="h-16 w-16 relative rounded-lg overflow-hidden border border-border flex-shrink-0">
                                                {item.image_url ? (
                                                    <Image src={item.image_url} alt={item.product_name} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center text-xs">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{item.product_name}</p>
                                                <p className="text-sm text-muted-foreground">Size: {item.size} • Qty: {item.quantity}</p>
                                            </div>
                                            <div className="font-bold text-primary">
                                                ৳{(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <TrackOrderContent />
        </Suspense>
    );
}
