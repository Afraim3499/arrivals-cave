import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, getProductPrices } from "@/lib/products";

export interface CartItem {
    product: Product;
    size: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (product: Product, size: string) => void;
    removeItem: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    clearCart: () => void;
    toggleCart: () => void;
    openCart: () => void;
    closeCart: () => void;

    // Computed (helper, not state)
    getTotal: () => number;
    getCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (product, size) => {
                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.product.id === product.id && item.size === size
                    );

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id && item.size === size
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item
                            ),
                            isOpen: true, // Auto-open cart
                        };
                    }

                    return {
                        items: [...state.items, { product, size, quantity: 1 }],
                        isOpen: true, // Auto-open cart
                    };
                });
            },

            removeItem: (productId, size) => {
                set((state) => ({
                    items: state.items.filter(
                        (item) => !(item.product.id === productId && item.size === size)
                    ),
                }));
            },

            updateQuantity: (productId, size, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter(
                                (item) => !(item.product.id === productId && item.size === size)
                            ),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.product.id === productId && item.size === size
                                ? { ...item, quantity }
                                : item
                        ),
                    };
                });
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
            openCart: () => set({ isOpen: true }),
            closeCart: () => set({ isOpen: false }),

            getTotal: () => {
                const { items } = get();
                return items.reduce(
                    (total, item) => {
                        const { currentPrice } = getProductPrices(item.product);
                        return total + currentPrice * item.quantity;
                    },
                    0
                );
            },

            getCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
            // Only persist items, not isOpen state
            partialize: (state) => ({ items: state.items }),
        }
    )
);
