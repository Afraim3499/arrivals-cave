import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/Container";

interface InternalLinksProps {
    locale: string;
    currentSlug?: string;
}

export function InternalLinks({ locale, currentSlug }: InternalLinksProps) {
    const isEN = locale === "en";

    const styleLinks = [
        { slug: "embroidered-panjabi", title: isEN ? "Embroidered Panjabi" : "এমব্রয়ডারি পাঞ্জাবি" },
        { slug: "short-panjabi", title: isEN ? "Short Panjabi" : "শর্ট পাঞ্জাবি" },
        { slug: "black-panjabi", title: isEN ? "Black Panjabi" : "কালো পাঞ্জাবি" },
    ];

    const cityLinks = [
        { slug: "panjabi-price-in-bangladesh", title: isEN ? "Price in Bangladesh" : "বাংলাদেশে পাঞ্জাবির দাম" },
        { slug: "panjabi-price-in-dhaka", title: isEN ? "Price in Dhaka" : "ঢাকায় পাঞ্জাবির দাম" },
        { slug: "panjabi-price-in-chattogram", title: isEN ? "Price in Chattogram" : "চট্টগ্রামে পাঞ্জাবির দাম" },
    ];

    return (
        <section className="py-12 bg-muted/10 border-t border-border mt-20">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <h4 className="font-display text-xl font-bold mb-6">
                            {isEN ? "Explore Popular Styles" : "জনপ্রিয় পাঞ্জাবি স্টাইল"}
                        </h4>
                        <ul className="grid grid-cols-2 gap-4">
                            {styleLinks.map((link) => (
                                <li key={link.slug}>
                                    <Link
                                        href={`/${link.slug}`}
                                        className={`text-sm hover:text-primary transition-colors ${currentSlug === link.slug ? "text-primary font-bold" : "text-muted-foreground"}`}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-display text-xl font-bold mb-6">
                            {isEN ? "Shop by Location" : "শহর ভিত্তিক দাম"}
                        </h4>
                        <ul className="grid grid-cols-2 gap-4">
                            {cityLinks.map((link) => (
                                <li key={link.slug}>
                                    <Link
                                        href={`/${link.slug}`}
                                        className={`text-sm hover:text-primary transition-colors ${currentSlug === link.slug ? "text-primary font-bold" : "text-muted-foreground"}`}
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Container>
        </section>
    );
}
