"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, ListFilter } from "lucide-react";
import { useTranslations } from "next-intl";

const SORT_OPTIONS = [
    { label: "sortNewest", value: "newest" },
    { label: "sortPriceLow", value: "price_asc" },
    { label: "sortPriceHigh", value: "price_desc" },
    { label: "sortBestSellers", value: "best_sellers" },
] as const;

export function SortBar({ totalItems }: { totalItems: number }) {
    const t = useTranslations("filters");
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSort = searchParams.get("sort") || "newest";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set(name, value);
            return params.toString();
        },
        [searchParams]
    );

    const handleSortChange = (value: string) => {
        router.push(`${pathname}?${createQueryString("sort", value)}`, { scroll: false });
    };

    return (
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div className="text-sm text-muted-foreground">
                {t("results", { count: totalItems })}
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm font-medium hidden md:inline-block">{t("sortBy")}:</span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-10 px-4 min-w-[160px] justify-between">
                            {t(SORT_OPTIONS.find((o) => o.value === currentSort)?.label || "sortNewest")}
                            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        {SORT_OPTIONS.map((option) => (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => handleSortChange(option.value)}
                                className={currentSort === option.value ? "bg-accent font-medium text-primary" : ""}
                            >
                                {t(option.label)}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
