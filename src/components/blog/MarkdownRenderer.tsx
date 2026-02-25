import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={cn("prose prose-stone dark:prose-invert max-w-none", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Responsive Tables
                    table: ({ children }: React.HTMLAttributes<HTMLTableElement>) => (
                        <div className="w-full overflow-x-auto my-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
                            <table className="w-full text-sm">{children}</table>
                        </div>
                    ),
                    th: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => <th className="px-4 py-3 bg-muted/50 font-bold text-left">{children}</th>,
                    td: ({ children }: React.HTMLAttributes<HTMLTableCellElement>) => <td className="px-4 py-3 border-t border-border">{children}</td>,

                    // Next/Image Optimization (16:9 for blogs)
                    img: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
                        const { src, alt } = props;
                        return (
                            <div className="relative aspect-square w-full max-w-2xl mx-auto my-8 rounded-2xl overflow-hidden shadow-xl border border-border/50 bg-muted">
                                {src && typeof src === 'string' && (
                                    <Image
                                        src={src}
                                        alt={alt || "Blog image"}
                                        fill
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                        loading="lazy"
                                    />
                                )}
                            </div>
                        );
                    },

                    // Secure & Responsive Links
                    a: ({ href, children }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
                        const isExternal = href?.startsWith('http');
                        return (
                            <a
                                href={href}
                                target={isExternal ? '_blank' : undefined}
                                rel={isExternal ? 'noopener noreferrer' : undefined}
                                className="text-primary font-medium underline underline-offset-4 hover:text-primary/80 break-all"
                            >
                                {children}
                            </a>
                        );
                    },

                    // Typography Overrides
                    p: ({ children }: React.HTMLAttributes<HTMLParagraphElement>) => <p className="mb-6 leading-relaxed text-muted-foreground">{children}</p>,
                    h1: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 className="text-3xl font-display font-bold mt-12 mb-6">{children}</h1>,
                    h2: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 className="text-2xl font-display font-bold mt-10 mb-5">{children}</h2>,
                    h3: ({ children }: React.HTMLAttributes<HTMLHeadingElement>) => <h3 className="text-xl font-display font-bold mt-8 mb-4">{children}</h3>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
