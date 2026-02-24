import { Container } from "@/components/layout/Container";
import { Product } from "@/lib/products";

interface PriceRangeInfoProps {
    products: Product[];
    locale: string;
}

export function PriceRangeInfo({ products, locale }: PriceRangeInfoProps) {
    if (!products || products.length === 0) return null;

    const prices = products.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const isEN = locale === "en";

    return (
        <div className="bg-muted/10 py-6 border-y border-border/50 my-12">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>
                        {isEN
                            ? `Collection Price Range: ৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}`
                            : `কালেকশন প্রাইস রেঞ্জ: ৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}`
                        }
                    </p>
                    <p className="font-medium text-foreground">
                        {isEN
                            ? `${products.length} Premium Products Found`
                            : `${products.length}টি প্রিমিয়াম প্রোডাক্ট পাওয়া গেছে`
                        }
                    </p>
                </div>
            </Container>
        </div>
    );
}
