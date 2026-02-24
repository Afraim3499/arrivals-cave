import { BlogCard } from "./BlogCard";
import { BlogPost } from "@/lib/blog";

export function BlogGrid({ posts, locale }: { posts: BlogPost[]; locale: "en" | "bn" }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
                <BlogCard key={post.id} post={post} locale={locale} />
            ))}
        </div>
    );
}
