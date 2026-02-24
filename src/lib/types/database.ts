export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            collections: {
                Row: {
                    id: string;
                    slug: string;
                    title: string;
                    description: string | null;
                    image_url: string | null;
                    is_active: boolean;
                    created_at: string;
                    title_bn: string | null;
                    description_bn: string | null;
                    meta_title_en: string | null;
                    meta_title_bn: string | null;
                    meta_description_en: string | null;
                    meta_description_bn: string | null;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    title: string;
                    description?: string | null;
                    image_url?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                    title_bn?: string | null;
                    description_bn?: string | null;
                    meta_title_en?: string | null;
                    meta_title_bn?: string | null;
                    meta_description_en?: string | null;
                    meta_description_bn?: string | null;
                };
                Update: {
                    id?: string;
                    slug?: string;
                    title?: string;
                    description?: string | null;
                    image_url?: string | null;
                    is_active?: boolean;
                    created_at?: string;
                    title_bn?: string | null;
                    description_bn?: string | null;
                    meta_title_en?: string | null;
                    meta_title_bn?: string | null;
                    meta_description_en?: string | null;
                    meta_description_bn?: string | null;
                };
            };
            products: {
                Row: {
                    id: string;
                    code: string;
                    title: string;
                    slug: string;
                    description: string | null;
                    price: number;
                    compare_at_price: number | null;
                    collection_id: string | null;
                    stock_by_size: Json;
                    color_label: string | null;
                    color_label_bn: string | null;
                    color_hex: string | null;
                    fabric: string | null;
                    fabric_bn: string | null;
                    sort_order: number;
                    images: string[];
                    tags: string[];
                    is_active: boolean;
                    is_new_arrival: boolean;
                    is_best_seller: boolean;
                    is_eid_pick: boolean;
                    created_at: string;
                    updated_at: string;
                    title_bn: string | null;
                    description_bn: string | null;
                    story_markdown: string | null;
                    story_markdown_bn: string | null;
                    seo_title: string | null;
                    seo_meta: string | null;
                    usp_bullets: string[];
                };
                Insert: {
                    id?: string;
                    code: string;
                    title: string;
                    slug: string;
                    description?: string | null;
                    price?: number;
                    compare_at_price?: number | null;
                    collection_id?: string | null;
                    stock_by_size?: Json;
                    color_label?: string | null;
                    color_label_bn?: string | null;
                    color_hex?: string | null;
                    fabric?: string | null;
                    fabric_bn?: string | null;
                    sort_order?: number;
                    images?: string[];
                    tags?: string[];
                    is_active?: boolean;
                    is_new_arrival?: boolean;
                    is_best_seller?: boolean;
                    is_eid_pick?: boolean;
                    created_at?: string;
                    updated_at?: string;
                    title_bn?: string | null;
                    description_bn?: string | null;
                    story_markdown?: string | null;
                    story_markdown_bn?: string | null;
                    seo_title?: string | null;
                    seo_meta?: string | null;
                    usp_bullets?: string[];
                };
                Update: {
                    id?: string;
                    code?: string;
                    title?: string;
                    slug?: string;
                    description?: string | null;
                    price?: number;
                    compare_at_price?: number | null;
                    collection_id?: string | null;
                    stock_by_size?: Json;
                    color_label?: string | null;
                    color_label_bn?: string | null;
                    color_hex?: string | null;
                    fabric?: string | null;
                    fabric_bn?: string | null;
                    sort_order?: number;
                    images?: string[];
                    tags?: string[];
                    is_active?: boolean;
                    is_new_arrival?: boolean;
                    is_best_seller?: boolean;
                    is_eid_pick?: boolean;
                    created_at?: string;
                    updated_at?: string;
                    title_bn?: string | null;
                    description_bn?: string | null;
                    story_markdown?: string | null;
                    story_markdown_bn?: string | null;
                    seo_title?: string | null;
                    seo_meta?: string | null;
                    usp_bullets?: string[];
                };
            };
            seo_landing_pages: {
                Row: {
                    id: string;
                    slug: string;
                    type: "city" | "search" | "eid" | "style";
                    title: string;
                    meta_description: string | null;
                    h1_heading: string | null;
                    content_markdown: string | null;
                    faq_items: Json;
                    is_active: boolean;
                    created_at: string;
                    title_bn: string | null;
                    meta_description_bn: string | null;
                    h1_heading_bn: string | null;
                    content_markdown_bn: string | null;
                    faq_items_bn: Json;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    type: "city" | "search" | "eid" | "style";
                    title: string;
                    meta_description?: string | null;
                    h1_heading?: string | null;
                    content_markdown?: string | null;
                    faq_items?: Json;
                    is_active?: boolean;
                    created_at?: string;
                    title_bn?: string | null;
                    meta_description_bn?: string | null;
                    h1_heading_bn?: string | null;
                    content_markdown_bn?: string | null;
                    faq_items_bn?: Json;
                };
            };
            blog_posts: {
                Row: {
                    id: string;
                    slug: string;
                    title: string;
                    excerpt: string | null;
                    content_markdown: string | null;
                    featured_image: string | null;
                    cluster: "eid" | "price-city" | "style" | "sizing" | "general";
                    author: string | null;
                    published_at: string | null;
                    is_published: boolean;
                    title_bn: string | null;
                    excerpt_bn: string | null;
                    content_markdown_bn: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    title: string;
                    excerpt?: string | null;
                    content_markdown?: string | null;
                    featured_image?: string | null;
                    cluster: "eid" | "price-city" | "style" | "sizing" | "general";
                    author?: string | null;
                    published_at?: string | null;
                    is_published?: boolean;
                    title_bn?: string | null;
                    excerpt_bn?: string | null;
                    content_markdown_bn?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            home_settings: {
                Row: {
                    id: string;
                    hero_title: string | null;
                    hero_subtitle: string | null;
                    hero_cta_text: string | null;
                    hero_cta_link: string | null;
                    hero_background_image: string | null;
                    eid_banner_visible: boolean;
                    eid_banner_title: string | null;
                    eid_banner_link: string | null;
                    hero_title_bn: string | null;
                    hero_subtitle_bn: string | null;
                    hero_cta_text_bn: string | null;
                    eid_banner_title_bn: string | null;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    hero_title?: string | null;
                    hero_subtitle?: string | null;
                    hero_cta_text?: string | null;
                    hero_cta_link?: string | null;
                    hero_background_image?: string | null;
                    eid_banner_visible?: boolean;
                    eid_banner_title?: string | null;
                    eid_banner_link?: string | null;
                    hero_title_bn?: string | null;
                    hero_subtitle_bn?: string | null;
                    hero_cta_text_bn?: string | null;
                    eid_banner_title_bn?: string | null;
                    updated_at?: string;
                };
            };
        };
    };
}
