"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Facebook, Instagram } from "lucide-react";

// All collections with their category page links
const COLLECTIONS = [
    {
        name: "Basarah — Classic Panjabi",
        href: "/shop/basarah",
        products: [
            { name: "Shamsheer", slug: "shamsheer-bs-5001" },
            { name: "Rameen", slug: "rameen-br-5002" },
        ],
    },
    {
        name: "Heer — Premium Silk",
        href: "/shop/heer",
        products: [
            { name: "Gulrukh", slug: "gulrukh-hg-1001" },
            { name: "Arzoo", slug: "arzoo-ha-1002" },
            { name: "Ayzel", slug: "ayzel-ha-1003" },
            { name: "Shahzad", slug: "shahzad-hs-1004" },
        ],
    },
    {
        name: "Muraqsh — Artisan Embroidery",
        href: "/shop/muraqsh",
        products: [
            { name: "Neelkaar", slug: "neelkaar-mn-2001" },
            { name: "Subhkaar", slug: "subhkaar-ms-2002" },
            { name: "Nehaj", slug: "nehaj-mn-2003" },
            { name: "Noor", slug: "noor-mn-2004" },
            { name: "Zayan", slug: "zayan-mz-2005" },
        ],
    },
    {
        name: "Zameen — Earthy Linen",
        href: "/shop/zameen",
        products: [
            { name: "Wazir", slug: "wazir-zw-3001" },
            { name: "Sabzar", slug: "sabzar-zs-3002" },
            { name: "Neelash", slug: "neelash-zn-3003" },
        ],
    },
    {
        name: "Sirash — Minimal Cotton",
        href: "/shop/sirash",
        products: [
            { name: "Arsham", slug: "arsham-sa-4001" },
            { name: "Shahan", slug: "shahan-ss-4002" },
            { name: "Aftab", slug: "aftab-sa-4003" },
        ],
    },
];

export function Footer() {
    const t = useTranslations("footer");
    const year = new Date().getFullYear();

    return (
        <footer className="bg-muted text-muted-foreground border-t border-border mt-auto">

            {/* ── SEO Product Index ── */}
            <div className="border-b border-border/50">
                <div className="container mx-auto px-4 py-10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-6">
                        Shop by Collection · Eid Panjabi 2026
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {COLLECTIONS.map((col) => (
                            <div key={col.href}>
                                {/* Collection heading — links to category page */}
                                <Link
                                    href={col.href}
                                    className="block text-xs font-bold text-foreground hover:text-primary transition-colors mb-3 pb-1.5 border-b border-border/40"
                                >
                                    {col.name}
                                </Link>
                                {/* Product chips */}
                                <div className="flex flex-wrap gap-1.5">
                                    {col.products.map((p) => (
                                        <Link
                                            key={p.slug}
                                            href={`/product/${p.slug}`}
                                            className="inline-block text-[11px] px-2.5 py-1 rounded-full border border-border/60 text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all"
                                        >
                                            {p.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* SEO keyword tags — cities & use cases */}
                    <div className="mt-8 pt-6 border-t border-border/30">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 mb-3">
                            Explore by Price &amp; City
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: "Panjabi Price in Bangladesh", href: "/panjabi-price-in-bangladesh" },
                                { label: "Panjabi Price in Dhaka", href: "/panjabi-price-in-dhaka" },
                                { label: "Panjabi Price in Chattogram", href: "/panjabi-price-in-chattogram" },
                                { label: "Panjabi Price in Sylhet", href: "/panjabi-price-in-sylhet" },
                                { label: "Eid Panjabi Collection 2026", href: "/eid-panjabi-collection" },
                                { label: "Premium Panjabi BD", href: "/premium-panjabi" },
                                { label: "Shop All Panjabi", href: "/shop/all" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="inline-block text-[11px] px-2.5 py-1 rounded-full border border-border/40 text-muted-foreground/70 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Footer Columns ── */}
            <div className="container mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="font-display font-bold text-2xl text-foreground">
                            <span className="text-primary">Arrivals</span> Cave
                        </Link>
                        <p className="text-sm max-w-xs">{t("tagline")}</p>
                        <div className="flex gap-4">
                            <a href="https://www.facebook.com/ArrivalsCaveOfficial" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/arrivals_cave/" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">{t("quickLinks")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/manifesto" className="hover:text-foreground transition-colors">Brand Manifesto</Link></li>
                            <li><Link href="/shop/all" className="hover:text-foreground transition-colors">Shop All</Link></li>
                            <li><Link href="/eid-panjabi-collection" className="hover:text-foreground transition-colors text-primary font-bold">Eid Collection</Link></li>
                            <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Content */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">{t("content")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/panjabi-price-in-bangladesh" className="hover:text-foreground transition-colors">Panjabi Price in BD</Link></li>
                            <li><Link href="/premium-panjabi" className="hover:text-foreground transition-colors">Premium Panjabi</Link></li>
                        </ul>
                    </div>

                    {/* Policies */}
                    <div>
                        <h3 className="font-semibold text-foreground mb-4">{t("policies")}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/delivery-return" className="hover:text-foreground transition-colors">Delivery &amp; Return</Link></li>
                            <li><Link href="/size-guide" className="hover:text-foreground transition-colors">Size Guide</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
                    <p>{t("copyright", { year })}</p>

                    <div className="flex flex-col items-center md:items-end gap-2">
                        <div className="flex items-center gap-4 opacity-80">
                            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground mr-2">We Accept:</span>
                            {/* Simple text badges for payment methods */}
                            <div className="flex gap-2">
                                <span className="bg-[#E2136E] text-white text-[10px] font-bold px-2 py-1 rounded">bKash</span>
                                <span className="bg-[#ED1C24] text-white text-[10px] font-bold px-2 py-1 rounded">Nagad</span>
                                <span className="bg-[#8C1515] text-white text-[10px] font-bold px-2 py-1 rounded">Rocket</span>
                                <span className="bg-foreground text-background text-[10px] font-bold px-2 py-1 rounded">COD</span>
                            </div>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic max-w-sm text-center md:text-right">
                            * bKash, Nagad, Rocket send money options accepted. Cash on delivery accepted. Only delivery charge is taken in advance for order confirmation.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
