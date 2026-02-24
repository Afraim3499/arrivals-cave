import { getCollections } from "@/lib/collections";
import Link from "next/link";
import { Plus, Edit2, Folders, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PortalCollections() {
    const collections = await getCollections();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Collections</h1>
                    <p className="text-neutral-400 mt-1">Manage product categories and groupings.</p>
                </div>
                <Link href="/portal/collections/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add Collection
                    </Button>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Collection</th>
                                <th className="px-6 py-4 font-medium">Slug</th>
                                <th className="px-6 py-4 font-medium text-center">Active</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {collections.map((collection: any) => (
                                <tr key={collection.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center shrink-0 overflow-hidden">
                                                {collection.image_url ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={collection.image_url} alt={collection.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Folders className="h-5 w-5 text-neutral-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{collection.title}</p>
                                                <p className="text-xs text-neutral-500">{collection.title_bn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        <code className="text-xs bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                                            {collection.slug}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            {collection.is_active ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <X className="h-4 w-4 text-neutral-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/portal/collections/${collection.id}`}>
                                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {collections.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-neutral-500">
                                        <Folders className="h-12 w-12 mx-auto mb-4 text-neutral-700" />
                                        <p className="text-lg font-medium text-neutral-300">No collections found</p>
                                        <p className="text-sm mt-1">Create categories to group your products together.</p>
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
