import { Container } from "@/components/layout/Container";
import { getPostBySlug } from "@/lib/blog";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Metadata } from "next";
import { generatePageMeta, generateHreflangMetadata } from "@/lib/seo";
import { generateBlogJsonLd } from "@/lib/schema";
import { marked } from "marked";
import { searchProducts } from "@/lib/products";
import { BlogCard } from "@/components/blog/BlogCard";

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
    const content = isEN ? post.content_markdown : (post.content_markdown_bn || post.content_markdown);

    // Extract keywords
    const keywordMatch = content?.match(/<!-- KEYWORDS: (.*?) -->/);
    const keywords = keywordMatch ? JSON.parse(keywordMatch[1]) : [];

    return generatePageMeta({
        title: `${title} | Arrivals Cave Blog`,
        description: excerpt || "",
        path: `/blog/${slug}`,
        locale,
        image: post.featured_image || undefined,
        type: "article",
        keywords: keywords.length > 0 ? keywords : undefined
    });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const post = await getPostBySlug(slug);
    if (!post) notFound();

    const isEN = locale === "en";
    const title = isEN ? post.title : post.title_bn || post.title;
    const content = isEN ? post.content_markdown : post.content_markdown_bn || post.content_markdown;

    // Extract FAQs from markdown comments
    const faqMatch = content?.match(/<!-- FAQ: (.*?) -->/);
    const faqItems = faqMatch ? JSON.parse(faqMatch[1]) : [];

    // Extract AEO Snippet from markdown
    const aeoMatch = content?.match(/\[AEO-SNIPPET\]([\s\S]*?)\[\/AEO-SNIPPET\]/);
    const aeoSnippet = aeoMatch ? aeoMatch[1].trim() : null;
    const cleanContent = content?.replace(/\[AEO-SNIPPET\][\s\S]*?\[\/AEO-SNIPPET\]/, '') || "";

    const jsonLd = generateBlogJsonLd(post, locale, faqItems);

    // Fetch related products based on cluster
    const relatedProducts = await searchProducts({ limit: 4, q: post.cluster });

    // Parse markdown to HTML
    const htmlContent = await marked.parse(cleanContent || "");

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

            <Container className="pt-8 md:pt-16 pb-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-primary/10 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                            {post.cluster}
                        </span>
                        <time className="text-sm text-muted-foreground">
                            {post.published_at ? format(new Date(post.published_at), "MMMM dd, yyyy") : ""}
                        </time>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
                        {title}
                    </h1>

                    <div className="flex items-center gap-3 mb-10 text-sm">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <span className="text-primary font-bold text-xs">AC</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-foreground font-semibold">Arrivals Cave Field Research Team</span>
                            <span className="text-muted-foreground text-xs">Expert Insights • Topical Authority Verified</span>
                        </div>
                    </div>

                    {post.featured_image && (
                        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 bg-muted shadow-2xl ring-1 ring-border/50">
                            <Image
                                src={post.featured_image}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                priority
                            />
                        </div>
                    )}

                    {aeoSnippet && (
                        <div className="mb-12 p-8 bg-primary/[0.03] border-l-4 border-primary rounded-r-2xl shadow-sm">
                            <div className="flex items-center gap-2 mb-4 text-primary font-display font-bold uppercase tracking-widest text-xs">
                                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                Key Takeaways (AEO Optimized)
                            </div>
                            <div className="text-lg text-foreground/90 leading-relaxed font-medium italic">
                                "{aeoSnippet}"
                            </div>
                        </div>
                    )}
                </div>
            </Container>

            <Container>
                <div className="max-w-3xl mx-auto pb-12">
                    <div
                        className="prose prose-lg prose-stone max-w-none 
                        prose-headings:font-display prose-headings:text-foreground 
                        prose-p:text-muted-foreground/90 prose-p:leading-relaxed
                        prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
                        prose-strong:text-foreground prose-li:marker:text-primary
                        prose-img:rounded-xl prose-img:shadow-lg
                        prose-table:border prose-table:rounded-xl prose-table:overflow-hidden
                        prose-th:bg-muted prose-th:p-4 prose-td:p-4"
                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />

                    {/* Expert Verification Block */}
                    <div className="mt-20 p-10 bg-muted/30 rounded-3xl border border-border/50 backdrop-blur-sm">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex-shrink-0 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                                <span className="text-primary text-3xl font-display font-bold">AC</span>
                            </div>
                            <div>
                                <h3 className="text-2xl font-display font-bold text-foreground mb-3">About the Field Research Team</h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Our team consists of textile engineers and heritage fashion preservationists who spend hundreds of hours analyzing tropical fabric performance and Dhaka's urban style evolution. Every article is peer-reviewed for technical accuracy and market relevance.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <span className="px-3 py-1 bg-background rounded-full text-xs font-bold border border-border">Textile Science</span>
                                    <span className="px-3 py-1 bg-background rounded-full text-xs font-bold border border-border">Trend Analysis</span>
                                    <span className="px-3 py-1 bg-background rounded-full text-xs font-bold border border-border">Dhaka Markets</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Viral Recommendation Engine */}
                {relatedProducts.length > 0 && (
                    <div className="max-w-6xl mx-auto mt-24 border-t pt-20">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">Recommended for You</h2>
                            <p className="text-muted-foreground text-lg">Curated picks based on this article's topical research.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map(product => (
                                <div key={product.id} className="group">
                                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-4 shadow-md group-hover:shadow-xl transition-all duration-500">
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                                            <a href={`/${locale}/product/${product.slug}`} className="w-full py-3 bg-white text-black text-center font-bold rounded-xl active:scale-95 transition-transform uppercase text-xs tracking-widest">
                                                View Product
                                            </a>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-foreground truncate">{product.title}</h4>
                                    <p className="text-primary font-bold">৳{product.price.toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Container>
        </article>
    );
}


