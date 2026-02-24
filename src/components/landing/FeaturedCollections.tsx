import { Link } from "@/i18n/routing";
import { Container } from "@/components/layout/Container";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export async function FeaturedCollections() {
    const collections = [
        {
            id: 'eid',
            title: 'Eid Collection 2026',
            image_url: '/images/hero/eid_collection_from_arrivals_cave.webp',
            link: '/eid-panjabi-collection',
            spanClass: 'col-span-2 lg:col-span-6',
            aspectRatio: 'aspect-video'
        },
        {
            id: 'basarah',
            title: 'Basarah',
            image_url: '/products/rameen-br-5002/RAMEEN.webp',
            link: '/shop/basarah',
            spanClass: 'col-span-1 lg:col-span-3',
            aspectRatio: 'aspect-square'
        },
        {
            id: 'heer',
            title: 'Heer',
            image_url: '/products/arzoo-ha-1002/ARZOO.webp',
            link: '/shop/heer',
            spanClass: 'col-span-1 lg:col-span-3',
            aspectRatio: 'aspect-square'
        },
        {
            id: 'muraqsh',
            title: 'Muraqsh',
            image_url: '/products/nehaj-mn-2003/NEHAJ.webp',
            link: '/shop/muraqsh',
            spanClass: 'col-span-1 md:col-span-2 lg:col-span-4',
            aspectRatio: 'aspect-square'
        },
        {
            id: 'zameen',
            title: 'Zameen',
            image_url: '/products/sabzar-zs-3002/SABZAR.webp',
            link: '/shop/zameen',
            spanClass: 'col-span-1 md:col-span-2 lg:col-span-4',
            aspectRatio: 'aspect-square'
        },
        {
            id: 'sirash',
            title: 'Sirash',
            image_url: '/products/shahan-ss-4002/SHAHAN.webp',
            link: '/shop/sirash',
            spanClass: 'col-span-2 md:col-span-2 lg:col-span-4',
            aspectRatio: 'aspect-square'
        }
    ];

    return (
        <section className="py-12 bg-background text-foreground">
            <Container>
                {/* Mobile uses 2 cols, Desktop uses 12 cols to allow fine-grained 6/3/3 and 4/4/4 splits */}
                <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-6 md:gap-8">
                    {collections.map((collection) => (
                        <Link
                            key={collection.id}
                            href={collection.link}
                            className={`group flex flex-col ${collection.spanClass}`}
                        >
                            {/* Image Container */}
                            <div className={`relative w-full overflow-hidden rounded-xl ${collection.aspectRatio} bg-muted`}>
                                <Image
                                    src={collection.image_url}
                                    alt={collection.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>

                            {/* Text Container Below Image */}
                            <div className="mt-4 flex flex-col items-center justify-center text-center px-2">
                                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                    {collection.title}
                                </h3>
                                <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1 mt-1.5 opacity-80 group-hover:opacity-100">
                                    View Collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </Container>
        </section>
    );
}
