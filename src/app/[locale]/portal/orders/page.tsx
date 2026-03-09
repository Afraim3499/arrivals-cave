"use client";

import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus, deleteOrder, deleteOrders } from "./actions";
import { Loader2, Package, RefreshCcw, Search, ExternalLink, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    // Pagination & Bulk Actions
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
    const [isDeletingBulk, setIsDeletingBulk] = useState(false);
    const itemsPerPage = 15;

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

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        await updateOrderStatus(orderId, newStatus, "Pending"); // still passing cashback status to not break backend signature yet
    };

    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm("Are you sure you want to permanently delete this order? This cannot be undone.")) return;
        
        const res = await deleteOrder(orderId);
        if (res.success) {
            setOrders(orders.filter(o => o.id !== orderId));
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            alert("Failed to delete order: " + res.error);
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>, paginatedList: any[]) => {
        if (e.target.checked) {
            const newSelections = paginatedList.map(o => o.id);
            setSelectedOrders(Array.from(new Set([...selectedOrders, ...newSelections])));
        } else {
            const idsToRemove = paginatedList.map(o => o.id);
            setSelectedOrders(selectedOrders.filter(id => !idsToRemove.includes(id)));
        }
    };

    const handleSelectOne = (orderId: string) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedOrders.length === 0) return;
        if (!confirm(`Are you sure you want to permanently delete ${selectedOrders.length} order(s)? This cannot be undone.`)) return;
        
        setIsDeletingBulk(true);
        const res = await deleteOrders(selectedOrders);
        if (res.success) {
            setOrders(orders.filter(o => !selectedOrders.includes(o.id)));
            setSelectedOrders([]);
        } else {
            alert("Bulk delete failed: " + res.error);
        }
        setIsDeletingBulk(false);
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.friendly_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_phone.includes(searchTerm) ||
            order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
    
    // Safety check if current page goes out of bounds after deletion/filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [filteredOrders.length, currentPage, totalPages]);

    const paginatedOrders = filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const isAllCurrentPageSelected = paginatedOrders.length > 0 && paginatedOrders.every(o => selectedOrders.includes(o.id));

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
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1); // Reset page on filter
                    }}
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

            {/* Bulk Actions Bar */}
            {selectedOrders.length > 0 && (
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center justify-between text-orange-500 animate-in fade-in slide-in-from-top-2">
                    <div className="font-bold flex items-center gap-2">
                        <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">{selectedOrders.length}</span>
                        Order(s) Selected
                    </div>
                    <button
                        onClick={handleBulkDelete}
                        disabled={isDeletingBulk}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                    >
                        {isDeletingBulk ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                        Delete Selected
                    </button>
                </div>
            )}

            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-12 text-center">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-neutral-700 bg-neutral-900/50 cursor-pointer w-4 h-4"
                                        checked={isAllCurrentPageSelected}
                                        onChange={(e) => handleSelectAll(e, paginatedOrders)}
                                    />
                                </th>
                                <th className="px-6 py-4">Order ID & Date</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Items & Area</th>
                                <th className="px-6 py-4">Total & Promo</th>
                                <th className="px-6 py-4">Live Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {paginatedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                                        No orders found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedOrders.map((order) => (
                                    <tr key={order.id} className={`transition-colors ${selectedOrders.includes(order.id) ? 'bg-orange-500/5' : 'hover:bg-neutral-800/30'}`}>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                className="rounded border-neutral-700 bg-neutral-900/50 cursor-pointer w-4 h-4"
                                                checked={selectedOrders.includes(order.id)}
                                                onChange={() => handleSelectOne(order.id)}
                                            />
                                        </td>
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
                                            {order.promo_code && (
                                                <div className="text-emerald-500 text-xs mt-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">
                                                    Code: {order.promo_code}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer outline-none appearance-none ${getStatusColor(order.status)}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Dispatched">Dispatched</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/en/track-order?id=${order.friendly_id}&phone=${order.customer_phone}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-orange-500 hover:text-white rounded-lg text-xs font-medium transition-colors border border-neutral-700 hover:border-orange-500"
                                                    title="View Live Order Page"
                                                >
                                                    <ExternalLink size={14} /> View
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="p-1.5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                    title="Delete Order"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-neutral-800 flex items-center justify-between text-sm">
                        <div className="text-neutral-500">
                            Showing <span className="text-white font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> of <span className="text-white font-medium">{filteredOrders.length}</span> results
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-4 py-1.5 bg-neutral-900 rounded-lg font-medium text-neutral-300">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
