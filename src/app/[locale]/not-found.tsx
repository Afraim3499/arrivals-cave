import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Home, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
    // Note: useTranslations might not work here depending on how Nex-Intl is configured for 404s
    // But usually it works if it's inside [locale]

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-20">
            <Container>
                <div className="max-w-2xl mx-auto text-center space-y-10">
                    <div className="space-y-2">
                        <span className="text-primary font-mono font-bold tracking-[0.2em] uppercase text-sm">Error 404</span>
                        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                            Page Not Found
                        </h1>
                        <div className="h-1 w-20 bg-primary mx-auto my-6" />
                        <p className="text-muted-foreground text-xl max-w-lg mx-auto leading-relaxed">
                            The style you're looking for might have moved, or the link is broken. Let's get you back on track.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                        <Button
                            asChild
                            variant="default"
                            size="lg"
                            className="rounded-full h-14 font-bold"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-5 w-5" />
                                Home
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full h-14 font-bold"
                        >
                            <Link href="/eid-panjabi-collection">
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Eid Collection
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="secondary"
                            size="lg"
                            className="rounded-full h-14 font-bold"
                        >
                            <Link href="/search">
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </Link>
                        </Button>
                    </div>

                    <div className="pt-12">
                        <p className="text-sm text-muted-foreground italic">
                            "Elegance is not being noticed, but being remembered."
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
}
