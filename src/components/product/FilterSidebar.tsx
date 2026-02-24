"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Collection } from "@/lib/products";

const SIZES = ["M", "L", "XL", "XXL"];

interface FilterSidebarProps {
    className?: string;
    currentCollectionSlug?: string;
    collections?: Collection[];
}

export function FilterSidebar({ className, currentCollectionSlug, collections = [] }: FilterSidebarProps) {
    const t = useTranslations("filters");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [priceRange, setPriceRange] = useState([2000, 5000]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [inStockOnly, setInStockOnly] = useState(false);

    // Sync state with URL on mount
    useEffect(() => {
        const sizes = searchParams.get("size")?.split(",") || [];
        const minPrice = parseInt(searchParams.get("minPrice") || "2000");
        const maxPrice = parseInt(searchParams.get("maxPrice") || "5000");
        const inStock = searchParams.get("inStock") === "true";

        setSelectedSizes(sizes.filter(Boolean));
        setPriceRange([minPrice, maxPrice]);
        setInStockOnly(inStock);
    }, [searchParams]);

    const createQueryString = useCallback(
        (params: Record<string, string | null>) => {
            const newSearchParams = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(params)) {
                if (value === null) {
                    newSearchParams.delete(key);
                } else {
                    newSearchParams.set(key, value);
                }
            }

            return newSearchParams.toString();
        },
        [searchParams]
    );

    const handleFilterChange = (updates: Record<string, string | null>) => {
        const query = createQueryString(updates);
        router.push(`${pathname}?${query}`, { scroll: false });
    };

    const toggleSize = (size: string) => {
        const newSizes = selectedSizes.includes(size)
            ? selectedSizes.filter((s) => s !== size)
            : [...selectedSizes, size];
        handleFilterChange({ size: newSizes.length > 0 ? newSizes.join(",") : null });
    };

    const handlePriceChange = (values: number[]) => {
        setPriceRange(values);
    };

    const applyPriceFilter = () => {
        handleFilterChange({
            minPrice: priceRange[0].toString(),
            maxPrice: priceRange[1].toString(),
        });
    };

    const handleMinPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            setPriceRange([val, priceRange[1]]);
        }
    };

    const handleMaxPriceInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            setPriceRange([priceRange[0], val]);
        }
    };

    const clearAll = () => {
        router.push(pathname);
    };

    return (
        <div className={cn("space-y-8", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold uppercase tracking-wider">{t("title")}</h3>
                <Button variant="link" size="sm" onClick={clearAll} className="h-auto p-0 text-muted-foreground hover:text-primary">
                    {t("clear")}
                </Button>
            </div>

            {/* In Stock Only */}
            <div className="flex items-center justify-between">
                <Label htmlFor="in-stock" className="font-medium">{t("availability")}</Label>
                <Switch
                    id="in-stock"
                    checked={inStockOnly}
                    onCheckedChange={(checked: boolean) => handleFilterChange({ inStock: checked ? "true" : null })}
                />
            </div>

            <hr className="border-border" />

            {/* Collections Navigation */}
            {collections.length > 0 && (
                <>
                    <div className="space-y-4">
                        <h4 className="font-semibold">{t("categories") || "Categories"}</h4>
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/shop/all"
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary",
                                    currentCollectionSlug === "all" ? "text-primary font-bold" : "text-muted-foreground"
                                )}
                            >
                                Shop All
                            </Link>
                            {collections.map((coll) => (
                                <Link
                                    key={coll.id}
                                    href={`/shop/${coll.slug}`}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        currentCollectionSlug === coll.slug ? "text-primary font-bold" : "text-muted-foreground"
                                    )}
                                >
                                    {coll.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <hr className="border-border" />
                </>
            )}

            {/* Sizes */}
            <div className="space-y-4">
                <h4 className="font-semibold">{t("size")}</h4>
                <div className="grid grid-cols-2 gap-3">
                    {SIZES.map((size) => (
                        <div key={size} className="flex items-center space-x-2">
                            <Checkbox
                                id={`size-${size}`}
                                checked={selectedSizes.includes(size)}
                                onCheckedChange={() => toggleSize(size)}
                            />
                            <label htmlFor={`size-${size}`} className="text-sm font-medium leading-none cursor-pointer">
                                {size}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-border" />

            {/* Price Range */}
            <div className="space-y-6">
                <h4 className="font-semibold">{t("priceRange")}</h4>
                <div className="pt-4 pb-2">
                    <Slider
                        min={0}
                        max={15000}
                        step={50}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        onValueCommit={applyPriceFilter}
                    />
                </div>
                <div className="flex items-center justify-between gap-4">
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                        <Input
                            type="number"
                            min={0}
                            max={15000}
                            value={priceRange[0]}
                            onChange={handleMinPriceInputChange}
                            onBlur={applyPriceFilter}
                            className="pl-7"
                        />
                    </div>
                    <span className="text-muted-foreground">-</span>
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">৳</span>
                        <Input
                            type="number"
                            min={0}
                            max={15000}
                            value={priceRange[1]}
                            onChange={handleMaxPriceInputChange}
                            onBlur={applyPriceFilter}
                            className="pl-7"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
