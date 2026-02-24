import { Container } from "@/components/layout/Container";
import { getPostBySlug } from "@/lib/blog";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Image } from "next/dist/client/image-component"; // Use standard import if possible, but keeping consistency
import NextImage from "next/image";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { generatePageMeta, generateHreflangMetadata } from "@/lib/seo";
import { generateBlogJsonLd } from "@/lib/schema";

interface BlogPostPageProps {
    params: Promise<{ locale: string; slug: string }>;
}

export const revalidate = 86400; // 24 hours

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    const isEN = locale === "en";
    const title = isEN ? post.title : (post.title_bn || post.title);
    const excerpt = isEN ? post.excerpt : (post.excerpt_bn || post.excerpt);

    return generatePageMeta({
        title: `${title} | Arrivals Cave Blog`,
        description: excerpt || "",
        path: `/blog/${slug}`,
        locale,
        image: post.featured_image || undefined,
        type: "article"
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getPostBySlug(slug);
    if (!post) notFound();

    const jsonLd = generateBlogJsonLd(post, locale);

    const isEN = locale === "en";
    const title = isEN ? post.title : post.title_bn || post.title;
    const content = isEN ? post.content_markdown : post.content_markdown_bn || post.content_markdown;

    return (
        <article className="min-h-screen pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Breadcrumbs
                items={[
                    { label: isEN ? "Blog" : "ব্লগ", href: "/blog" },
                    { label: title }
                ]}
            />

            <div className="relative h-[400px] md:h-[600px] w-full mb-12">
                {post.featured_image ? (
                    <Image
                        src={post.featured_image}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40" />
                <Container className="h-full flex flex-col justify-end pb-12 relative z-10">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-primary text-black px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                                {post.cluster}
                            </span>
                            <time className="text-sm text-white/80">
                                {post.published_at ? format(new Date(post.published_at), "MMMM dd, yyyy") : ""}
                            </time>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">
                            {title}
                        </h1>
                    </div>
                </Container>
            </div>

            <Container>
                <div className="max-w-3xl mx-auto py-12">
                    <div
                        className="prose prose-lg prose-stone max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-li:marker:text-primary"
                        dangerouslySetInnerHTML={{ __html: content || "" }}
                    />
                </div>
            </Container>
        </article>
    );
}
