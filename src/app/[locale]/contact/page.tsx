import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { setRequestLocale } from "next-intl/server";
import { MessageSquare, Phone, Instagram, Facebook, Mail, MapPin } from "lucide-react";

export const revalidate = false;

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isBN = locale === "bn";

    const channels = [
        {
            icon: MessageSquare,
            title: isBN ? "WhatsApp-এ অর্ডার করুন" : "Order via WhatsApp",
            value: "+880 1626-748116",
            link: "https://wa.me/8801626748116",
            color: "text-green-500"
        },
        {
            icon: Phone,
            title: isBN ? "সরাসরি কল করুন" : "Call Us",
            value: "01626-748116",
            link: "tel:+8801626748116",
            color: "text-blue-500"
        },
        {
            icon: Mail,
            title: isBN ? "ইমেইল করুন" : "Email Us",
            value: "arrivalscave@gmail.com",
            link: "mailto:arrivalscave@gmail.com",
            color: "text-orange-500"
        },
        {
            icon: Instagram,
            title: "Instagram",
            value: "@arrivals_cave",
            link: "https://www.instagram.com/arrivals_cave/",
            color: "text-pink-500"
        },
        {
            icon: Facebook,
            title: "Facebook",
            value: "Arrivals Cave",
            link: "https://www.facebook.com/ArrivalsCaveOfficial",
            color: "text-blue-600"
        }
    ];

    return (
        <div className="pb-20">
            <div className="bg-muted/30 py-16 mb-12 border-b border-border">
                <Container>
                    <SectionHeading
                        title={isBN ? "যোগাযোগ করুন" : "Get in Touch"}
                        subtitle={isBN ? "যেকোনো জিজ্ঞাসায় আমরা আপনার পাশে আছি" : "Whether you have a question about our collections or need style advice, we're here to help."}
                        center
                    />
                </Container>
            </div>

            <Container>
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Channels Grid */}
                        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {channels.map((channel) => (
                                <a
                                    key={channel.title}
                                    href={channel.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-card p-10 rounded-3xl border border-border hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden flex flex-col items-center text-center"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

                                    <div className={`h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <channel.icon className={`h-8 w-8 ${channel.color}`} />
                                    </div>

                                    <h3 className="font-display text-xl font-bold mb-2">{channel.title}</h3>
                                    <p className="text-muted-foreground font-medium group-hover:text-primary transition-colors">
                                        {channel.value}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Connect Now</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                    </div>
                                </a>
                            ))}
                        </div>

                        {/* Store Info / Extra */}
                        <div className="space-y-6">
                            <div className="bg-primary text-primary-foreground p-10 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                                <h3 className="font-display text-2xl font-bold mb-6">Our Promise</h3>
                                <p className="text-primary-foreground/80 leading-relaxed mb-8">
                                    "We believe that traditional attire is a celebration of identity. At Arrivals Cave, we ensure that every thread reflects the excellence you deserve."
                                </p>
                                <div className="space-y-4 pt-4 border-t border-primary-foreground/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <p className="text-sm font-medium">Bespoke Quality Checks</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <p className="text-sm font-medium">Hand-picked Premium Fabrics</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                        <p className="text-sm font-medium">Nationwide Reliable Delivery</p>
                                    </div>
                                </div>
                            </div>

                            {/* Store Address */}
                            <div className="bg-muted/30 p-8 rounded-3xl border border-border">
                                <div className="flex items-start gap-3 mb-4">
                                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-foreground text-sm mb-1">Our Showroom</p>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            G/D 13 No. Road, Chandgaon Residential Area<br />
                                            Chandgaon, Chattogram 4211
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                                    {isBN ? "আমাদের কাস্টমার সেবা সকাল ১০টা থেকে রাত ৮টা পর্যন্ত চালু থাকে।" : "Concierge service available daily 10:00 AM – 8:00 PM (BST)."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
