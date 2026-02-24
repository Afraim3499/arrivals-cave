"use client";

import { useState } from "react";
import { saveProduct } from "../../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2, X, Plus } from "lucide-react";
import { ImageUploader } from "@/components/portal/ImageUploader";
import { Collection, Product } from "@/lib/products";

interface ProductFormProps {
    initialData: Product | null;
    collections: Collection[];
    isNew: boolean;
}

export function ProductForm({ initialData, collections, isNew }: ProductFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialize form state
    const [formData, setFormData] = useState({
        id: initialData?.id || undefined,
        code: initialData?.code || "",
        slug: initialData?.slug || "",
        title: initialData?.title || "",
        title_bn: initialData?.title_bn || "",
        description: initialData?.description || "",
        description_bn: initialData?.description_bn || "",
        story_markdown: initialData?.story_markdown || "",
        story_markdown_bn: initialData?.story_markdown_bn || "",
        usp_bullets: (initialData?.usp_bullets || []).join("\n"),
        seo_title: initialData?.seo_title || "",
        seo_meta: initialData?.seo_meta || "",
        price: initialData?.price || 0,
        compare_at_price: initialData?.compare_at_price || 0,
        collection_id: initialData?.collection_id || collections[0]?.id || "",
        color_label: initialData?.color_label || "",
        color_label_bn: initialData?.color_label_bn || "",
        fabric: initialData?.fabric || "",
        fabric_bn: initialData?.fabric_bn || "",
        tagInput: (initialData?.tags || []).join(", "),
        is_active: initialData?.is_active ?? true,
        is_eid_pick: initialData?.is_eid_pick ?? false,
        is_best_seller: initialData?.is_best_seller ?? false,
        is_new_arrival: initialData?.is_new_arrival ?? false,
        stock_by_size: (initialData?.stock_by_size as Record<string, number>) || { M: 0, L: 0, XL: 0, XXL: 0 },
        images: initialData?.images || [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;

        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === "number") {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleStockChange = (size: string, value: string) => {
        const numValue = parseInt(value) || 0;
        setFormData(prev => ({
            ...prev,
            stock_by_size: {
                ...(prev.stock_by_size as Record<string, number>),
                [size]: numValue
            }
        }));
    };

    const handleImageUpload = (url: string) => {
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, url]
        }));
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // transform tagInput to array
            const submissionData = {
                ...formData,
                tags: formData.tagInput.split(",").map((t: string) => t.trim()).filter(Boolean),
                compare_at_price: formData.compare_at_price || null,
            };

            const result = await saveProduct(submissionData);

            if (result.error) {
                throw new Error(result.error);
            }

            router.push("/portal/products");
            router.refresh(); // Force a hard refresh of the list
        } catch (err: any) {
            setError(err.message || "An error occurred while saving the product.");
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
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Information */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">General Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Name (English) *</label>
                                <Input required name="title" value={formData.title} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Name (Bengali)</label>
                                <Input name="title_bn" value={formData.title_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Short Description (English) *</label>
                            <Textarea required name="description" value={formData.description} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[100px]" />
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Short Description (Bengali)</label>
                            <Textarea name="description_bn" value={formData.description_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[100px]" />
                        </div>
                    </div>

                    {/* Editorial Story */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Editorial Story</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Story Text (English)</label>
                            <Textarea name="story_markdown" value={formData.story_markdown} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[150px]" placeholder="A detailed story split by paragraphs... Images will interleave automatically on the frontend." />
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Story Text (Bengali)</label>
                            <Textarea name="story_markdown_bn" value={formData.story_markdown_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[150px]" />
                        </div>

                        <div className="space-y-2 mt-6">
                            <label className="text-sm font-medium text-neutral-300">USP Bullets</label>
                            <Textarea name="usp_bullets" value={formData.usp_bullets} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[120px]" placeholder={`Made from pure Egyptian cotton\nRelaxed fit for comfort\nIncludes matching pajama`} />
                            <p className="text-xs text-neutral-500 mt-1">Enter one bullet point per line. These display in the "Why Choose" grid.</p>
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Price (BDT) *</label>
                                <Input required type="number" name="price" value={formData.price} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Compare at Price (BDT)</label>
                                <Input type="number" name="compare_at_price" value={formData.compare_at_price} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-neutral-300 mb-3">Stock by Size</h3>
                            <div className="grid grid-cols-4 gap-4">
                                {['M', 'L', 'XL', 'XXL'].map(size => (
                                    <div key={size} className="space-y-1">
                                        <label className="text-xs font-semibold text-neutral-400 block text-center bg-neutral-800 py-1 rounded-t-md">{size}</label>
                                        <Input
                                            type="number"
                                            value={(formData.stock_by_size as any)[size]}
                                            onChange={(e) => handleStockChange(size, e.target.value)}
                                            className="bg-neutral-950 border-neutral-800 text-white text-center rounded-t-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Attributes</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Color (English) *</label>
                                <Input required name="color_label" value={formData.color_label} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Color (Bengali)</label>
                                <Input name="color_label_bn" value={formData.color_label_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Fabric (English) *</label>
                                <Input required name="fabric" value={formData.fabric} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Fabric (Bengali)</label>
                                <Input name="fabric_bn" value={formData.fabric_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* SEO */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Search Engine Optimization (SEO)</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">SEO Title</label>
                            <Input name="seo_title" value={formData.seo_title} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" placeholder="Leave blank to use default Product Title" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">SEO Meta Description</label>
                            <Textarea name="seo_meta" value={formData.seo_meta} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white min-h-[100px]" placeholder="Leave blank to use default Short Description" />
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Identifiers */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Organization</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">SKU / Code *</label>
                            <Input required name="code" value={formData.code} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white uppercase font-mono" placeholder="e.g. BS-5001" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">URL Slug *</label>
                            <Input required name="slug" value={formData.slug} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white font-mono text-sm" placeholder="e.g. shamsheer-bs-5001" />
                            <p className="text-xs text-neutral-500 mt-1">Must be unique lowercase dashes only</p>
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Collection *</label>
                            <select
                                name="collection_id"
                                value={formData.collection_id}
                                onChange={handleChange}
                                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            >
                                <option value="" disabled>Select a collection</option>
                                {collections.map(col => (
                                    <option key={col.id} value={col.id}>{col.title}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tags Input */}
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Tags (Comma Separated) *</label>
                            <Input required name="tagInput" value={formData.tagInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="cotton, premium, black" />
                            <p className="text-xs text-neutral-500 mt-1">Used to automatically route to virtual categories like /cotton-panjabi</p>
                        </div>
                    </div>

                    {/* Visibility Flags */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Visibility & Campaign Flags</h2>

                        <div className="space-y-3">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="peer sr-only" />
                                    <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Active</span>
                                    <p className="text-xs text-neutral-500">Visible on the site</p>
                                </div>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="is_new_arrival" checked={formData.is_new_arrival} onChange={handleChange} className="peer sr-only" />
                                    <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">New Arrival</span>
                                </div>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="is_eid_pick" checked={formData.is_eid_pick} onChange={handleChange} className="peer sr-only" />
                                    <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Eid Pick</span>
                                    <p className="text-xs text-neutral-500">Displays on /eid-panjabi-collection</p>
                                </div>
                            </label>

                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="is_best_seller" checked={formData.is_best_seller} onChange={handleChange} className="peer sr-only" />
                                    <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Best Seller</span>
                                    <p className="text-xs text-neutral-500">Displays on city SEO pages</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
                        <h2 className="text-lg font-semibold text-white mb-4">Images</h2>
                        <p className="text-xs text-neutral-400 mb-4">Images are tied directly to the product.</p>

                        {formData.images && formData.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square bg-neutral-950 rounded border border-neutral-800 group overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <ImageUploader
                            onUploadSuccess={handleImageUpload}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-neutral-800 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/portal/products")}
                    className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg"
                >
                    {isSubmitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="mr-2 h-4 w-4" /> Save Product & Update Routes</>
                    )}
                </Button>
            </div>
        </form>
    );
}
