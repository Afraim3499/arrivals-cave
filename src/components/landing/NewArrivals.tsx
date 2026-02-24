import { getNewArrivals } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";

export async function NewArrivals() {
    const products = await getNewArrivals(4);

    if (!products.length) return null;

    return (
        <section className="py-20">
            <Container>
                <SectionHeading title="New Arrivals" subtitle="Fresh from our atelier" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary/10">
                        <Link href="/shop/all">View All New Arrivals</Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}
