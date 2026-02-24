import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface InternalLink {
    label: string;
    href: string;
    description?: string;
}

const INTERNAL_LINKS: InternalLink[] = [
    {
        label: "Eid Panjabi Collection 2026",
        href: "/eid-panjabi-collection",
        description: "Browse our complete Eid collection"
    },
    {
        label: "Panjabi Price in Bangladesh",
        href: "/panjabi-price-in-bangladesh",
        description: "Compare premium panjabi prices in BD"
    },
    {
        label: "Panjabi Price in Dhaka",
        href: "/panjabi-price-in-dhaka",
        description: "Dhaka delivery & pricing guide"
    },
    {
        label: "Panjabi Price in Chattogram",
        href: "/panjabi-price-in-chattogram",
        description: "Chattogram delivery & pricing guide"
    },
    {
        label: "Shop All Products",
        href: "/shop/all",
        description: "Browse our entire product catalog"
    }
];

export function ProductInternalLinks() {
    return (
        <section className="py-12 bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <div className="gold-divider mb-10" />
                <h3 className="font-display text-lg text-foreground text-center mb-8">
                    Explore More Collections
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INTERNAL_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="group flex items-center justify-between p-4 card-premium hover:border-primary/20"
                        >
                            <div>
                                <span className="text-sm font-medium text-foreground group-hover:text-gold transition-colors">
                                    {link.label}
                                </span>
                                {link.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {link.description}
                                    </p>
                                )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
