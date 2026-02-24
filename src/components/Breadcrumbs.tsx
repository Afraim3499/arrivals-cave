import { Link } from "@/i18n/routing";
import { ChevronRight, Home } from "lucide-react";
import { Container } from "./layout/Container";
import { cn } from "@/lib/utils";
import { generateBreadcrumbJsonLd } from "@/lib/schema";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    const jsonLd = generateBreadcrumbJsonLd([
        { name: "Home", item: "/" },
        ...items.map(item => ({ name: item.label, item: item.href || "" }))
    ]);

    return (
        <nav aria-label="Breadcrumb" className={cn("py-4", className)}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Container>
                <ol className="flex items-center space-x-2 text-xs md:text-sm text-muted-foreground overflow-x-auto whitespace-nowrap scrollbar-none">
                    <li className="flex items-center">
                        <Link href="/" className="hover:text-primary transition-colors flex items-center">
                            <Home className="h-3.5 w-3.5 mr-1" />
                        </Link>
                    </li>

                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            <ChevronRight className="h-3.5 w-3.5 mx-1 flex-shrink-0 opacity-50" />
                            {item.href ? (
                                <Link href={item.href} className="hover:text-primary transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground truncate max-w-[150px] md:max-w-none">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </Container>
        </nav>
    );
}
