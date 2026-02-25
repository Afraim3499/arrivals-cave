/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscavebd.com",
    generateRobotsTxt: true,
    sitemapSize: 7000,
    exclude: ["/*/cart", "/api/*"],
    robotsTxtOptions: {
        policies: [
            { userAgent: "*", allow: "/" },
            { userAgent: "*", disallow: ["/*/cart", "/api/"] },
        ],
    },
};
