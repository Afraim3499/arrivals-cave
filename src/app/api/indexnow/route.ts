import { NextResponse } from "next/server";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";

const INDEXNOW_KEY = "ecfae3b89af240ea8babd56d082ef558";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://arrivalscavebd.com";
const KEY_LOCATION = `${BASE_URL}/${INDEXNOW_KEY}.txt`;
const HOST = new URL(BASE_URL).hostname;

export async function GET() {
    try {
        const supabase = createPublicSupabaseClient();

        // Fetch all dynamic slugs
        const [{ data: products }, { data: collections }, { data: blogPosts }] = await Promise.all([
            supabase.from("products").select("slug").eq("is_active", true),
            supabase.from("collections").select("slug").eq("is_active", true),
            supabase.from("blog_posts").select("slug").eq("is_published", true),
        ]);

        const locales = ["en", "bn"];

        const staticPaths = [
            "",
            "/premium-panjabi",
            "/eid-panjabi-collection",
            "/eid-premium-embroidered-panjabi",
            "/embroidered-panjabi",
            "/short-panjabi",
            "/black-panjabi",
            "/white-panjabi",
            "/cotton-panjabi",
            "/silk-panjabi",
            "/blog",
            "/contact",
            "/size-guide",
            "/delivery-return",
            "/panjabi-price-in-bangladesh",
            "/panjabi-price-in-dhaka",
            "/panjabi-price-in-chattogram",
            "/panjabi-price-in-sylhet",
            "/panjabi-price-in-coxs-bazar",
        ];

        const urlList: string[] = [];

        locales.forEach((locale) => {
            // Static pages
            staticPaths.forEach((path) => {
                urlList.push(`${BASE_URL}/${locale}${path}`);
            });

            // Collections
            collections?.forEach((c) => {
                urlList.push(`${BASE_URL}/${locale}/shop/${c.slug}`);
            });

            // Products
            products?.forEach((p) => {
                urlList.push(`${BASE_URL}/${locale}/product/${p.slug}`);
            });

            // Blog posts
            blogPosts?.forEach((b) => {
                urlList.push(`${BASE_URL}/${locale}/blog/${b.slug}`);
            });
        });

        // Submit to IndexNow
        const response = await fetch("https://api.indexnow.org/IndexNow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                host: HOST,
                key: INDEXNOW_KEY,
                keyLocation: KEY_LOCATION,
                urlList,
            }),
        });

        if (response.ok) {
            return NextResponse.json({
                success: true,
                message: `Successfully submitted ${urlList.length} URLs to IndexNow.`,
                urlCount: urlList.length,
                status: response.status,
            });
        } else {
            const errorText = await response.text();
            return NextResponse.json(
                {
                    success: false,
                    message: `IndexNow API returned ${response.status}`,
                    error: errorText,
                },
                { status: response.status }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Internal error", error: String(error) },
            { status: 500 }
        );
    }
}
