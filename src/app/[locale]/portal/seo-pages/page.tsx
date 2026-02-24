import { createServerSupabaseClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Edit2, FileText, Check, X, MapPin, Moon, Type } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PortalSeoPages() {
    const supabase = await createServerSupabaseClient();
    const { data: pages = [] } = await supabase.from("seo_landing_pages").select("*").order("updated_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">SEO Landing Pages</h1>
                    <p className="text-neutral-400 mt-1">Manage City, Eid, and Style campaign hubs.</p>
                </div>
                <Link href="/portal/seo-pages/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Add SEO Page
                    </Button>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Page Title</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">URL Slug</th>
                                <th className="px-6 py-4 font-medium text-center">Active</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {pages && pages.map((page) => (
                                <tr key={page.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                                                {page.page_type === 'city' && <MapPin className="h-5 w-5 text-blue-400" />}
                                                {page.page_type === 'eid' && <Moon className="h-5 w-5 text-yellow-500" />}
                                                {page.page_type === 'style' && <Type className="h-5 w-5 text-pink-500" />}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{page.title_en}</p>
                                                <p className="text-xs text-neutral-500">{page.title_bn}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-300 capitalize">
                                            {page.page_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-300">
                                        <code className="text-xs bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
                                            /{page.slug}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center">
                                            {page.is_active ? (
                                                <Check className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <X className="h-4 w-4 text-neutral-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/portal/seo-pages/${page.id}`}>
                                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {(!pages || pages.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-700" />
                                        <p className="text-lg font-medium text-neutral-300">No SEO pages found</p>
                                        <p className="text-sm mt-1">Create hubs for local keywords or campaign specific styles.</p>
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
