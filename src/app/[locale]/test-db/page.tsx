import { getCollections } from "@/lib/products";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function TestDbPage() {
    const collections = await getCollections();

    // Also check if we can query products (should be empty but no error)
    const supabase = await createServerSupabaseClient();
    const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });

    return (
        <div className="p-10 space-y-8">
            <h1 className="text-3xl font-bold text-gold">Database Connection Test</h1>

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Collections (Seed Data)</h2>
                {collections.length === 0 ? (
                    <p className="text-red-500">No collections found. Did you run seed.sql?</p>
                ) : (
                    <ul className="list-disc pl-5 space-y-2">
                        {collections.map((c) => (
                            <li key={c.id} className="text-lg">
                                <span className="font-bold">{c.title}</span>
                                <span className="text-muted-foreground ml-2">({c.title_bn})</span>
                                <br />
                                <span className="text-sm text-gray-500">Slug: {c.slug}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold">Products Count</h2>
                <p>{count !== null ? count : "Error fetching count"} products in DB</p>
            </section>
        </div>
    );
}
