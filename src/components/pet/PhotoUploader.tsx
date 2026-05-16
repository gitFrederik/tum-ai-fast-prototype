"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface PhotoUploaderProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export function PhotoUploader({ photos, onChange, maxPhotos = 6 }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (photos.length >= maxPhotos) {
      toast.error(`Maximum ${maxPhotos} photos allowed`);
      return;
    }

    setUploading(true);
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= maxPhotos) break;

      try {
        // Get upload signature
        const sigRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder: "pawnder/pets" }),
        });

        if (!sigRes.ok) throw new Error("Failed to get upload signature");
        const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append("file", file);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", apiKey);
        formData.append("folder", "pawnder/pets");
        formData.append("transformation", "f_auto,q_auto,w_800,h_800,c_fill,g_auto");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        if (!uploadRes.ok) throw new Error("Upload failed");
        const data = await uploadRes.json();
        newPhotos.push(data.secure_url);
      } catch (err) {
        // Fallback: use object URL for local preview if Cloudinary isn't configured
        const objectUrl = URL.createObjectURL(file);
        newPhotos.push(objectUrl);
        toast("Photo added locally (Cloudinary not configured)", { icon: "ℹ️" });
      }
    }

    onChange(newPhotos);
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
            <Image src={photo} alt={`Pet photo ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3 text-white" />
            </button>
            {i === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs text-center py-0.5">
                Main
              </div>
            )}
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-rose-400 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-rose-400 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      <p className="text-xs text-gray-400">
        {photos.length}/{maxPhotos} photos · First photo is the main one
      </p>
    </div>
  );
}
