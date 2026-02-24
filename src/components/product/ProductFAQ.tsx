"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const DEFAULT_FAQ_ITEMS: FAQItem[] = [
    {
        question: "Delivery time in Dhaka?",
        answer: "We deliver within Dhaka in 1-2 business days. All Dhaka orders are dispatched same-day if placed before 2PM."
    },
    {
        question: "Delivery in Chattogram?",
        answer: "Chattogram deliveries take 2-3 business days via our trusted courier partner. You'll receive tracking updates via SMS."
    },
    {
        question: "Cox's Bazar delivery available?",
        answer: "Yes! We deliver to Cox's Bazar within 3-5 business days. Nationwide delivery is available across all 64 districts."
    },
    {
        question: "Cash on delivery available?",
        answer: "Yes, Cash on Delivery (COD) is available for all orders across Bangladesh. You can also pay via bKash, Nagad, or card."
    },
    {
        question: "Can I exchange the size?",
        answer: "Absolutely. We offer easy size exchange within 3 days of delivery. Just message us on WhatsApp and we'll arrange the exchange."
    }
];

interface ProductFAQProps {
    productTitle: string;
    customItems?: FAQItem[];
}

export function ProductFAQ({ productTitle, customItems }: ProductFAQProps) {
    const items = customItems || DEFAULT_FAQ_ITEMS;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-16 md:py-20 bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                <h2 className="font-display text-2xl md:text-3xl text-foreground text-center mb-2 gold-underline">
                    Frequently Asked
                </h2>
                <p className="text-center text-muted-foreground text-sm mt-6 mb-10">
                    Common questions about ordering {productTitle}
                </p>

                <div className="space-y-3">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="card-premium overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left"
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-medium text-foreground text-sm md:text-base">
                                    {item.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ml-4 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">
                                    {item.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* JSON-LD FAQ Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": items.map(item => ({
                                "@type": "Question",
                                "name": item.question,
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": item.answer
                                }
                            }))
                        })
                    }}
                />
            </div>
        </section>
    );
}
