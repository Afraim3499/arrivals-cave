"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
    images: string[];
    title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);

    // Categorize images (mock categorization for now based on index)
    // In a real scenario, this would come from metadata
    const categories = {
        product: images.slice(0, 2),
        details: images.slice(2, 4),
        social: images.slice(4),
    };

    const currentImages = images.length > 0 ? images : ["https://placehold.co/800x1000/260C0D/B08A5A?text=No+Image"];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setZoomPosition({ x, y });
    };

    const nextImage = () => setActiveIndex((prev) => (prev + 1) % currentImages.length);
    const prevImage = () => setActiveIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);

    return (
        <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
                className="relative aspect-square overflow-hidden rounded-2xl bg-muted border border-border group cursor-zoom-in"
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsFullscreen(true)}
            >
                <Image
                    src={currentImages[activeIndex]}
                    alt={title}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-200",
                        isZooming ? "scale-150" : "scale-100"
                    )}
                    style={isZooming ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                    } : {}}
                    priority
                    {...({ fetchPriority: "high" } as any)}
                />

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="bg-white/20 backdrop-blur-md rounded-full">
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </div>

                {currentImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {currentImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {currentImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={cn(
                                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                                activeIndex === idx ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`${title} view ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 md:p-12"
                    onClick={() => setIsFullscreen(false)} // Click outside to close
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); }}
                        className="fixed top-4 right-4 md:top-8 md:right-8 z-[10000] text-white hover:bg-white/20 rounded-full h-12 w-12 flex items-center justify-center bg-black/50 backdrop-blur-md cursor-pointer border border-white/10"
                    >
                        <X className="h-6 w-6 text-white relative z-10" />
                        <span className="sr-only">Close fullscreen</span>
                    </Button>

                    <div
                        className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center cursor-default"
                        onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
                    >
                        <Image
                            src={currentImages[activeIndex]}
                            alt={title}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="fixed bottom-6 md:bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-[10000]">
                        <Button
                            variant="secondary"
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full px-6 py-6"
                        >
                            <ChevronLeft className="mr-2 h-5 w-5" /> Previous
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full px-6 py-6"
                        >
                            Next <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
