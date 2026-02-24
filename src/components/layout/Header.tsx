"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import { SearchModal } from "@/components/layout/SearchModal";
import { cn } from "@/lib/utils";

export function Header() {
    const t = useTranslations("common");
    const { openCart, getCount } = useCartStore();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b flex flex-col",
                isScrolled
                    ? "bg-background/95 backdrop-blur-md border-border"
                    : "bg-background/50 border-transparent"
            )}
        >
            {/* Global Announcement Bar */}
            <div className="bg-primary text-primary-foreground text-xs md:text-sm font-medium py-2 px-4 text-center">
                Up to ৳600 off! ৳110 cashback on every ৳1,500 spent 🎁
            </div>

            <div className={cn("container mx-auto px-4 flex items-center justify-between transition-all duration-300", isScrolled ? "py-2" : "py-4")}>
                {/* Mobile Nav Trigger */}
                <div className="lg:hidden">
                    <MobileNav />
                </div>

                {/* Logo */}
                <Link href="/" className="font-display font-bold text-2xl lg:text-3xl">
                    <span className="text-primary">Arrivals</span> Cave
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">
                        {t("home")}
                    </Link>
                    <Link href="/shop/all" className="hover:text-primary transition-colors">
                        {t("collections")}
                    </Link>
                    <Link href="/eid-panjabi-collection" className="text-primary hover:text-primary/80 transition-colors">
                        {t("eidCollection")}
                    </Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">
                        {t("blog")}
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <SearchModal />



                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative"
                        onClick={openCart}
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {mounted && getCount() > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                                {getCount()}
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </header>
    );
}
