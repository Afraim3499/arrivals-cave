import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const revalidate = false; // SSG only

export default async function SizeGuidePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("common");

    return (
        <div className="pb-20">
            <div className="bg-muted/30 py-16 mb-12 border-b border-border">
                <Container>
                    <SectionHeading
                        title={t("sizeGuide")}
                        subtitle="Ensure the perfect fit for your Arrivals Cave premium Panjabi. Our sizes follow a relaxed yet sophisticated silhouette."
                        center
                    />
                </Container>
            </div>

            <Container>
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Table Section */}
                        <div className="bg-card p-1 rounded-2xl border border-border overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-muted/50 text-muted-foreground uppercase tracking-widest text-[10px] font-bold">
                                            <th className="px-6 py-4 text-left">Size</th>
                                            <th className="px-6 py-4 text-center">Chest (Inches)</th>
                                            <th className="px-6 py-4 text-center">Length (Inches)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {[
                                            { s: "Medium (M)", c: '40"', l: '40"' },
                                            { s: "Large (L)", c: '42"', l: '42"' },
                                            { s: "Extra Large (XL)", c: '44"', l: '44"' },
                                            { s: "XXL", c: '46"', l: '46"' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-muted/30 transition-colors">
                                                <td className="px-6 py-5 font-bold">{row.s}</td>
                                                <td className="px-6 py-5 text-center font-mono text-primary">{row.c}</td>
                                                <td className="px-6 py-5 text-center font-mono text-primary">{row.l}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="space-y-8">
                            <div className="bg-muted/20 p-8 rounded-2xl border border-border/50">
                                <h3 className="font-display text-xl font-bold mb-4">How to Measure</h3>
                                <ul className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                                        <p><span className="font-bold text-foreground">Chest:</span> Wrap a tape measure around the fullest part of your chest, ensuring it's level under your arms.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                                        <p><span className="font-bold text-foreground">Length:</span> Measure from the highest point of your shoulder down to your desired length.</p>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">3</span>
                                        <p><span className="font-bold text-foreground">Sleeve:</span> Start from the shoulder tip and measure down to the wrist bone.</p>
                                    </li>
                                </ul>
                            </div>

                            <div className="p-8 border-2 border-dashed border-border rounded-2xl text-center">
                                <p className="text-sm text-muted-foreground italic">
                                    "Still unsure? Contact our style experts on WhatsApp for personalized size recommendations."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
}
