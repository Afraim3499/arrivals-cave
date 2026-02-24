import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SeoPageForm } from "./SeoPageForm";

interface SeoPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function PortalSeoEditPage({ params }: SeoPageProps) {
    const resolvedParams = await params;
    const isNew = resolvedParams.id === "new";

    let pageData = null;
    if (!isNew) {
        const supabase = await createServerSupabaseClient();
        const { data } = await supabase.from("seo_landing_pages").select("*").eq("id", resolvedParams.id).single();
        if (!data) notFound();
        pageData = data;
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/portal/seo-pages"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isNew ? "Create SEO Landing Page" : `Edit SEO Page : ${pageData?.title_en}`}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Build dynamic hubs like City Pages, Eid Hubs, or Style categories.
                    </p>
                </div>
            </div>

            <SeoPageForm initialData={pageData} isNew={isNew} />
        </div>
    );
}
