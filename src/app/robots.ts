import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/*/cart", "/api/", "/*/portal/"],
            },
            { userAgent: "AhrefsBot", disallow: "/" },
            { userAgent: "SemrushBot", disallow: "/" },
            { userAgent: "DotBot", disallow: "/" },
            { userAgent: "MJ12bot", disallow: "/" },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
