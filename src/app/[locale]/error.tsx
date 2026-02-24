"use client";

import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations("common");

    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center py-20">
            <Container>
                <div className="max-w-md mx-auto text-center space-y-8">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                        <AlertTriangle className="h-10 w-10" />
                    </div>

                    <div className="space-y-2">
                        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
                            Something went wrong!
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            We encountered an unexpected error. Don't worry, our team has been notified.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            onClick={() => reset()}
                            variant="default"
                            size="lg"
                            className="rounded-full px-8 h-12"
                        >
                            <RefreshCcw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 h-12"
                        >
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>

                    {error.digest && (
                        <p className="text-xs text-muted-foreground pt-8 font-mono">
                            Error ID: {error.digest}
                        </p>
                    )}
                </div>
            </Container>
        </div>
    );
}
