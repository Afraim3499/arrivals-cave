export function GlobalSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arrivalscave.com";

    // Organization Schema (connects social media, branding, contacts, location)
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": ["Organization", "LocalBusiness", "ClothingStore"],
        "name": "Arrivals Cave",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "email": "arrivalscave@gmail.com",
        "telephone": "+8801626748116",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "G/D 13 No. Road, Chandgaon Residential Area",
            "addressLocality": "Chandgaon",
            "addressRegion": "Chattogram",
            "postalCode": "4211",
            "addressCountry": "BD",
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+8801626748116",
            "contactType": "customer service",
            "areaServed": "BD",
            "availableLanguage": ["en", "Bengali"]
        },
        "sameAs": [
            "https://www.facebook.com/ArrivalsCaveOfficial",
            "https://www.instagram.com/arrivals_cave/"
        ]
    };

    // WebSite with SearchAction (allows Google to show a search bar in search results)
    const siteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "url": siteUrl,
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
            />
        </>
    );
}
