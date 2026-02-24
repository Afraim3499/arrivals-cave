"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

import { HomeSettings } from "@/lib/settings";
import { saveHomeSettings } from "./actions";

// UI Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface SettingsFormProps {
    initialData: HomeSettings | null;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            id: initialData?.id || "",
            hero_title: initialData?.hero_title || "",
            hero_subtitle: initialData?.hero_subtitle || "",
            hero_cta_text: initialData?.hero_cta_text || "",
            hero_cta_link: initialData?.hero_cta_link || "",
            hero_background_image: initialData?.hero_background_image || "",

            hero_title_bn: initialData?.hero_title_bn || "",
            hero_subtitle_bn: initialData?.hero_subtitle_bn || "",
            hero_cta_text_bn: initialData?.hero_cta_text_bn || "",

            eid_banner_visible: initialData?.eid_banner_visible || false,
            eid_banner_title: initialData?.eid_banner_title || "",
            eid_banner_title_bn: initialData?.eid_banner_title_bn || "",
            eid_banner_link: initialData?.eid_banner_link || "",
        }
    });

    const isEidVisible = watch("eid_banner_visible");

    async function onSubmit(data: any) {
        setIsLoading(true);
        try {
            // Remove id if it's empty to allow trigger of insert instead of update
            if (!data.id) delete data.id;

            const result = await saveHomeSettings(data);

            if (result.error) {
                toast.error("Failed to save settings: " + result.error);
            } else {
                toast.success("Home settings saved successfully!");
                if (!initialData?.id && result.data?.id) {
                    setValue("id", result.data.id);
                }
                router.refresh();
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Hero Section Settings */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white border-b border-neutral-800 pb-2">Hero Banner Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Background Image URL</Label>
                        <Input
                            {...register("hero_background_image")}
                            placeholder="https://example.com/image.jpg"
                            className="bg-neutral-950 border-neutral-800"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4 p-4 border border-neutral-800 rounded-md bg-neutral-950/50">
                        <h4 className="font-medium text-sm text-neutral-400">English (EN)</h4>
                        <div className="space-y-2">
                            <Label>Hero Title</Label>
                            <Input {...register("hero_title")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Subtitle</Label>
                            <Input {...register("hero_subtitle")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Button Text</Label>
                            <Input {...register("hero_cta_text")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border border-neutral-800 rounded-md bg-neutral-950/50">
                        <h4 className="font-medium text-sm text-neutral-400">Bengali (BN)</h4>
                        <div className="space-y-2">
                            <Label>Hero Title (BN)</Label>
                            <Input {...register("hero_title_bn")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Hero Subtitle (BN)</Label>
                            <Input {...register("hero_subtitle_bn")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>CTA Button Text (BN)</Label>
                            <Input {...register("hero_cta_text_bn")} className="bg-neutral-950 border-neutral-800" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>CTA Link</Label>
                        <Input
                            {...register("hero_cta_link")}
                            placeholder="/shop/premium-panjabi"
                            className="bg-neutral-950 border-neutral-800"
                        />
                        <p className="text-xs text-neutral-500">The internal link the button goes to (e.g. /shop/eid)</p>
                    </div>
                </div>
            </div>

            {/* Eid Banner Settings */}
            <div className="space-y-4 pt-6">
                <h3 className="text-lg font-medium text-white border-b border-neutral-800 pb-2">Eid Promotional Banner</h3>

                <div className="flex items-center space-x-3 py-2">
                    <Switch
                        checked={isEidVisible}
                        onCheckedChange={(val) => setValue("eid_banner_visible", val)}
                    />
                    <Label className="text-base">Show Eid Banner on Homepage</Label>
                </div>

                {isEidVisible && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 border border-neutral-800 rounded-md bg-neutral-950/50">
                        <div className="space-y-2">
                            <Label>Eid Banner Title (EN)</Label>
                            <Input {...register("eid_banner_title")} placeholder="Eid Collection 2026" className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Eid Banner Title (BN)</Label>
                            <Input {...register("eid_banner_title_bn")} placeholder="ঈদ কালেকশন ২০২৬" className="bg-neutral-950 border-neutral-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Eid Banner Link</Label>
                            <Input {...register("eid_banner_link")} placeholder="/eid-panjabi-collection" className="bg-neutral-950 border-neutral-800" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t border-neutral-800">
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Settings
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
