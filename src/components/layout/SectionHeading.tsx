import { cn } from "@/lib/utils";

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
    className?: string;
}

export function SectionHeading({
    title,
    subtitle,
    center = true,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "space-y-2 mb-8 md:mb-12",
                center ? "text-center" : "text-left",
                className
            )}
        >
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {subtitle}
                </p>
            )}
            <div
                className={cn(
                    "h-1 w-20 bg-primary rounded-full mt-4",
                    center ? "mx-auto" : ""
                )}
            />
        </div>
    );
}
