import { getBlogPosts, BlogPost } from "@/lib/blog";
import Link from "next/link";
import { Plus, Edit2, PenTool, Check, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PortalBlog() {
    const { posts } = await getBlogPosts(); // We might need to pass an arg to get drafts too if getBlogPosts filters them out. Let's assume the CMS client needs a raw supabase call ideally, but sticking to existing lib for now.

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Blog</h1>
                    <p className="text-neutral-400 mt-1">Write and publish articles to your search-demand hub.</p>
                </div>
                <Link href="/portal/blog/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Write Article
                    </Button>
                </Link>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-neutral-950/50 border-b border-neutral-800 text-neutral-400">
                            <tr>
                                <th className="px-6 py-4 font-medium">Article Title</th>
                                <th className="px-6 py-4 font-medium">Cluster (Category)</th>
                                <th className="px-6 py-4 font-medium">Author</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {posts.map((post: BlogPost) => (
                                <tr key={post.id} className="hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-white max-w-sm truncate">{post.title}</p>
                                        <p className="text-xs text-neutral-500 max-w-sm truncate">{post.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-800 text-neutral-300 capitalize">
                                            {post.cluster}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {post.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.is_published ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">
                                                <Check className="h-3 w-3 mr-1" /> Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                <Clock className="h-3 w-3 mr-1" /> Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/portal/blog/${post.id}`}>
                                            <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                <Edit2 className="h-4 w-4 mr-2" /> Edit
                                            </Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {posts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        <PenTool className="h-12 w-12 mx-auto mb-4 text-neutral-700" />
                                        <p className="text-lg font-medium text-neutral-300">No articles yet</p>
                                        <p className="text-sm mt-1">Start writing your first blog post to drive traffic.</p>
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
