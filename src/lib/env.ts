import { z } from "zod/v4";

const envSchema = z.object({
    NEXT_PUBLIC_SUPABASE_URL: z.url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
    NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().regex(/^880\d{10}$/),
    NEXT_PUBLIC_SITE_URL: z.url(),
    NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(["en", "bn"]),
});

export type Env = z.infer<typeof envSchema>;

// Only validate on server at startup
export function validateEnv() {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
        console.error("❌ Invalid environment variables:", result.error.format());
        throw new Error("Invalid environment variables");
    }
    return result.data;
}
