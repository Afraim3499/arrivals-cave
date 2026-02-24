export function trackEvent(name: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", name, params);
    }
}

// Analytics standard events wrapper
export const analytics = {
    viewItem: (product: { price: number; code: string; title: string; cluster?: string }) => {
        trackEvent("view_item", {
            currency: "BDT",
            value: product.price,
            items: [{
                item_id: product.code,
                item_name: product.title,
                price: product.price,
                item_category: product.cluster || "unassigned"
            }]
        });
    },
    addToCart: (product: { price: number; code: string; title: string }, size: string) => {
        trackEvent("add_to_cart", {
            currency: "BDT",
            value: product.price,
            items: [{
                item_id: product.code,
                item_name: product.title,
                price: product.price,
                item_variant: size
            }]
        });
    },
    beginCheckout: (cartItems: Array<{ code: string; title: string; price: number; quantity: number }>, total: number) => {
        trackEvent("begin_checkout", {
            currency: "BDT",
            value: total,
            items: cartItems.map(item => ({
                item_id: item.code,
                item_name: item.title,
                price: item.price,
                quantity: item.quantity
            }))
        });
    },
    whatsappMessageSent: (cartItems: Array<any>, total: number) => {
        trackEvent("whatsapp_message_sent", {
            currency: "BDT",
            value: total,
            items_count: cartItems.length
        });
    }
};
