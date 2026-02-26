import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { setRequestLocale } from "next-intl/server";

export const revalidate = false;

export default async function DeliveryReturnPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isBN = locale === "bn";

    return (
        <div className="pb-20">
            <div className="bg-muted/30 py-16 mb-12 border-b border-border">
                <Container>
                    <SectionHeading
                        title={isBN ? "ডেলিভারি ও রিটার্ন" : "Delivery & Return"}
                        subtitle={isBN ? "সারা বাংলাদেশে আমাদের শিপিং ও রিটার্ন পলিসি সম্পর্কে জানুন" : "Everything you need to know about our shipping and return policies across Bangladesh."}
                        center
                    />
                </Container>
            </div>

            <Container>
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Delivery Section */}
                        <div className="bg-card p-10 rounded-2xl border border-border shadow-sm flex flex-col items-start h-full">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-6 font-display">{isBN ? "ডেলিভারি তথ্য" : "Delivery Information"}</h2>
                            <ul className="space-y-6 text-muted-foreground flex-1">
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p><span className="font-bold text-foreground">{isBN ? "চট্টগ্রাম শহর:" : "Inside Chattogram:"}</span> {isBN ? "৭০ টাকা (২৪–৪৮ ঘণ্টা)" : "70 BDT (24–48 hours)"}</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p><span className="font-bold text-foreground">{isBN ? "চট্টগ্রামের বাইরে:" : "Outside Chattogram:"}</span> {isBN ? "১৩০–১৫০ টাকা (২-৩ দিন)" : "130–150 BDT (2-3 days)"}</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p>{isBN ? "আমরা সেরা কুরিয়ার সার্ভিসের মাধ্যমে নিরাপদ ডেলিভারি নিশ্চিত করি।" : "We partner with leading couriers like RedX and Sundarban for secure transit."}</p>
                                </li>
                            </ul>
                        </div>

                        {/* Return Section */}
                        <div className="bg-card p-10 rounded-2xl border border-border shadow-sm flex flex-col items-start h-full">
                            <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l4 2"></path></svg>
                            </div>
                            <h2 className="text-2xl font-bold mb-6 font-display">{isBN ? "রিটার্ন ও এক্সচেঞ্জ পলিসি" : "Return & Exchange Policy"}</h2>
                            <ul className="space-y-6 text-muted-foreground flex-1">
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p>{isBN ? "ডেলিভারি ম্যানের উপস্থিতিতে পণ্য যাচাই করে নিন।" : "Please check your items thoroughly in front of the delivery professional."}</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p>{isBN ? "৭ দিনের মধ্যে সাইজ পরিবর্তনের জন্য এক্সচেঞ্জ করা যাবে।" : "Size-related exchange requests must be initiated within 7 days of delivery."}</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                                    <p>{isBN ? "ট্যাগসহ অবিকৃত অবস্থায় পণ্য রিটার্ন করতে হবে।" : "Items must be unworn, unwashed, and in original packaging with tags intact."}</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Cashback Policy Box */}
                    <div className="mt-8 bg-primary/10 border border-primary/30 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6">
                        <div className="h-14 w-14 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"></path><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-2 font-display text-primary">{isBN ? "ক্যাশবাক পলিসি" : "Cashback Policy"}</h2>
                            <p className="text-muted-foreground">
                                {isBN
                                    ? "প্রতি ৩১০০ টাকার কেনাকাটায় ১৭০ টাকা ক্যাশবাক উপভোগ করুন (সর্বোচ্চ ৬৮০ টাকা পর্যন্ত)। সম্পূর্ণ মূল্য পরিশোধের পর বিকাশ বা নগদের মাধ্যমে আপনার অ্যাকাউন্টে ক্যাশবাক প্রদান করা হবে।"
                                    : "Enjoy a ৳170 cashback on every ৳3,100 spent (up to a maximum of ৳680). The cashback amount will be verified and sent directly to your bKash or Nagad account after the full payment is completed."}
                            </p>
                        </div>
                    </div>

                    {/* Guarantee Box */}
                    <div className="mt-8 bg-card border border-border p-8 rounded-2xl text-center shadow-sm">
                        <p className="font-medium text-foreground">
                            {isBN ? "আমাদের মূল লক্ষ্য আপনার সন্তুষ্টি। যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন।" : "Our primary goal is your satisfaction. For any assistance, reach out to our support team."}
                        </p>
                    </div>
                </div>
            </Container>
        </div>
    );
}
