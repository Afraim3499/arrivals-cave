"use client";

import { useState } from "react";
import { getAffiliateStats } from "./actions";
import { Loader2, TrendingUp, DollarSign, ShoppingBag, Search, ExternalLink, MessageCircle, Info } from "lucide-react";
import { format } from "date-fns";
import { Container } from "@/components/layout/Container";
import Link from "next/link";

export default function AffiliateTrackingPage() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [hasSearched, setHasSearched] = useState(false);
    
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setError("");
        setHasSearched(true);
        setStats(null);
        setOrders([]);

        const res = await getAffiliateStats(code);

        if (res.success && res.stats) {
            setStats(res.stats);
            setOrders(res.recentOrders || []);
        } else {
            setError(res.error || "Could not load data for this code.");
        }
        setIsLoading(false);
    };

    const whatsAppNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801626748116";
    const whatsAppJoinLink = `https://wa.me/${whatsAppNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello! I am interested in joining the Arrivals Cave Affiliate Program. Could you please provide more details?")}`;

    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans py-12 md:py-24">
            <Container className="max-w-4xl">
                
                {/* Header Section */}
                <div className="text-center space-y-4 mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-sm font-semibold mb-2">
                        <TrendingUp size={16} /> Partner Program
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold">
                        Affiliate <span className="text-orange-500">Dashboard</span>
                    </h1>
                    <p className="text-neutral-400 max-w-xl mx-auto text-lg">
                        Track your promo code usage, confirmed sales, and estimated commissions in real-time.
                    </p>
                </div>

                {/* Search Box */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto mb-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500"></div>
                    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Enter your Promo Code... (e.g. BAPPA20)"
                                value={code}
                                onChange={(e) => setCode(e.target.value.toUpperCase())}
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-12 pr-4 py-4 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all uppercase font-medium"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all disabled:opacity-70 flex items-center justify-center min-w-[140px]"
                        >
                            {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Track Stats"}
                        </button>
                    </form>
                    {error && (
                        <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
                    )}
                </div>

                {/* Results Area */}
                {stats && (
                    <div className="space-y-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        <div className="flex flex-col md:flex-row items-center justify-between pb-4 border-b border-neutral-800">
                            <div>
                                <h2 className="text-2xl font-bold">Results for <span className="text-orange-500 font-mono bg-orange-500/10 px-2 py-0.5 rounded">{code}</span></h2>
                                <p className="text-neutral-400 text-sm mt-1">Customers get {stats.discountPercent}% off their order with this code.</p>
                            </div>
                            <div className="mt-4 md:mt-0 px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-800 text-sm font-medium text-neutral-300">
                                Affiliate Rate: <span className="text-white font-bold">10%</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-neutral-700 transition-colors">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-neutral-800 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative">
                                    <div className="h-10 w-10 bg-neutral-800 text-white rounded-lg flex items-center justify-center mb-4">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <p className="text-neutral-400 text-sm font-medium">Total Code Uses</p>
                                    <p className="text-3xl font-bold mt-1">{stats.totalUses}</p>
                                    <p className="text-xs text-neutral-500 mt-2">All-time checkout attempts</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-blue-500/20 transition-colors">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative">
                                    <div className="h-10 w-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
                                        <CheckCircle size={20} />
                                    </div>
                                    <p className="text-neutral-400 text-sm font-medium">Confirmed Sales</p>
                                    <p className="text-3xl font-bold mt-1 text-blue-400">{stats.confirmedSalesCount}</p>
                                    <p className="text-xs text-neutral-500 mt-2">Total revenue: ৳{stats.totalSalesAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative overflow-hidden group hover:border-emerald-500/20 transition-colors">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                                <div className="relative">
                                    <div className="h-10 w-10 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center mb-4">
                                        <DollarSign size={20} />
                                    </div>
                                    <p className="text-neutral-400 text-sm font-medium">Estimated Commission</p>
                                    <p className="text-3xl font-bold mt-1 text-emerald-400">৳{stats.estimatedCommission.toLocaleString()}</p>
                                    <p className="text-xs text-emerald-500/70 mt-2 font-medium">10% of Confirmed Sales</p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders Table */}
                        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mt-8">
                            <div className="px-6 py-5 border-b border-neutral-800">
                                <h3 className="text-lg font-bold">Recent Order History</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-neutral-950/50 text-neutral-400 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="px-6 py-4">Order ID</th>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4">Order Value</th>
                                            <th className="px-6 py-4 font-bold text-emerald-500 text-right">Your Cut (10%)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-800">
                                        {orders.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                                    No orders have used this code yet. Promote it to start earning!
                                                </td>
                                            </tr>
                                        ) : (
                                            orders.map((order) => {
                                                const isConfirmed = order.status === "Confirmed" || order.status === "Dispatched" || order.status === "Delivered";
                                                const commission = isConfirmed ? Math.round(order.subtotal * 0.10) : 0;

                                                return (
                                                    <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                                                        <td className="px-6 py-4 font-mono font-medium">{order.friendly_id}</td>
                                                        <td className="px-6 py-4 text-neutral-400">
                                                            {format(new Date(order.created_at), "MMM d, yyyy")}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <StatsBadge status={order.status} />
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">
                                                            ৳{order.subtotal?.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {isConfirmed ? (
                                                                <span className="text-emerald-400 font-bold">+৳{commission.toLocaleString()}</span>
                                                            ) : (
                                                                <span className="text-neutral-500 italic">Pending</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                )}


                {/* Information Section for New Affiliates */}
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <TrendingUp size={200} />
                    </div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                        <div className="md:col-span-3 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-800 rounded-full text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                                <Info size={14} /> Affiliate Program
                            </div>
                            <h2 className="text-3xl font-display font-bold">Want to earn with us?</h2>
                            <p className="text-neutral-400 text-lg leading-relaxed">
                                Join the Arrivals Cave Affiliate Program and start earning money today. When you partner with us, we'll generate a custom promo code unique to you.
                            </p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-orange-500/20 text-orange-500 p-1 rounded-full"><TrendingUp size={16} /></div>
                                    <div>
                                        <p className="font-bold text-white">Your Audience Gets 20% Off</p>
                                        <p className="text-sm text-neutral-400">Promote your custom code and your followers get a huge discount.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-emerald-500/20 text-emerald-500 p-1 rounded-full"><DollarSign size={16} /></div>
                                    <div>
                                        <p className="font-bold text-white">You get 10% Cash Commission</p>
                                        <p className="text-sm text-neutral-400">For every successfully delivered order using your code, you receive 10% of the entire checkout bill.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-neutral-950/50 rounded-2xl border border-neutral-800 text-center">
                            <MessageCircle size={48} className="text-[#25D366] mb-4" />
                            <h3 className="text-xl font-bold mb-2">Apply Now</h3>
                            <p className="text-sm text-neutral-400 mb-6">
                                Contact our team on WhatsApp to get your custom code setup in minutes.
                            </p>
                            <Link 
                                href={whatsAppJoinLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
                            >
                                Contact via WhatsApp <ExternalLink size={18} />
                            </Link>
                        </div>
                    </div>
                </div>

            </Container>
        </div>
    );
}

// Utility component for the order status badge
function StatsBadge({ status }: { status: string }) {
    if (status === "Delivered") {
        return <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">Delivered</span>;
    }
    if (status === "Dispatched") {
        return <span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/20">Dispatched</span>;
    }
    if (status === "Confirmed") {
        return <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">Confirmed</span>;
    }
    if (status === "Pending") {
        return <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 text-xs font-bold border border-neutral-700">Pending</span>;
    }
    if (status === "Cancelled" || status === "Returned") {
        return <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">{status}</span>;
    }
    return <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-400 text-xs font-bold border border-neutral-700">{status}</span>;
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
