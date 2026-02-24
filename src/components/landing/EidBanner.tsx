import { getHomeSettings } from "@/lib/settings";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function EidBanner() {
    const settings = await getHomeSettings();

    if (!settings?.eid_banner_visible) return null;

    return (
        <section className="py-6 bg-background">
            <Container>
                <Link href={settings.eid_banner_link || "/eid-panjabi-collection"} className="block group">
                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-r from-foreground via-foreground/95 to-foreground text-white py-6 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between transition-transform duration-300 group-hover:scale-[1.01] shadow-md hover:shadow-lg border border-border/10">
                        <div className="absolute inset-0 bg-grid-subtle text-white/5" />

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full text-center md:text-left">
                            <div className="space-y-1 flex-1">
                                <h2 className="font-display text-2xl md:text-3xl font-bold text-primary flex items-center justify-center md:justify-start gap-3">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                    {settings.eid_banner_title || "Eid Collection 2026"}
                                </h2>
                                <p className="text-sm md:text-base text-white/80">
                                    Exclusive designs crafted for the festive season. Limited stock available.
                                </p>
                            </div>

                            <div className="flex-shrink-0 mt-4 md:mt-0">
                                <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-6 py-2 group-hover:bg-white group-hover:text-foreground">
                                    Explore Now <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </Container>
        </section>
    );
}
