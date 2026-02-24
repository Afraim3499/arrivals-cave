import { getProducts } from "@/lib/products";
import Link from "next/link";
import { Plus, Edit2, Package, Tag, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PortalProducts() {
    const products = await getProducts(); // Fetches all active & inactive products in admin ideally, assuming getProducts can take args later, we get them all for now.

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Products</h1>
                    <p className="text-neutral-400 mt-1">Manage your e-commerce catalog.</p>
                </div>
                <Link href="/portal/products/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Product</th>
                                <th className="px-6 py-4 font-medium">SKU / Code</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Status & Visibility</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                {product.images?.[0] ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Package className="h-5 w-5 text-neutral-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{product.title}</p>
                                                <p className="text-xs text-neutral-500">{product.title_bn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        <code className="text-xs bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                                            {product.code}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        ৳{product.price}
                                        {product.compare_at_price && (
                                            <span className="ml-2 text-xs text-neutral-500 line-through">
                                                ৳{product.compare_at_price}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-2">
                                            {product.is_active ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-500/10 text-neutral-400 border border-neutral-500/20">
                                                    Draft
                                                </span>
                                            )}
                                            {product.is_best_seller && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" title="Featured">
                                                    <Layers className="h-3 w-3 mr-1" /> Featured
                                                </span>
                                            )}
                                            {product.is_eid_pick && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20" title="Eid Pick">
                                                    <Tag className="h-3 w-3 mr-1" /> Eid
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/portal/products/${product.id}`}>
                                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        <Package className="h-12 w-12 mx-auto mb-4 text-neutral-700" />
                                        <p className="text-lg font-medium text-neutral-300">No products found</p>
                                        <p className="text-sm mt-1">Get started by creating a new product.</p>
                                        <Link href="/portal/products/new" className="inline-block mt-4">
                                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                                <Plus className="mr-2 h-4 w-4" /> Add Product
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
