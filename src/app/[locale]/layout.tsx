import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Inter, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { GlobalSchema } from "@/components/seo/GlobalSchema";
// import { Toaster } from "sonner"; 

// Using standard variables
const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "en" | "bn")) {
        notFound();
    }

    setRequestLocale(locale);
    const messages = await getMessages();

    return (
        <html lang={locale} dir="ltr" className="scroll-smooth" suppressHydrationWarning>
            <body
                className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background text-foreground bg-grid-subtle flex flex-col`}
            >
                <NextIntlClientProvider messages={messages}>
                    <Header />
                    <main className="flex-1 pt-[72px] lg:pt-[88px]">
                        {children}
                    </main>
                    <Footer />
                    <CartDrawer />
                    <MobileStickyBar />
                    {/* <Toaster /> */}
                    <GlobalSchema />
                </NextIntlClientProvider>

                {/* GA4 Script Holder (Delayed ID) */}
                {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                    <>
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
                        />
                        <script
                            dangerouslySetInnerHTML={{
                                __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                                        page_path: window.location.pathname,
                                    });
                                `,
                            }}
                        />
                    </>
                )}
            </body>
        </html>
    );
}
