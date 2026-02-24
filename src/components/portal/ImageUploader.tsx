"use client";

import { useState, useCallback } from "react";
import { UploadCloud, X, FileImage, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
    bucket?: string;
    folder?: string;
    className?: string;
}

export function ImageUploader({
    onUploadSuccess,
    bucket = "product-images",
    folder = "uploads",
    className = ""
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const handleUpload = async (file: File) => {
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file.");
            return;
        }

        // Usually 5MB limit
        if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB.");
            return;
        }

        setIsUploading(true);
        setError(null);

        try {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;

            const { data, error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file, {
                    cacheControl: "3600",
                    upsert: false,
                });

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onUploadSuccess(publicUrl);
        } catch (err: any) {
            setError(err.message || "Failed to upload image.");
        } finally {
            setIsUploading(false);
        }
    };

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files[0]);
        }
    }, []);

    const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${isDragging
                        ? "border-orange-500 bg-orange-500/10"
                        : "border-neutral-700 bg-neutral-900 hover:bg-neutral-800"
                    }`}
            >
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    onChange={onFileInput}
                    disabled={isUploading}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
                        <p className="text-sm font-medium">Uploading to storage...</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center space-y-2 text-neutral-400">
                        <div className="p-3 bg-neutral-800 rounded-full mb-2">
                            <UploadCloud className="h-6 w-6 text-neutral-300" />
                        </div>
                        <p className="text-sm font-medium text-white">Click or drag image to upload</p>
                        <p className="text-xs">SVG, PNG, JPG or GIF (max. 5MB)</p>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-500 flex items-center gap-2">
                    <X size={14} className="shrink-0" onClick={() => setError(null)} />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
}
