"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { ArrowRight, Search } from "lucide-react";
import { SearchModal } from "@/components/layout/SearchModal";
import { HomeSettings } from "@/lib/settings";

interface HeroProps {
    settings?: HomeSettings | null;
}

export function Hero({ settings }: HeroProps) {
    const t = useTranslations("common");

    // Use settings for dynamic content if available, else standard slides
    const slides = [
        {
            id: 1,
            image: settings?.hero_background_image || "/images/hero/premium_panjabi_from_arrivals_cave.webp",
            titleKey: settings?.hero_title || "Elevate Your Style",
            subtitleKey: settings?.hero_subtitle || "Handcrafted luxury for the modern gentleman.",
            ctaText: settings?.hero_cta_text || t("shopNow"),
            link: settings?.hero_cta_link || "/shop/premium-panjabi"
        },
        {
            id: 2,
            image: "/images/hero/eid_collection_from_arrivals_cave.webp",
            titleKey: t("eidCollection"),
            subtitleKey: "Celebrate with elegance and tradition.",
            ctaText: t("shopEid"),
            link: "/eid-panjabi-collection"
        },
        {
            id: 3,
            image: "/images/hero/new_arrivals_from_arrivals_cave.webp",
            titleKey: t("newArrivals"),
            subtitleKey: "Fresh designs just for you.",
            ctaText: t("shopNew"),
            link: "/shop/all"
        }
    ];

    return (
        <section className="w-full bg-background pt-8 pb-12">
            <div className="container mx-auto px-4 md:px-6">

                {/* Massive Placement: Prominent Search Bar */}
                <div className="mb-6 lg:mb-8 w-full max-w-3xl mx-auto">
                    <SearchModal trigger={
                        <button className="flex w-full items-center gap-4 px-6 py-4 text-lg text-muted-foreground bg-card hover:bg-muted border-2 border-primary/20 hover:border-primary/50 rounded-full transition-all shadow-md group">
                            <Search className="h-6 w-6 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="flex-1 text-left font-medium">Find your perfect Panjabi style, fabric, or city...</span>
                            <kbd className="pointer-events-none hidden h-8 select-none items-center gap-1 rounded-md border bg-background px-2.5 font-mono text-[13px] font-bold opacity-100 sm:flex shrink-0 text-muted-foreground shadow-sm">
                                <span className="text-sm">⌘</span>K
                            </kbd>
                        </button>
                    } />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Side: Hero Slider (16:9 Aspect Ratio) */}
                    <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-lg aspect-video">
                        <Swiper
                            modules={[Autoplay, Pagination, EffectFade]}
                            effect="fade"
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            loop={true}
                            className="h-full w-full"
                        >
                            {slides.map((slide) => (
                                <SwiperSlide key={slide.id} className="relative h-full w-full">
                                    <Link href={slide.link} className="absolute inset-0 z-30 block w-full h-full">
                                        <span className="sr-only">View {slide.titleKey}</span>
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
                                    <Image
                                        src={slide.image}
                                        alt="Hero Banner"
                                        fill
                                        className="object-cover pointer-events-none"
                                        priority={slide.id === 1}
                                        {...(slide.id === 1 ? { fetchPriority: "high" } : {}) as any}
                                    />
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-end text-center px-4 pb-12 md:pb-20 pointer-events-none">
                                        {/* Visually hidden but present for SEO/Accessibility */}
                                        <h1 className="sr-only">{slide.titleKey}</h1>
                                        <p className="sr-only">{slide.subtitleKey}</p>

                                        <Button
                                            size="lg"
                                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 shadow-glow pointer-events-auto relative z-40"
                                        >
                                            {slide.ctaText} <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Right Side: Offers & Categories Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-6 h-full">
                        {/* Top Block: Offer/App Promo (Reduced Height) */}
                        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-5 flex flex-col justify-center items-center text-center border border-primary/20 shadow-sm relative overflow-hidden group shrink-0">
                            <div className="absolute inset-0 bg-grid-subtle text-primary/5 pattern-opacity-50" />
                            <div className="relative z-10 w-full space-y-2">
                                <span className="inline-block px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                                    Special Offer
                                </span>
                                <h3 className="font-display text-xl font-bold text-foreground leading-tight">
                                    20% Discount
                                </h3>
                                <p className="text-xs text-foreground/80 font-medium">
                                    On Every Panjabi Order!
                                </p>
                                <Button asChild size="sm" className="w-full mt-2 bg-primary hover:bg-primary/90 shadow-md transition-all group-hover:scale-[1.02]">
                                    <Link href="/shop/all">
                                        Shop Now
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        {/* Bottom Block: Categories List (Fills remaining space) */}
                        <div className="flex-1 bg-card rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden flex flex-col">
                            <h3 className="font-display text-base font-bold text-foreground mb-3 pb-2 border-b border-border/50 shrink-0">
                                Our Collections
                            </h3>
                            <ul className="space-y-1.5 flex-1 flex flex-col justify-between">
                                {[
                                    { name: "Basarah - Classic", link: "/shop/basarah" },
                                    { name: "Heer - Premium Silk", link: "/shop/heer" },
                                    { name: "Muraqsh - Artisan", link: "/shop/muraqsh" },
                                    { name: "Zameen - Earthy Linen", link: "/shop/zameen" },
                                    { name: "Sirash - Minimal", link: "/shop/sirash" }
                                ].map((cat, i) => (
                                    <li key={i}>
                                        <Link
                                            href={cat.link}
                                            className="group flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                                        >
                                            <span className="text-xs md:text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                                                {cat.name}
                                            </span>
                                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
