import { getCollections } from "@/lib/collections";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CollectionForm } from "./CollectionForm";

interface CollectionPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function PortalCollectionEditPage({ params }: CollectionPageProps) {
    const resolvedParams = await params;
    const isNew = resolvedParams.id === "new";

    let collection = null;
    if (!isNew) {
        const collections = await getCollections();
        collection = collections.find((c: any) => c.id === resolvedParams.id);
        if (!collection) {
            notFound();
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/portal/collections"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isNew ? "Create New Collection" : `Edit Collection : ${collection?.title}`}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Fill in the details for both English and Bengali locales.
                    </p>
                </div>
            </div>

            <CollectionForm initialData={collection} isNew={isNew} />
        </div>
    );
}
