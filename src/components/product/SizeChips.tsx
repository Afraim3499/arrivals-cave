"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SizeChipsProps {
    sizes: string[];
    stockBySize: Record<string, number>;
    selectedSize: string | null;
    onSelect: (size: string) => void;
}

export function SizeChips({ sizes, stockBySize, selectedSize, onSelect }: SizeChipsProps) {
    const allOutOfStock = Object.values(stockBySize).every(qty => qty === 0);

    if (allOutOfStock) {
        return (
            <div className="py-2 px-4 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                Currently Unavailable
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-3">
            {sizes.map((size) => {
                const stock = stockBySize[size] || 0;
                const isOutOfStock = stock === 0;
                const isSelected = selectedSize === size;

                return (
                    <Button
                        key={size}
                        variant={isSelected ? "default" : "outline"}
                        disabled={isOutOfStock}
                        onClick={() => !isOutOfStock && onSelect(size)}
                        className={cn(
                            "h-12 w-12 rounded-full font-bold transition-all",
                            isOutOfStock && "opacity-40 line-through cursor-not-allowed",
                            isSelected && "bg-primary text-primary-foreground border-primary scale-110 shadow-primary/20 shadow-lg",
                            !isSelected && !isOutOfStock && "hover:border-primary hover:text-primary"
                        )}
                    >
                        {size}
                    </Button>
                );
            })}
        </div>
    );
}
