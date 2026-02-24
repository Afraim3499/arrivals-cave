"use client";

import { CheckCircle } from "lucide-react";

interface ProductStoryProps {
    story: string;
    uspBullets: string[];
    images?: string[];
    productTitle: string;
}

export function ProductStory({ story, uspBullets, images = [], productTitle }: ProductStoryProps) {
    if (!story && uspBullets.length === 0) return null;

    // Split story into paragraphs for editorial layout
    const paragraphs = story ? story.split(/\n+/).filter(p => p.trim()) : [];

    return (
        <section className="py-16 md:py-24 bg-warm-section">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Section divider */}
                <div className="gold-divider mb-12" />

                {/* Section heading */}
                <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2 gold-underline">
                    The Story
                </h2>
                <p className="text-center text-muted-foreground text-sm mt-6 mb-12">
                    What makes {productTitle} special
                </p>

                {/* Editorial story content */}
                <div className="space-y-6">
                    {paragraphs.map((paragraph, index) => (
                        <div key={index}>
                            <p className="text-foreground/90 leading-[1.85] text-[16.5px] font-sans">
                                {paragraph}
                            </p>

                            {/* Insert a product image between paragraphs for visual rhythm */}
                            {index === 0 && images.length > 1 && (
                                <div className="my-10 rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={images[1]}
                                        alt={`${productTitle} — detail view`}
                                        className="w-full h-auto object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* USP Bullets */}
                {uspBullets.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-border/50">
                        <h3 className="font-display text-lg text-foreground mb-6 text-center">
                            Why Choose {productTitle}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {uspBullets.map((bullet, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 card-premium p-4"
                                >
                                    <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                                    <span className="text-foreground/85 text-sm leading-relaxed">
                                        {bullet}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Second image for visual depth */}
                {images.length > 2 && (
                    <div className="mt-12 rounded-xl overflow-hidden shadow-lg">
                        <img
                            src={images[2]}
                            alt={`${productTitle} — styling view`}
                            className="w-full h-auto object-cover"
                            loading="lazy"
                        />
                    </div>
                )}

                {/* Bottom divider */}
                <div className="gold-divider mt-16" />
            </div>
        </section>
    );
}
