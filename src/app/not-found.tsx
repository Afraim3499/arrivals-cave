import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import Link from "next/link";

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

export default function NotFound() {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4`}>
                <div className="max-w-md w-full text-center space-y-6">
                    <h1 className="text-6xl font-display font-bold">404</h1>
                    <h2 className="text-2xl font-display font-bold">Page Not Found</h2>
                    <p className="text-muted-foreground">
                        The page you are looking for doesn't exist or has been moved.
                    </p>
                    <Link
                        href="/en"
                        className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </body>
        </html>
    );
}
