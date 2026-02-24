import { NextResponse } from "next/server";
import { searchProducts } from "@/lib/products";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";

    if (!q) {
        return NextResponse.json([]);
    }

    const products = await searchProducts({ q, limit: 10 });
    return NextResponse.json(products);
}
