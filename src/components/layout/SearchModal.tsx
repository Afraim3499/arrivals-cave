"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Loader2, ShoppingBag, Layers } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Product } from "@/lib/products";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type SuggestionType = "product" | "landing" | "price" | "collection";

interface Suggestion {
    type: SuggestionType;
    title: string;
    url: string;
    image?: string;
    price?: number;
    compare_at_price?: number | null;
    code?: string;
    category?: string;
}

export function SearchModal({ trigger }: { trigger?: React.ReactNode }) {
    const t = useTranslations("common");
    const locale = useLocale();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = useCallback(async (q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(query);
        }, 200);

        return () => clearTimeout(timer);
    }, [query, handleSearch]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const closeAndNavigate = () => {
        setOpen(false);
        setQuery("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? (
                    <div suppressHydrationWarning>{trigger}</div>
                ) : (
                    <button suppressHydrationWarning className="flex items-center justify-center h-10 w-10 text-foreground/80 hover:text-primary hover:bg-muted/50 rounded-full transition-colors relative">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden bg-background">
                <DialogTitle className="sr-only">Search</DialogTitle>
                <DialogDescription className="sr-only">
                    Search for products, locations, or price ranges.
                </DialogDescription>
                <DialogHeader className="p-6 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-4">
                        <Search className="h-6 w-6 text-primary" />
                        <Input
                            placeholder="Search Panjabis, locations (Dhaka, Sylhet), or prices (under 2500)..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="flex-1 border-none bg-transparent focus-visible:ring-0 text-xl p-0 h-auto"
                            autoFocus
                        />
                        {loading && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                        {query && !loading && (
                            <button onClick={() => setQuery("")}>
                                <X className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto p-4 custom-scrollbar">
                    {query && results.length === 0 && !loading && (
                        <div className="py-20 text-center space-y-2">
                            <p className="text-lg font-medium text-foreground">No matches found</p>
                            <p className="text-sm text-muted-foreground">Try a different keyword or price range</p>
                        </div>
                    )}

                    {!query && (
                        <div className="py-8 px-4 space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Popular Cities</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {["Dhaka", "Chattogram", "Sylhet", "Bangladesh"].map((city) => (
                                        <button
                                            key={city}
                                            onClick={() => setQuery(city)}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border text-left"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <Search className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-medium">{city}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-2">Shop by Budget</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {["Under 2000", "Under 2500", "Under 3000", "Under 3500"].map((budget) => (
                                        <button
                                            key={budget}
                                            onClick={() => setQuery(budget)}
                                            className="flex items-center justify-center p-3 rounded-xl hover:bg-muted transition-colors border border-transparent hover:border-border text-sm font-medium"
                                        >
                                            {budget}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-1">
                        {results.map((item, idx) => (
                            <Link
                                key={idx}
                                href={item.url}
                                onClick={closeAndNavigate}
                                className="flex items-center gap-6 p-4 rounded-xl hover:bg-muted/50 transition-all group border border-transparent hover:border-border"
                            >
                                {item.type === "product" && item.image && (
                                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-sm group-hover:shadow-md transition-shadow">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}

                                {item.type === "landing" && (
                                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                        <Search className="h-6 w-6" />
                                    </div>
                                )}

                                {item.type === "price" && (
                                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                )}

                                {item.type === "collection" && (
                                    <div className="h-12 w-12 flex-shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                        {item.image ? (
                                            <div className="relative h-full w-full rounded-full overflow-hidden">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <Layers className="h-6 w-6" />
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors flex items-center gap-3">
                                        {item.title}
                                        {item.type === "landing" && (
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border">
                                                City Guide
                                            </span>
                                        )}
                                        {item.type === "price" && (
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
                                                By Price
                                            </span>
                                        )}
                                        {item.type === "collection" && (
                                            <span className="text-[10px] uppercase font-bold tracking-widest bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full border border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
                                                Category
                                            </span>
                                        )}
                                    </h4>
                                    {item.code && (
                                        <p className="text-sm font-mono text-muted-foreground mt-0.5">
                                            {item.code}
                                        </p>
                                    )}
                                </div>
                                {item.price && (
                                    <div className="flex flex-col items-end">
                                        <div className="text-lg font-black text-primary">
                                            ৳{item.price.toLocaleString()}
                                        </div>
                                        {(item.compare_at_price || 0) > item.price && (
                                            <div className="text-[10px] text-muted-foreground line-through">
                                                ৳{item.compare_at_price!.toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {query && results.length > 0 && (
                    <div className="p-4 border-t border-border bg-muted/30">
                        <Link
                            href={`/search?q=${encodeURIComponent(query)}`}
                            onClick={closeAndNavigate}
                            className="flex items-center justify-center gap-3 py-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Search className="h-4 w-4" />
                            Explore all results for "{query}"
                        </Link>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    );
}
