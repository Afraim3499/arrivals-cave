import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicSupabaseClient } from "@/lib/supabase/public-server";
import { Database } from "@/lib/types/database";

export type Product = Database["public"]["Tables"]["products"]["Row"] & {
    collection?: Database["public"]["Tables"]["collections"]["Row"] | null;
};
export type Collection = Database["public"]["Tables"]["collections"]["Row"];

export interface ProductFilter {
    q?: string;
    collectionId?: string;
    tag?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    inStock?: boolean;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'best_sellers';
    limit?: number;
    offset?: number;
}

export function getProductPrices(product: { price: number; compare_at_price?: number | null }) {
    const discountPercent = 20;
    const isDiscounted = true;
    const originalPrice = product.price;
    const currentPrice = Math.round(product.price * 0.8);

    return { isDiscounted, currentPrice, originalPrice, discountPercent };
}

// --- Server-side Queries (Public) ---

export async function searchProducts(filter: ProductFilter = {}) {
    const supabase = createPublicSupabaseClient();
    let query = supabase
        .from("products")
        .select("*, collection:collections(*)")
        .eq("is_active", true);

    if (filter.collectionId) {
        query = query.eq("collection_id", filter.collectionId);
    }

    if (filter.q) {
        // Broad search across title, code, color, fabric, and ingested seo_meta keywords
        query = query.or(`title.ilike.%${filter.q}%,code.ilike.%${filter.q}%,seo_meta.ilike.%${filter.q}%,color_label.ilike.%${filter.q}%,fabric.ilike.%${filter.q}%`);
    }

    if (filter.tag) {
        query = query.contains("tags", [filter.tag]);
    }

    if (filter.minPrice !== undefined) {
        query = query.gte("price", filter.minPrice);
    }

    if (filter.maxPrice !== undefined) {
        query = query.lte("price", filter.maxPrice);
    }


    // Size filtering is complex with JSONB in Supabase JS client
    // We'll filter sizes in-memory for now if provided, or use a custom RPC if performance becomes an issue
    // Requirement 6.4 mentions sizes @> ARRAY[selected] but that assumes sizes is an array
    // Our schema has stock_by_size as JSONB { "M": 10, ... }

    // Sorting
    const sort = filter.sort || 'newest';
    switch (sort) {
        case 'price_asc':
            query = query.order('price', { ascending: true });
            break;
        case 'price_desc':
            query = query.order('price', { ascending: false });
            break;
        case 'best_sellers':
            query = query.order('is_best_seller', { ascending: false }).order('sort_order', { ascending: true });
            break;
        case 'newest':
        default:
            query = query.order('created_at', { ascending: false });
            break;
    }

    if (filter.limit) {
        query = query.limit(filter.limit);
    }

    if (filter.offset) {
        query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error searching products:", error);
        return [];
    }

    let results = data as Product[];

    // In-memory filter for sizes and total stock availability
    if (filter.sizes && filter.sizes.length > 0) {
        results = results.filter(p => {
            const stock = p.stock_by_size as Record<string, number>;
            return filter.sizes?.some(s => stock[s] > 0);
        });
    }

    if (filter.inStock) {
        results = results.filter(p => {
            const stock = p.stock_by_size as Record<string, number>;
            return Object.values(stock).some(v => v > 0);
        });
    }

    return results;
}

export async function getProducts(limit = 10) {
    return searchProducts({ limit });
}

const _getCollectionsCached = unstable_cache(
    async () => {
        const supabase = createPublicSupabaseClient();
        const { data, error } = await supabase
            .from("collections")
            .select("*")
            .eq("is_active", true)
            .order("title");

        if (error) {
            console.error("Error fetching collections:", error);
            return [];
        }
        return data as Collection[];
    },
    ["collections"],
    { revalidate: 3600 }
);

export const getCollections = cache(() => _getCollectionsCached());

export const getNewArrivals = async (limit = 4) => {
    return searchProducts({ limit, sort: 'newest' });
};

