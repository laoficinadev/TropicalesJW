"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";

export function ImageManager({
  images = [],
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error al subir");
        const data = await res.json();
        uploadedUrls.push(data.url);
      }

      onChange([...images, ...uploadedUrls]);
      toast.success(`${uploadedUrls.length} imagen(es) subida(s)`);
    } catch {
      toast.error("Error al subir imágenes");
    } finally {
      setUploading(false);
    }
  }

  async function removeImage(index: number) {
    const imageUrl = images[index];
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);

    try {
      await fetch("/api/admin/imagenes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });
    } catch {
      // ignore — image may already be removed from storage
    }
  }

  function moveImage(index: number, direction: -1 | 1) {
    const newImages = [...images];
    const target = index + direction;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    onChange(newImages);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Imágenes del producto
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((url, i) => (
          <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Image
              src={url}
              alt={`Imagen ${i + 1}`}
              fill
              sizes="150px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition group-hover:opacity-100">
              <button
                type="button"
                onClick={() => moveImage(i, -1)}
                disabled={i === 0}
                className="rounded-full bg-white/80 p-1 text-gray-700 transition hover:bg-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => moveImage(i, 1)}
                disabled={i === images.length - 1}
                className="rounded-full bg-white/80 p-1 text-gray-700 transition hover:bg-white disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="rounded-full bg-red-500/80 p-1 text-white transition hover:bg-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-brand-accent hover:bg-brand-light disabled:opacity-50"
        >
          {uploading ? (
            <span className="text-xs text-gray-400">Subiendo...</span>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-6 w-6 text-gray-400" />
              <span className="mt-1 block text-xs text-gray-400">Subir</span>
            </div>
          )}
        </button>
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
        Formatos: JPG, PNG, WebP. Múltiples imágenes permitidas.
      </p>
    </div>
  );
}