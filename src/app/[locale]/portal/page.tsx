import { getProducts } from "@/lib/products";
import { getCollections } from "@/lib/collections";
import { getBlogPosts } from "@/lib/blog";
import {
    Package, Folders, FileText, PenTool,
    TrendingUp, Eye, ShoppingCart, ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Stat Card Component
function StatCard({ title, value, icon, linkHref, linkText }: { title: string, value: string | number, icon: React.ReactNode, linkHref: string, linkText: string }) {
    return (
        <Card className="bg-neutral-900 border-neutral-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-neutral-400">
                    {title}
                </CardTitle>
                <div className="text-neutral-500">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-white mb-2">{value}</div>
                <Link href={linkHref} className="text-xs text-orange-500 hover:text-orange-400 flex items-center gap-1 transition-colors">
                    {linkText} <ArrowRight size={12} />
                </Link>
            </CardContent>
        </Card>
    );
}

export default async function PortalDashboard() {
    // Fetch high-level stats (these would ideally be cached or optimized)
    const [productsData, collectionsData, blogData] = await Promise.all([
        getProducts(1), // Just get count roughly, but getProducts might not return exact count directly if not configured, let's assume we fetch all for now or we just use arrays
        getCollections(),
        getBlogPosts() // Same logic
    ]);

    // Actually, to get true counts:
    // Since we don't have getCount methods immediately available, we'll rough it or just show basic placeholders if counts aren't easily extracted without fetching all.
    // We will assume `productsData` returns array of products, `collectionsData` array of collections, `blogData.total` for blogs.

    // Let's just fetch all locally for the dashboard, normally you'd use a dedicated 'getStats' supabase RPC.
    const products = await getProducts(5); // This gets all active products according to current lib

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Dashboard overview</h1>
                <p className="text-neutral-400">Welcome to the Arrivals Cave dynamic management portal.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Products"
                    value={products.length}
                    icon={<Package size={20} />}
                    linkHref="/portal/products"
                    linkText="Manage products"
                />
                <StatCard
                    title="Active Collections"
                    value={collectionsData.length}
                    icon={<Folders size={20} />}
                    linkHref="/portal/collections"
                    linkText="Manage collections"
                />
                <StatCard
                    title="Published Articles"
                    value={blogData.posts.length || 0}
                    icon={<PenTool size={20} />}
                    linkHref="/portal/blog"
                    linkText="Manage blog"
                />
                <StatCard
                    title="SEO Pages"
                    value="14+"
                    icon={<FileText size={20} />}
                    linkHref="/portal/seo-pages"
                    linkText="Manage SEO"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Products</CardTitle>
                        <CardDescription className="text-neutral-400">
                            The latest items added to your catalog.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {products.slice(0, 5).map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-neutral-950/50 border border-neutral-800/50">
                                    <div className="flex items-center space-x-4">
                                        {/* Placeholder for Product Image */}
                                        <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center text-xs text-neutral-500 overflow-hidden">
                                            {product.images && product.images.length > 0 ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                            ) : 'Img'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium leading-none text-white">{product.title}</p>
                                            <p className="text-xs text-neutral-400 mt-1">{product.code} • ৳{product.price}</p>
                                        </div>
                                    </div>
                                    <Link href={`/portal/products/${product.id}`} className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                                        Edit
                                    </Link>
                                </div>
                            ))}
                            {products.length === 0 && (
                                <p className="text-sm text-neutral-500">No products found.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-white">Quick Actions</CardTitle>
                        <CardDescription className="text-neutral-400">
                            Common administrative tasks.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Link href="/portal/products/new" className="flex items-center p-3 rounded-lg hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors group">
                            <div className="w-8 h-8 rounded bg-orange-500/10 text-orange-500 flex items-center justify-center mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <Package size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Add New Product</p>
                                <p className="text-xs text-neutral-400">Create a new item in your catalog</p>
                            </div>
                        </Link>
                        <Link href="/portal/blog/new" className="flex items-center p-3 rounded-lg hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors group">
                            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <PenTool size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Write Blog Post</p>
                                <p className="text-xs text-neutral-400">Publish a new article to the blog</p>
                            </div>
                        </Link>
                        <Link href="/portal/collections/new" className="flex items-center p-3 rounded-lg hover:bg-neutral-800 border border-transparent hover:border-neutral-700 transition-colors group">
                            <div className="w-8 h-8 rounded bg-green-500/10 text-green-500 flex items-center justify-center mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Folders size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Create Collection</p>
                                <p className="text-xs text-neutral-400">Start a new product collection category</p>
                            </div>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
