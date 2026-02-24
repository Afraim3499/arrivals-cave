"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/layout/Container";
import { Star, MessageSquare } from "lucide-react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const REVIEWS = [
    {
        name: "Mujahid Hossain",
        text: "Good price, top quality. recommend ✅",
    },
    {
        name: "S.M. Midhatul Islam Arabi",
        text: "This Eid, I got myself a Panjabi from Arrivals Cave, and I must say, I’m truly impressed! Their products are top-notch in quality, with fabric that is incredibly soft and breathable.",
    },
    {
        name: "Tajwar Karim",
        text: "⭐⭐⭐⭐⭐ Great Panjabis! I recently purchased a Panjabi from AC, and I’m super impressed! Great fabric, perfect fit, and stylish designs. Excellent quality and service—highly recommend!",
    },
    {
        name: "Lazim Ahmed",
        text: "সচরাচর অনলাইন কেনাকাটাই এত ভালো মানের ফেব্রীকের পান্জাবী পাওয়া যায় না। তবে আপনাদের কাপড় এর মান ও ডিজাইন উভয়ই উন্নত আর আমার মন মতো হয়েছে। 😊",
    },
    {
        name: "Shahriar Arafat",
        text: "I recently purchased outfits from Arrivals Cave , and I must say I’m highly impressed!! The quality of their clothing is excellent—well-stitched, comfortable, and exactly as described. The fabric feels premium, and the designs are stylish and trendy. Their customer service is also top-notch. They were responsive, helpful, and ensured a smooth shopping experience. Delivery was prompt, and the packaging was secure, keeping the items in perfect condition. Overall, I highly recommend Arrivals Cave for anyone looking for high-quality outfits with great service. I will definitely shop with them again!",
    },
    {
        name: "Sarfaraz Newaz Nayem",
        text: "Apnader panjabir quality onek valo lage..online a ei akta page dekhlam jader upor trust rekhe panjabi nite pari.",
    },
    {
        name: "Mishkat Quader Chowdhury",
        text: "Absolutely love this clothing page! The quality of the clothes is top-notch, and the designs are stylish and trendy. Everything I ordered fit perfectly, and the material feels super comfortable. The customer service was also excellent—they responded quickly and made sure my order arrived on time. If you're looking for fashionable and affordable outfits, this is definitely the place to shop. Highly recommend!",
    },
    {
        name: "MD Tohedur Rahaman Khan",
        text: "শার্ট নিয়ে ছিলাম। কোয়ালেটি গুলো খুবই ভালো। আর সার্ভিস খুবই জোস। ধন্যবাদ।❤️",
    },
    {
        name: "Farjana Mukta",
        text: "আসসালামু ওয়ালায়কুম এই ফার্স্ট ভাইয়ার থেকে দুটো পাঞ্জাবি অর্ডার করেছিলাম, আলহামদুলিল্লাহ যেমন কালার ও সাইজ অর্ডার করেছিলাম; তেমনটাই পেয়েছি। অনেক ধন্যবাদ!!😊",
    },
    {
        name: "Binimoy Nath Antu",
        text: "Got my Black panjabi intact. Good quality fabric, good behavior, good peoples❤",
    },
    {
        name: "Kaspia Nourin",
        text: "First Time Purchase from this Page. Alhamdulillah I am so so so much Happy 😍😍. Inshaallah second time will be purchase..",
    }
];

export function Testimonials() {
    return (
        <section className="py-20 bg-muted/30">
            <Container>
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Trusted by thousands. Here are some of the real Facebook reviews from our happy customers.
                    </p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full relative"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {REVIEWS.map((review, index) => (
                            <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                                <div className="bg-background border border-border rounded-xl p-6 h-full flex flex-col shadow-sm">
                                    <div className="flex text-gold mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground text-sm italic mb-6 flex-grow leading-relaxed">
                                        &quot;{review.text}&quot;
                                    </p>
                                    <div className="mt-auto flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">{review.name}</p>
                                            <div className="flex items-center text-xs text-muted-foreground gap-1">
                                                <MessageSquare className="w-3 h-3" />
                                                Facebook Review
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Navigation Buttons inside Container boundary */}
                    <div className="flex justify-center gap-4 mt-8">
                        <CarouselPrevious className="position-static sm:relative inset-auto translate-y-0 translate-x-0 h-12 w-12 bg-background border-border hover:bg-muted" />
                        <CarouselNext className="position-static sm:relative inset-auto translate-y-0 translate-x-0 h-12 w-12 bg-background border-border hover:bg-muted" />
                    </div>
                </Carousel>
            </Container>
        </section>
    );
}

