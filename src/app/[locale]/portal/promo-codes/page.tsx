"use client";

import { useEffect, useState } from "react";
import { getPromoCodes, createPromoCode, updatePromoCodeStatus, deletePromoCode } from "./actions";
import { Loader2, Tag, Plus, Check, X, RefreshCcw, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function PromoCodesPage() {
    const [promoCodes, setPromoCodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Form State
    const [newCode, setNewCode] = useState("");
    const [newDiscount, setNewDiscount] = useState<number | "">("");

    const fetchPromoCodes = async () => {
        setLoading(true);
        const res = await getPromoCodes();
        if (res.success) {
            setPromoCodes(res.promoCodes || []);
        } else {
            console.error("Failed to fetch promo codes:", res.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPromoCodes();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCode || !newDiscount) {
            setError("Please fill in all fields.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        const res = await createPromoCode(newCode, Number(newDiscount));
        if (res.success) {
            setNewCode("");
            setNewDiscount("");
            await fetchPromoCodes();
        } else {
            setError(res.error || "Failed to create promo code. It might already exist.");
        }
        setIsSubmitting(false);
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        const res = await updatePromoCodeStatus(id, !currentStatus);
        if (res.success) {
            setPromoCodes(promoCodes.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
        } else {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this promo code?")) return;
        const res = await deletePromoCode(id);
        if (res.success) {
            setPromoCodes(promoCodes.filter(p => p.id !== id));
        } else {
            alert("Failed to delete promo code");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
                <p>Loading promo codes...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Tag className="text-orange-500" /> Promo Codes
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">Manage discount codes for your customers and affiliates</p>
                </div>
                <button
                    onClick={fetchPromoCodes}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-sm border border-neutral-700 transition-colors"
                >
                    <RefreshCcw size={16} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Form */}
                <div className="lg:col-span-1">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus size={18} className="text-orange-500" /> Add New Code
                        </h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Promo Code</label>
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                                    placeholder="e.g. SUMMER20"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors uppercase"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-400 mb-1">Discount Percentage (%)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={newDiscount}
                                    onChange={(e) => setNewDiscount(e.target.value ? Number(e.target.value) : "")}
                                    placeholder="e.g. 10"
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-orange-500 transition-colors"
                                    required
                                />
                            </div>
                            {error && <p className="text-xs text-red-500">{error}</p>}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Create Promo Code
                            </button>
                        </form>
                    </div>
                </div>

                {/* List */}
                <div className="lg:col-span-2">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-neutral-800/50 text-neutral-400 uppercase text-xs font-semibold">
                                    <tr>
                                        <th className="px-6 py-4">Code</th>
                                        <th className="px-6 py-4">Discount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Created</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800">
                                    {promoCodes.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                                No promo codes found. Create one to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        promoCodes.map((promo) => (
                                            <tr key={promo.id} className="hover:bg-neutral-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-mono font-bold text-orange-500 px-2 py-1 bg-orange-500/10 rounded inline-block">
                                                        {promo.code}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-lg">{promo.discount_percent}%</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleToggleStatus(promo.id, promo.is_active)}
                                                        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                                            promo.is_active 
                                                                ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20" 
                                                                : "bg-neutral-800 text-neutral-500 hover:bg-neutral-700 border border-neutral-700"
                                                        }`}
                                                    >
                                                        {promo.is_active ? <><Check size={12} /> Active</> : <><X size={12} /> Inactive</>}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500 text-xs">
                                                    {format(new Date(promo.created_at), "MMM d, yyyy")}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleDelete(promo.id)}
                                                        className="p-2 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors inline-flex"
                                                        title="Delete Promo Code"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
