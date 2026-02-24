"use client";

import { useState } from "react";
import { saveSeoPage } from "../actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";
import { RichTextEditor } from "@/components/portal/RichTextEditor";

interface SeoPageFormProps {
    initialData: any | null;
    isNew: boolean;
}

export function SeoPageForm({ initialData, isNew }: SeoPageFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        id: initialData?.id || undefined,
        slug: initialData?.slug || "",
        page_type: initialData?.page_type || "city",
        title_en: initialData?.title_en || "",
        title_bn: initialData?.title_bn || "",
        meta_title_en: initialData?.meta_title_en || "",
        meta_title_bn: initialData?.meta_title_bn || "",
        meta_description_en: initialData?.meta_description_en || "",
        meta_description_bn: initialData?.meta_description_bn || "",
        content_en: initialData?.content_en || "",
        content_bn: initialData?.content_bn || "",
        city: initialData?.city || "",
        price_range_min: initialData?.price_range_min || 0,
        price_range_max: initialData?.price_range_max || 0,
        price_range_avg: initialData?.price_range_avg || 0,
        shipping_note: initialData?.shipping_note || "",
        shipping_note_bn: initialData?.shipping_note_bn || "",
        faq_items: initialData?.faq_items || [],
        linked_collection_slugsInput: (initialData?.linked_collection_slugs || []).join(", "),
        linked_city_slugsInput: (initialData?.linked_city_slugs || []).join(", "),
        linked_tagsInput: (initialData?.linked_tags || []).join(", "),
        is_active: initialData?.is_active ?? true,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as any;
        if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else if (type === "number") {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addFaq = () => {
        setFormData(prev => ({
            ...prev,
            faq_items: [...prev.faq_items, { question_en: "", question_bn: "", answer_en: "", answer_bn: "" }]
        }));
    };

    const removeFaq = (index: number) => {
        setFormData(prev => ({
            ...prev,
            faq_items: prev.faq_items.filter((_: any, i: number) => i !== index)
        }));
    };

    const handleFaqChange = (index: number, field: string, value: string) => {
        const newFaqs = [...formData.faq_items];
        newFaqs[index] = { ...newFaqs[index], [field]: value };
        setFormData(prev => ({ ...prev, faq_items: newFaqs }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await saveSeoPage(formData);
            if (result.error) throw new Error(result.error);

            router.push("/portal/seo-pages");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to save SEO page");
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
                        <h2 className="text-lg font-semibold text-white mb-4">Core Content</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Page Title (English) *</label>
                                <Input required name="title_en" value={formData.title_en} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Page Title (Bengali)</label>
                                <Input name="title_bn" value={formData.title_bn} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white" />
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Main Content (English) *</label>
                            <RichTextEditor
                                content={formData.content_en}
                                onChange={(html) => setFormData(p => ({ ...p, content_en: html }))}
                            />
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Main Content (Bengali)</label>
                            <RichTextEditor
                                content={formData.content_bn}
                                onChange={(html) => setFormData(p => ({ ...p, content_bn: html }))}
                            />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">FAQ Items (Schema Markup)</h2>
                            <Button type="button" variant="outline" size="sm" onClick={addFaq} className="border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-white">
                                <Plus className="w-4 h-4 mr-1" /> Add FAQ
                            </Button>
                        </div>

                        {formData.faq_items.map((faq: any, index: number) => (
                            <div key={index} className="p-4 border border-neutral-800 rounded-lg bg-neutral-950 relative">
                                <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-neutral-500 hover:text-red-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400">Question (EN)</label>
                                        <Input value={faq.question_en} onChange={e => handleFaqChange(index, "question_en", e.target.value)} className="bg-neutral-900 border-neutral-800 text-white text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400">Question (BN)</label>
                                        <Input value={faq.question_bn} onChange={e => handleFaqChange(index, "question_bn", e.target.value)} className="bg-neutral-900 border-neutral-800 text-white text-sm" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400">Answer (EN)</label>
                                        <textarea value={faq.answer_en} onChange={e => handleFaqChange(index, "answer_en", e.target.value)} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-neutral-400">Answer (BN)</label>
                                        <textarea value={faq.answer_bn} onChange={e => handleFaqChange(index, "answer_bn", e.target.value)} rows={2} className="flex w-full rounded-md border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.faq_items.length === 0 && (
                            <p className="text-sm text-neutral-500 text-center py-4">No FAQs added yet. These power JSON-LD structured data.</p>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Configuration</h2>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Page Type *</label>
                            <select
                                name="page_type"
                                value={formData.page_type}
                                onChange={handleChange}
                                className="w-full flex h-10 w-full items-center justify-between rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="city">City Landing Page</option>
                                <option value="eid">Eid Campaign Hub</option>
                                <option value="style">Style/Fabric Virtual Category</option>
                            </select>
                        </div>

                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">URL Slug *</label>
                            <Input required name="slug" value={formData.slug} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white font-mono text-sm" placeholder="e.g. panjabi-price-in-dhaka" />
                        </div>

                        <div className="space-y-3 mt-4">
                            <label className="flex items-center space-x-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="peer sr-only" />
                                    <div className="w-10 h-6 bg-neutral-700/50 rounded-full peer peer-checked:bg-orange-600 transition-colors"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white group-hover:text-orange-400 transition-colors">Activate Page</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">SEO Details</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Meta Title (EN)</label>
                            <Input name="meta_title_en" value={formData.meta_title_en} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Meta Description (EN)</label>
                            <textarea name="meta_description_en" value={formData.meta_description_en} onChange={handleChange} rows={3} className="flex w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-orange-500" />
                        </div>
                    </div>

                    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">Dynamic Injections</h2>
                        <p className="text-xs text-neutral-400 mb-2">Drive products visually into this page using constraints:</p>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Linked Tags</label>
                            <Input name="linked_tagsInput" value={formData.linked_tagsInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="cotton, premium" />
                        </div>
                        <div className="space-y-2 mt-4">
                            <label className="text-sm font-medium text-neutral-300">Linked Collections</label>
                            <Input name="linked_collection_slugsInput" value={formData.linked_collection_slugsInput} onChange={handleChange} className="bg-neutral-950 border-neutral-800 text-white text-sm" placeholder="heer, zameen" />
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex items-center justify-end gap-4 border-t border-neutral-800 pt-6">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.push("/portal/seo-pages")}
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
                        <><Save className="mr-2 h-4 w-4" /> Save Page</>
                    )}
                </Button>
            </div>
        </form>
    );
}
