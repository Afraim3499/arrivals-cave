"use client";

import { BlogPost } from "@/lib/blog";
import { Link } from "@/i18n/routing";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { bn, enUS } from "date-fns/locale";

interface BlogCardProps {
    post: BlogPost;
    locale: "en" | "bn";
}

export function BlogCard({ post, locale }: BlogCardProps) {
    const t = useTranslations("common");
    const dateLocale = locale === "bn" ? bn : enUS;

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "";
        return format(new Date(dateString), "dd MMMM, yyyy", { locale: dateLocale });
    };

    return (
        <Link href={`/blog/${post.slug}`} className="group block h-full">
            <Card className="h-full border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {post.featured_image && (
                        <Image
                            src={post.featured_image}
                            alt={post.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    )}
                    <Badge className="absolute top-2 right-2 bg-background/80 text-foreground backdrop-blur-sm hover:bg-background">
                        {post.cluster}
                    </Badge>
                </div>
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(post.published_at)}</span>
                    </div>
                    <CardTitle className="font-display text-xl line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                        {post.excerpt}
                    </CardDescription>
                    <div className="pt-2 text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t("readMore")} <span>→</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
