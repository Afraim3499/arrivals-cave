"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitch({ className }: { className?: string }) {
    const locale = useLocale();
    const pathname = usePathname();

    return (
        <div className={cn("flex items-center gap-3 text-sm font-medium", className)}>
            <Link
                href={pathname}
                locale="en"
                className={cn(
                    "transition-colors hover:text-primary",
                    locale === "en" ? "text-primary font-bold" : "text-muted-foreground"
                )}
                hrefLang="en"
            >
                EN
            </Link>
            <span className="text-muted-foreground/30">|</span>
            <Link
                href={pathname}
                locale="bn"
                className={cn(
                    "transition-colors hover:text-primary",
                    locale === "bn" ? "text-primary font-bold" : "text-muted-foreground"
                )}
                hrefLang="bn"
            >
                বাংলা
            </Link>
        </div>
    );
}
