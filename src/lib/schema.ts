import { Database } from "@/lib/types/database";

type Product = Database["public"]["Tables"]["products"]["Row"];
type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
type SEOLandingPage = Database["public"]["Tables"]["seo_landing_pages"]["Row"];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscave.com";

/**
 * Generate Product JSON-LD
 */
export function generateProductJsonLd(product: Product, locale: string = "en") {
    const isEN = locale === "en";
    const name = isEN ? product.title : (product.title_bn || product.title);
    const description = isEN ? product.description : (product.description_bn || product.description);
    const inStock = Object.values(product.stock_by_size as Record<string, number>).some(qty => qty > 0);

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        image: product.images,
        description,
        sku: product.code,
        brand: { "@type": "Brand", name: "Arrivals Cave" },
        material: isEN ? product.fabric : (product.fabric_bn || product.fabric),
        color: isEN ? product.color_label : (product.color_label_bn || product.color_label),
        offers: {
            "@type": "Offer",
            url: `${baseUrl}/${locale}/product/${product.slug}`,
            priceCurrency: "BDT",
            price: Math.round(product.price * 0.8),
            availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            seller: { "@type": "Organization", name: "Arrivals Cave" },
        },
    };
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
    if (!faqs || faqs.length === 0) return null;

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
            },
        })),
    };
}

/**
 * Generate Collection JSON-LD
 */
export function generateCollectionJsonLd(collection: any, products: Product[], locale: string = "en") {
    const isEN = locale === "en";
    const name = isEN ? collection.title : (collection.title_bn || collection.title);

    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description: isEN ? collection.description : (collection.description_bn || collection.description),
        mainEntity: {
            "@type": "ItemList",
            itemListElement: products.slice(0, 20).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${baseUrl}/${locale}/product/${p.slug}`,
                name: isEN ? p.title : (p.title_bn || p.title),
            })),
        },
    };
}

/**
 * Generate BlogPosting JSON-LD
 */
export function generateBlogJsonLd(post: BlogPost, locale: string = "en") {
    const isEN = locale === "en";
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: isEN ? post.title : (post.title_bn || post.title),
        image: post.featured_image,
        datePublished: post.published_at,
        dateModified: post.updated_at,
        author: { "@type": "Organization", name: "Arrivals Cave" },
        publisher: {
            "@type": "Organization",
            name: "Arrivals Cave",
            logo: { "@type": "ImageObject", url: `${baseUrl}/logo.png` },
        },
        inLanguage: locale,
    };
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness", "ClothingStore"],
        name: "Arrivals Cave",
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        email: "arrivalscave@gmail.com",
        telephone: "+8801626748116",
        sameAs: [
            "https://www.instagram.com/arrivals_cave/",
            "https://www.facebook.com/ArrivalsCaveOfficial",
        ],
        address: {
            "@type": "PostalAddress",
            streetAddress: "G/D 13 No. Road, Chandgaon Residential Area",
            addressLocality: "Chandgaon",
            addressRegion: "Chattogram",
            postalCode: "4211",
            addressCountry: "BD",
        },
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+8801626748116",
            contactType: "customer service",
            availableLanguage: ["English", "Bengali"],
        },
    };
}

/**
 * Generate Breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(items: { name: string; item: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.item.startsWith("http") ? item.item : `${baseUrl}${item.item}`,
        })),
    };
}
