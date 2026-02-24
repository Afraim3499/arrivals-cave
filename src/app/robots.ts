import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscave.com";

    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/*/cart", "/api/"],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
