import { Metadata } from "next";

export const SEO_TEMPLATES = {
    product: {
        title: (title: string) => `${title} | Premium Panjabi Collection | Arrivals Cave`,
        description: (title: string, price: number, code: string) =>
            `Buy ${title} (Code: ${code}) for ৳${price.toLocaleString()} at Arrivals Cave. Experience premium fabric, exquisite embroidery, and modern fit. Best luxury Panjabi and traditional menswear in Bangladesh. Fast delivery guaranteed.`
    },
    collection: {
        title: (title: string) => `${title} - Luxury Panjabi & Traditional Wear | Arrivals Cave`,
        description: (title: string) =>
            `Browse our exclusive ${title} collection. High-quality fabrics, unique designs, and superior craftsmanship. Elevate your style with Arrivals Cave's premium traditional menswear. Shop now for the best Eid and wedding collections in Bangladesh.`
    }
};

export function generatePageMeta(options: {
    title: string;
    description: string;
    path: string; // without locale prefix
    locale: string;
    image?: string;
    type?: "website" | "article";
}): Metadata {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscave.com";
    const fullTitle = options.title.length <= 60 ? options.title : options.title.slice(0, 57) + "...";

    return {
        title: fullTitle,
        description: options.description.slice(0, 160),
        alternates: {
            canonical: `${baseUrl}/${options.locale}${options.path}`,
            languages: {
                en: `${baseUrl}/en${options.path}`,
                bn: `${baseUrl}/bn${options.path}`,
                "x-default": `${baseUrl}/en${options.path}`,
            },
        },
        openGraph: {
            title: fullTitle,
            description: options.description.slice(0, 160),
            url: `${baseUrl}/${options.locale}${options.path}`,
            images: options.image ? [{ url: options.image }] : undefined,
            siteName: "Arrivals Cave",
            locale: options.locale === "bn" ? "bn_BD" : "en_US",
            type: options.type || "website",
        },
    };
}

export function generateHreflangMetadata(currentPath: string) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscave.com";

    // Normalize path (ensure it starts with /)
    const normalizedPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

    return {
        alternates: {
            canonical: `${baseUrl}/en${normalizedPath}`,
            languages: {
                en: `${baseUrl}/en${normalizedPath}`,
                bn: `${baseUrl}/bn${normalizedPath}`,
                "x-default": `${baseUrl}/en${normalizedPath}`,
            },
        },
    };
}
