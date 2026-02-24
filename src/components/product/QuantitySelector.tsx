"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
    quantity: number;
    maxQuantity: number;
    onChange: (qty: number) => void;
    disabled?: boolean;
}

export function QuantitySelector({ quantity, maxQuantity, onChange, disabled }: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (quantity > 1) onChange(quantity - 1);
    };

    const handleIncrement = () => {
        if (quantity < maxQuantity) onChange(quantity + 1);
    };

    return (
        <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Quantity</span>
            <div className="flex items-center border border-border rounded-full p-1 bg-muted/30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={disabled || quantity <= 1}
                    className="h-10 w-10 rounded-full hover:bg-background"
                >
                    <Minus className="h-4 w-4" />
                </Button>

                <span className="w-12 text-center font-bold text-lg">
                    {quantity}
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={disabled || quantity >= maxQuantity}
                    className="h-10 w-10 rounded-full hover:bg-background"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {maxQuantity > 0 && maxQuantity < 5 && (
                <span className="text-xs text-primary font-medium">Only {maxQuantity} left!</span>
            )}
        </div>
    );
}
