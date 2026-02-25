import { marked } from 'marked';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    // Parse markdown to HTML asynchronously if needed, but marked.parse is synchronous by default
    const rawHtml = marked.parse(content, { async: false }) as string;

    // Purify HTML to prevent XSS (if using DOMPurify, otherwise disabled for now if not installed)
    // As we can trust our own CMS content, we'll render it directly

    return (
        <div
            className={cn(
                "prose prose-stone dark:prose-invert max-w-none",
                "prose-img:rounded-2xl prose-img:shadow-xl prose-img:border prose-img:border-border/50",
                "prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:text-primary/80 prose-a:break-all",
                "prose-table:w-full prose-table:overflow-x-auto prose-table:my-6 prose-table:rounded-xl prose-table:border prose-table:border-border prose-table:bg-card/50",
                "prose-th:px-4 prose-th:py-3 prose-th:bg-muted/50 prose-th:text-left",
                "prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-border",
                "prose-p:mb-6 prose-p:leading-relaxed prose-p:text-muted-foreground",
                "prose-headings:font-display prose-headings:font-bold",
                "prose-h1:text-3xl prose-h1:mt-12 prose-h1:mb-6",
                "prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5",
                "prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4",
                className
            )}
            dangerouslySetInnerHTML={{ __html: rawHtml }}
        />
    );
}
