import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BlogForm } from "./BlogForm";

interface BlogPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function PortalBlogEditPage({ params }: BlogPageProps) {
    const resolvedParams = await params;
    const isNew = resolvedParams.id === "new";

    let postData = null;
    if (!isNew) {
        const supabase = await createServerSupabaseClient();
        const { data } = await supabase.from("blog_posts").select("*").eq("id", resolvedParams.id).single();
        if (!data) notFound();
        postData = data;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/portal/blog"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isNew ? "Write New Article" : `Edit Article : ${postData?.title_en}`}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Publish bilingual content with our rich text editor.
                    </p>
                </div>
            </div>

            <BlogForm initialData={postData} isNew={isNew} />
        </div>
    );
}
