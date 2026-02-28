export function trackEvent(name: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", name, params);
    }
}

export function trackPixelEvent(name: string, params?: Record<string, unknown>) {
    if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", name, params);
    }
}

// Analytics standard events wrapper
export const analytics = {
    viewItem: (product: { price: number; code: string; title: string; cluster?: string }) => {
        // GA4
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
        // Meta Pixel
        trackPixelEvent("ViewContent", {
            currency: "BDT",
            value: product.price,
            content_name: product.title,
            content_category: product.cluster || "unassigned",
            content_ids: [product.code],
            content_type: "product"
        });
    },
    addToCart: (product: { price: number; code: string; title: string }, size: string) => {
        // GA4
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
        // Meta Pixel
        trackPixelEvent("AddToCart", {
            currency: "BDT",
            value: product.price,
            content_name: product.title,
            content_ids: [product.code],
            content_type: "product"
        });
    },
    beginCheckout: (cartItems: Array<{ code: string; title: string; price: number; quantity: number }>, total: number) => {
        // GA4
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
        // Meta Pixel
        trackPixelEvent("InitiateCheckout", {
            currency: "BDT",
            value: total,
            content_ids: cartItems.map(item => item.code),
            content_type: "product",
            num_items: cartItems.length
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
