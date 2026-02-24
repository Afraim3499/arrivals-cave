"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "./actions";
import { Loader2, Package, RefreshCcw, Search, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchOrders = async () => {
        setLoading(true);
        const res = await getAdminOrders();
        if (res.success) {
            setOrders(res.orders || []);
        } else {
            console.error("Failed to fetch orders:", res.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId: string, newStatus: string, currentCashbackStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        await updateOrderStatus(orderId, newStatus, currentCashbackStatus);
    };

    const handleCashbackChange = async (orderId: string, currentStatus: string, newCashbackStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, cashback_status: newCashbackStatus } : o));
        await updateOrderStatus(orderId, currentStatus, newCashbackStatus);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.friendly_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone.includes(searchTerm) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "Confirmed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "Dispatched": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "Delivered": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "Cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
            default: return "bg-neutral-800 text-neutral-400 border-neutral-700";
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="text-orange-500" /> Order Management
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">Manage and track all customer orders</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm border border-neutral-700 transition-colors"
                >
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Name, or Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-500 cursor-pointer min-w-[150px]"
                >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Order ID & Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items & Area</th>
                                <th className="px-6 py-4">Total & Cashback</th>
                                <th className="px-6 py-4">Live Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono font-bold text-orange-500">{order.friendly_id}</div>
                                            <div className="text-neutral-500 text-xs mt-1">{format(new Date(order.created_at), "MMM d, yyyy h:mm a")}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium">{order.customer_name}</div>
                                            <div className="text-neutral-400">{order.customer_phone}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-neutral-300">
                                                {order.order_items?.length || 0} items
                                            </div>
                                            <div className="text-neutral-500 text-xs mt-1 truncate max-w-[150px]">
                                                {order.city} - {order.shipping_address}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">৳{order.subtotal.toLocaleString()}</div>
                                            {order.cashback_earned > 0 && (
                                                <div className="text-emerald-500 text-xs mt-1 font-medium">
                                                    + ৳{order.cashback_earned} CB
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value, order.cashback_status)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none appearance-none ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Dispatched">Dispatched</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>

                                                {order.cashback_earned > 0 && (
                                                    <select
                                                        value={order.cashback_status}
                                                        onChange={(e) => handleCashbackChange(order.id, order.status, e.target.value)}
                                                        className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none appearance-none ${order.cashback_status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}
                                                    >
                                                        <option value="Pending">CB Pending</option>
                                                        <option value="Paid">CB Paid</option>
                                                    </select>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/en/track-order?id=${order.friendly_id}&phone=${order.customer_phone}`}
                                                target="_blank"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-medium transition-colors border border-neutral-700 hover:border-orange-500"
                                            >
                                                View Live <ExternalLink size={14} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
