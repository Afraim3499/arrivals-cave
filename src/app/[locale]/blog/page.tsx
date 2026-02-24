import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { getRecentPosts } from "@/lib/blog";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { setRequestLocale } from "next-intl/server";
import { Metadata } from "next";
import { generateHreflangMetadata } from "@/lib/seo";

export const revalidate = 3600; // 1 hour

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isEN = locale === "en";
    const title = isEN ? "Arrivals Cave Blog | Fashion & Style Guide" : "Arrivals Cave ব্লগ | ফ্যাশন এবং স্টাইল গাইড";
    const description = isEN
        ? "Explore the latest trends in Panjabi fashion, style tips, and behind-the-scenes stories from Arrivals Cave."
        : "পাঞ্জাবি ফ্যাশনের লেটেস্ট ট্রেন্ড, স্টাইল টিপস এবং Arrivals Cave-এর পেছনের গল্পগুলো জানুন।";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            locale: isEN ? "en_US" : "bn_BD",
        },
        ...generateHreflangMetadata("/blog")
    };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const posts = await getRecentPosts(20);
    const isEN = locale === "en";

    return (
        <Container className="py-20">
            <SectionHeading
                title={isEN ? "From Our Blog" : "আমাদের ব্লগ থেকে"}
                subtitle={isEN ? "Style tips, fashion trends, and product guides" : "স্টাইল টিপস, ফ্যাশন ট্রেন্ড এবং প্রোডাক্ট গাইড"}
                center
            />
            <div className="mt-12">
                {posts.length > 0 ? (
                    <BlogGrid posts={posts} locale={locale as "en" | "bn"} />
                ) : (
                    <div className="text-center py-20 text-muted-foreground">
                        {isEN ? "No posts found." : "কোনো ব্লগ পোস্ট পাওয়া যায়নি।"}
                    </div>
                )}
            </div>
        </Container>
    );
}
