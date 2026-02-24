import { getProductsByCollection, getProducts } from "@/lib/products";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
    currentProductId: string;
    collectionId: string | null;
}

export async function RelatedProducts({ currentProductId, collectionId }: RelatedProductsProps) {
    const TARGET = 4;

    // Step 1: Get products from same collection
    const collectionProducts = collectionId
        ? (await getProductsByCollection(collectionId)).filter(p => p.id !== currentProductId)
        : [];

    // Step 2: If fewer than TARGET, backfill from sitewide catalog
    let display = collectionProducts.slice(0, TARGET);

    if (display.length < TARGET) {
        const needed = TARGET - display.length;
        const existingIds = new Set([currentProductId, ...display.map(p => p.id)]);
        const backfill = (await getProducts(TARGET + 5))
            .filter(p => !existingIds.has(p.id))
            .slice(0, needed);
        display = [...display, ...backfill];
    }

    if (display.length === 0) return null;

    const isFromSameCollection = collectionProducts.length >= TARGET;

    return (
        <section className="py-16 bg-warm-section">
            <Container>
                <SectionHeading
                    title={isFromSameCollection ? "More from This Collection" : "You Might Also Like"}
                    subtitle="Premium pieces crafted for every occasion"
                    center
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {display.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </Container>
        </section>
    );
}
