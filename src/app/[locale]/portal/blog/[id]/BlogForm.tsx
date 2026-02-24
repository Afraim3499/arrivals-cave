"use client";

import { useState } from "react";
import { saveBlogPost } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Send } from "lucide-react";
import { RichTextEditor } from "@/components/portal/RichTextEditor";
import { ImageUploader } from "@/components/portal/ImageUploader";

interface BlogFormProps {
    initialData: any | null;
    isNew: boolean;
}

export function BlogForm({ initialData, isNew }: BlogFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: initialData?.id || undefined,
        slug: initialData?.slug || "",
        title: initialData?.title || "",
        title_bn: initialData?.title_bn || "",
        excerpt: initialData?.excerpt || "",
        excerpt_bn: initialData?.excerpt_bn || "",
        content_markdown: initialData?.content_markdown || "",
        content_markdown_bn: initialData?.content_markdown_bn || "",
        author: initialData?.author || "Arrivals Cave Team",
        featured_image: initialData?.featured_image || "",
        cluster: initialData?.cluster || "general",
        // Note: SEO Metadata is not in the blog_posts schema so we leave it out here.
        tagsInput: (initialData?.tags || []).join(", "),
        linked_productsInput: (initialData?.linked_product_slugs || []).join(", "),
        linked_collectionsInput: (initialData?.linked_collection_slugs || []).join(", "),
        is_published: initialData?.is_published ?? false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({ ...prev, featured_image: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await saveBlogPost(formData);
            if (result.error) throw new Error(result.error);

            router.push("/portal/blog");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save article");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Article Content</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Title (English) *</label>
                                <Input required name="title" value={formData.title} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Title (Bengali)</label>
                                <Input name="title_bn" value={formData.title_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Excerpt (English)</label>
                                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Excerpt (Bengali)</label>
                                <textarea name="excerpt_bn" value={formData.excerpt_bn} onChange={handleChange} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Content (English) *</label>
                            <RichTextEditor
                                content={formData.content_markdown}
                                onChange={(html) => setFormData(p => ({ ...p, content_markdown: html }))}
                            />
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Content (Bengali)</label>
                            <RichTextEditor
                                content={formData.content_markdown_bn}
                                onChange={(html) => setFormData(p => ({ ...p, content_markdown_bn: html }))}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Publishing</h2>

                        <label className="flex items-center space-x-3 cursor-pointer group p-3 bg-neutral-950 border border-neutral-800 rounded-lg mb-4 hover:border-orange-500/50 transition-colors">
                            <div className="relative flex items-center">
                                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="peer sr-only" />
                                <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-green-500 transition-colors"></div>
                                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow"></div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-white group-hover:text-green-400 transition-colors">
                                    {formData.is_published ? "Published & Live" : "Private Draft"}
                                </span>
                                <p className="text-xs text-neutral-500 mt-0.5">Toggle to expose article to users.</p>
                            </div>
                        </label>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Author</label>
                            <Input name="author" value={formData.author} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" />
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">URL Slug *</label>
                            <Input required name="slug" value={formData.slug} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white font-mono text-sm" placeholder="e.g. style-guide-summer-panjabi" />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Categorization</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Cluster</label>
                            <select
                                name="cluster"
                                value={formData.cluster}
                                onChange={handleChange}
                                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="general">General</option>
                                <option value="eid">Eid Styling</option>
                                <option value="price-city">City Specific Pricing</option>
                                <option value="style">Fabric & Style Guide</option>
                                <option value="sizing">Sizing Help</option>
                            </select>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Tags (Comma Separated)</label>
                            <Input name="tagsInput" value={formData.tagsInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="tips, black" />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Cover Image</h2>
                        {formData.featured_image && (
                            <div className="mb-4 relative rounded-md overflow-hidden aspect-video border border-neutral-800 bg-black">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={formData.featured_image} alt="Cover" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <ImageUploader onUploadSuccess={handleImageUpload} bucket="blog-images" />
                        <div className="mt-2">
                            <label className="text-xs font-medium text-neutral-400">Or Image URL</label>
                            <Input name="featured_image" value={formData.featured_image} onChange={handleChange} className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs" />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Cross-Linking</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Linked Products</label>
                            <Input name="linked_productsInput" value={formData.linked_productsInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="Product Slugs (e.g. shamsheer)" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Linked Collections</label>
                            <Input name="linked_collectionsInput" value={formData.linked_collectionsInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="Collection Slugs (e.g. zameen)" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-neutral-800 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/portal/blog")}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-white shadow-lg ${formData.is_published ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"}`}
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {formData.is_published ? "Publishing..." : "Saving..."}</>
                    ) : (
                        <>
                            {formData.is_published ? <Send className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                            {formData.is_published ? "Publish Article" : "Save Draft"}
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
