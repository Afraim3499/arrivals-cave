import { Product } from "@/lib/products";

interface CartItem {
    id: string;
    productId: string;
    productName: string;
    productCode: string;
    productSlug: string;
    size: string;
    quantity: number;
    price: number;
    image: string;
}

interface WhatsAppOrderData {
    customer: {
        name: string;
        phone: string;
        address: string;
        city: string;
        note?: string;
    };
    items: CartItem[];
    subtotal: number;
}

export function buildWhatsAppMessage(order: WhatsAppOrderData): string {
    const MAX_ITEMS = 10;
    const lines: string[] = [];

    lines.push("🛍️ *New Order – Arrivals Cave*");
    lines.push("");
    lines.push(`👤 *Name:* ${order.customer.name}`);
    lines.push(`📞 *Phone:* ${order.customer.phone}`);
    lines.push(`📍 *Address:* ${order.customer.address}`);
    lines.push(`🏙️ *City:* ${order.customer.city}`);
    if (order.customer.note) {
        lines.push(`📝 *Note:* ${order.customer.note}`);
    }
    lines.push("");
    lines.push("─────────────────");
    lines.push("*Order Items:*");
    lines.push("");

    const displayItems = order.items.slice(0, MAX_ITEMS);
    const remaining = order.items.length - MAX_ITEMS;

    displayItems.forEach((item, i) => {
        lines.push(`${i + 1}. ${item.productName} (${item.productCode})`);
        lines.push(`   Size: ${item.size} | Qty: ${item.quantity}`);
        lines.push(`   Price: ৳${(item.price * item.quantity).toLocaleString()}`);
        lines.push("");
    });

    if (remaining > 0) {
        lines.push(`+ ${remaining} more item(s)`);
        lines.push("");
    }

    lines.push("─────────────────");
    lines.push(`*Subtotal:* ৳${order.subtotal.toLocaleString()}`);
    lines.push("*Delivery:* To be confirmed on WhatsApp");
    lines.push("");
    lines.push("Thank you! 🙏");
    lines.push("");
    lines.push(`_Sent via Arrivals Cave Web Store_`);

    return lines.join("\n");
}

export function buildWhatsAppURL(message: string): string {
    const encoded = encodeURIComponent(message);
    // Use process.env but fallback to default if not set
    let number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801626748116";

    number = number.replace(/[^0-9]/g, '');
    if (number.length === 11 && number.startsWith('01')) {
        number = '88' + number;
    }

    // Standardize number formath limit ~4000-8000 chars depending on platform
    // We'll truncate at 4000 to be safe
    let finalEncoded = encoded;
    if (encoded.length > 4000) {
        const truncated = message.slice(0, 3000) + "\n\n[Message truncated — full order details in shop]";
        finalEncoded = encodeURIComponent(truncated);
    }

    return `https://wa.me/${number}?text=${finalEncoded}`;
}
