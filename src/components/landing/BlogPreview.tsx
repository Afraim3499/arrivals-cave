import { getRecentPosts } from "@/lib/blog";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

interface BlogPreviewProps {
    locale: "en" | "bn";
}

export async function BlogPreview({ locale }: BlogPreviewProps) {
    const posts = await getRecentPosts(3);

    if (!posts.length) return null;

    return (
        <section className="py-20 bg-muted/20">
            <Container>
                <SectionHeading title="Style & Stories" subtitle="Insights from the world of panjabi fashion" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} locale={locale} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button asChild variant="ghost" size="lg" className="hover:text-gold hover:bg-transparent text-lg">
                        <Link href="/blog">Read All Articles</Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
