"use client";

import { useState } from "react";
import { saveCollection } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/portal/ImageUploader";
import { Collection } from "@/lib/collections";

interface CollectionFormProps {
    initialData: Collection | null;
    isNew: boolean;
}

export function CollectionForm({ initialData, isNew }: CollectionFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: initialData?.id || undefined,
        slug: initialData?.slug || "",
        title: initialData?.title || "",
        title_bn: initialData?.title_bn || "",
        description: initialData?.description || "",
        description_bn: initialData?.description_bn || "",
        meta_title_en: initialData?.meta_title_en || "",
        meta_title_bn: initialData?.meta_title_bn || "",
        meta_description_en: initialData?.meta_description_en || "",
        meta_description_bn: initialData?.meta_description_bn || "",
        image_url: initialData?.image_url || "",
        is_active: initialData?.is_active ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === "number") {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({ ...prev, image_url: url }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await saveCollection(formData);
            if (result.error) throw new Error(result.error);

            router.push("/portal/collections");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save collection");
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

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">Basic Details</h2>

                <div className="grid grid-cols-2 gap-4 border-b border-neutral-800 pb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Name (English) *</label>
                        <Input required name="title" value={formData.title} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Name (Bengali)</label>
                        <Input name="title_bn" value={formData.title_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Description (English)</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Description (Bengali)</label>
                        <textarea name="description_bn" value={formData.description_bn} onChange={handleChange} rows={3} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">URL Slug *</label>
                        <Input required name="slug" value={formData.slug} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white font-mono text-sm" placeholder="e.g. heer" />
                    </div>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                <h2 className="text-lg font-semibold text-white mb-4">SEO Details</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Meta Title (English)</label>
                        <Input name="meta_title_en" value={formData.meta_title_en} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Meta Title (Bengali)</label>
                        <Input name="meta_title_bn" value={formData.meta_title_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Meta Description (English)</label>
                        <textarea name="meta_description_en" value={formData.meta_description_en} onChange={handleChange} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-300">Meta Description (Bengali)</label>
                        <textarea name="meta_description_bn" value={formData.meta_description_bn} onChange={handleChange} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">Cover Image</h2>
                    </div>

                    {formData.image_url && (
                        <div className="mb-4 relative rounded-md overflow-hidden aspect-video border border-neutral-800 bg-black">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={formData.image_url} alt="Cover" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <ImageUploader onUploadSuccess={handleImageUpload} />

                    <div className="mt-2">
                        <label className="text-xs font-medium text-neutral-400">Or Image URL</label>
                        <Input name="image_url" value={formData.image_url} onChange={handleChange} className="mt-1 bg-neutral-950 border-neutral-800 text-white text-xs" />
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-white mb-4">Visibility</h2>
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="peer sr-only" />
                            <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Active Collection</span>
                            <p className="text-xs text-neutral-500">Visible on the site nav</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-neutral-800 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/portal/collections")}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="mr-2 h-4 w-4" /> Save Collection</>
                    )}
                </Button>
            </div>
        </form>
    );
}
