"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "@/app/globals.css";

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

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4`}>
                <div className="max-w-md w-full text-center space-y-6">
                    <h1 className="text-4xl font-display font-bold">Something went wrong</h1>
                    <p className="text-muted-foreground">
                        An unexpected error occurred. Our team has been notified.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    );
}
