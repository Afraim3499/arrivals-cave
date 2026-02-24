import { getProducts } from "@/lib/products";
import { getCollections } from "@/lib/collections";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ProductForm } from "./ProductForm";

interface ProductPageProps {
    params: Promise<{
        id: string;
        locale: string;
    }>;
}

export default async function PortalProductEditPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    const isNew = resolvedParams.id === "new";

    // We need a specific getProductById, but getProducts() gives us everything,
    // so for simplicity we can just filter it. Ideally, write a getProductById in lib/products.
    let product = null;
    if (!isNew) {
        const products = await getProducts();
        product = products.find((p: any) => p.id === resolvedParams.id);
        if (!product) {
            notFound();
        }
    }

    const collections = await getCollections();

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
            <div className="flex items-center gap-4">
                <Link
                    href="/portal/products"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">
                        {isNew ? "Add New Product" : `Edit Product : ${product?.title}`}
                    </h1>
                    <p className="text-neutral-400 text-sm mt-1">
                        Fill in the details for both English and Bengali locales.
                    </p>
                </div>
            </div>

            {/* Client Component Form */}
            <ProductForm
                initialData={product}
                collections={collections}
                isNew={isNew}
            />
        </div>
    );
}