export const getEidPicks = async (limit = 4) => {
    const supabase = createPublicSupabaseClient();
    const { data, error } = await supabase
        .from("products")
        .select("*, collection:collections(*)")
        .eq("is_active", true)
        .eq("is_eid_pick", true)
        .limit(limit);

    if (error) return [];
    return data as Product[];
};

export const getProductBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            const supabase = createPublicSupabaseClient();
            const { data, error } = await supabase
                .from("products")
                .select("*, collection:collections(*)")
                .eq("slug", slug)
                .single();

            if (error) return null;
            return data as Product;
        },
        ["product-by-slug", slug],
        { revalidate: 1800 }
    )();
});

export const getCollectionBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            const supabase = createPublicSupabaseClient();
            const { data, error } = await supabase
                .from("collections")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) return null;
            return data as Collection;
        },
        ["collection-by-slug", slug],
        { revalidate: 3600 }
    )();
});

export const getSEOLandingPage = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            const supabase = createPublicSupabaseClient();
            const { data, error } = await supabase
                .from("seo_landing_pages")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) return null;
            return data as Database["public"]["Tables"]["seo_landing_pages"]["Row"];
        },
        ["seo-landing-page", slug],
        { revalidate: 86400 }
    )();
});

export const getProductsByCollection = async (collectionId: string, options: Partial<ProductFilter> = {}) => {
    return searchProducts({ ...options, collectionId });
};

export const getProductsByTag = async (tag: string, options: Partial<ProductFilter> = {}) => {
    return searchProducts({ ...options, tag });
};

// --- Default listing helpers (cached, no collection join) ---

/**
 * Returns true when the filter represents the default/unfiltered shop page.
 * Used by the shop route to decide between cached vs dynamic query paths.
 */
export function isDefaultFilter(filter: Partial<ProductFilter>): boolean {
    return (
        !filter.q &&
        !filter.tag &&
        filter.minPrice === undefined &&
        filter.maxPrice === undefined &&
        (!filter.sizes || filter.sizes.length === 0) &&
        !filter.inStock &&
        (!filter.sort || filter.sort === "newest") &&
        !filter.limit &&
        !filter.offset
    );
}

/**
 * Cached default listing: all active products, newest first, no collection join.
 * Used when /shop/all has no query-string filters.
 */
const _getAllProductsDefaultCached = unstable_cache(
    async () => {
        const supabase = createPublicSupabaseClient();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching all products (default):", error);
            return [];
        }
        return data as Product[];
    },
    ["all-products-default"],
    { revalidate: 3600 }
);

export const getAllProductsDefault = cache(() => _getAllProductsDefaultCached());

/**
 * Cached default listing: products in a specific collection, newest first, no collection join.
 * Used when /shop/{collection} has no query-string filters.
 */
export const getProductsByCollectionDefault = cache(async (collectionId: string) => {
    return unstable_cache(
        async () => {
            const supabase = createPublicSupabaseClient();
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .eq("collection_id", collectionId)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching collection products (default):", error);
                return [];
            }
            return data as Product[];
        },
        ["collection-products-default", collectionId],
        { revalidate: 3600 }
    )();
});

/**
 * Cached default listing: products by tag, newest first, no collection join.
 * Used by tag-based SEO pages (black-panjabi, eid-collection, etc.) when no filters are active.
 */
export const getProductsByTagDefault = cache(async (tag: string) => {
    return unstable_cache(
        async () => {
            const supabase = createPublicSupabaseClient();
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("is_active", true)
                .contains("tags", [tag])
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching tag products (default):", error);
                return [];
            }
            return data as Product[];
        },
        ["tag-products-default", tag],
        { revalidate: 3600 }
    )();
});

/**
 * Cached default listing: new arrival products, newest first, no collection join.
 * Used by /new-arrivals when no filters are active.
 */
const _getNewArrivalsDefaultCached = unstable_cache(
    async () => {
        const supabase = createPublicSupabaseClient();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", true)
            .eq("is_new_arrival", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching new arrivals (default):", error);
            return [];
        }
        return data as Product[];
    },
    ["new-arrivals-default"],
    { revalidate: 3600 }
);

export const getNewArrivalsDefault = cache(() => _getNewArrivalsDefaultCached());
