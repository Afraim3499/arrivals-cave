"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchModal } from "@/components/layout/SearchModal";


export function MobileNav() {
    const t = useTranslations("common");
    const [open, setOpen] = useState(false);

    // TODO: Search functionality

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button suppressHydrationWarning variant="ghost" size="icon" className="lg:hidden h-11 w-11">
                    <Menu className="h-6 w-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-background border-r border-border">
                <div className="flex flex-col gap-6 py-6">
                    <Link href="/" onClick={() => setOpen(false)} className="px-2">
                        <span className="font-display text-2xl font-bold">
                            <span className="text-primary">Arrivals</span> Cave
                        </span>
                    </Link>

                    <div className="px-4">
                        <SearchModal
                            trigger={
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder={t("search")}
                                        className="pl-9 bg-muted/50 border-input"
                                        readOnly
                                    />
                                </div>
                            }
                        />
                    </div>



                    <nav className="flex flex-col gap-2">
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium"
                        >
                            {t("home")}
                        </Link>
                        <Link
                            href="/shop/all"
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium"
                        >
                            {t("collections")}
                        </Link>
                        <Link href="/premium-panjabi" className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium" onClick={() => setOpen(false)}>
                            Premium Panjabi
                        </Link>
                        <Link href="/embroidered-panjabi" className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium" onClick={() => setOpen(false)}>
                            Embroidered
                        </Link>
                        <Link href="/eid-panjabi-collection" className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium text-primary" onClick={() => setOpen(false)}>
                            Eid 2026
                        </Link>
                        <Link href="/blog" className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium" onClick={() => setOpen(false)}>
                            Blog
                        </Link>
                        <Link href="/panjabi-price-in-bangladesh" className="px-4 py-2 hover:bg-muted rounded-md text-lg font-medium border-t border-border mt-2 pt-2" onClick={() => setOpen(false)}>
                            Panjabi Price BD
                        </Link>
                    </nav>

                    <div className="mt-auto px-4 py-8 border-t border-border space-y-4">
                        <Link href="/size-guide" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Size Guide</Link>
                        <Link href="/delivery-return" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Delivery & Return</Link>
                        <Link href="/contact" className="block text-sm text-muted-foreground hover:text-primary" onClick={() => setOpen(false)}>Contact Us</Link>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
