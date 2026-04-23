"use client";

import { useState, useEffect } from "react";
import { X, Upload, Check, Trash2 } from "lucide-react";

interface ProductFormProps {
  product?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || "",
    originalPrice: product?.originalPrice || "",
    category: product?.category || "",
    style: product?.style || "",
  });
  
  // Cover image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(product?.image || null);

  // Extra images
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [existingExtraImages, setExistingExtraImages] = useState<string[]>(product?.extraImages || []);

  const [loading, setLoading] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<any[]>([]);
  const [stylesOptions, setStylesOptions] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setCategoriesOptions(data))
      .catch((err) => console.error(err));
      
    fetch("/api/styles")
      .then((res) => res.json())
      .then((data) => Array.isArray(data) && setStylesOptions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleExtraImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setExtraImageFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setExtraPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeNewExtraImage = (index: number) => {
    setExtraImageFiles((prev) => prev.filter((_, i) => i !== index));
    setExtraPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingExtraImage = (index: number) => {
    setExistingExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) submitData.append(key, String(value));
      });

      if (imageFile) {
        submitData.append("image", imageFile);
      }

      // Append new extra image files
      for (const file of extraImageFiles) {
        submitData.append("extraImages", file);
      }

      if (product) {
        // Editing: send existing extra images that should be kept
        submitData.append("existingExtraImages", JSON.stringify(existingExtraImages));

        await fetch(`/api/products/${product.id}`, {
          method: "PUT",
          body: submitData,
        });
      } else {
        await fetch("/api/products", {
          method: "POST",
          body: submitData,
        });
      }
      
      onSaved();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-charcoal/10 p-6 flex items-center justify-between z-10">
          <h2 className="font-heading text-2xl text-charcoal">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="p-2 text-charcoal/50 hover:text-charcoal transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-2">Cover Image</label>
            <div className="border-2 border-dashed border-charcoal/20 rounded-xl p-8 text-center hover:bg-cream/50 transition-colors">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="imageUpload" className="cursor-pointer flex flex-col items-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-sm" />
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-rose-gold/10 text-rose-gold flex items-center justify-center mb-3">
                      <Upload size={20} />
                    </div>
                    <span className="text-sm font-medium text-charcoal">Click to upload cover image</span>
                    <span className="text-xs text-charcoal/40 mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Extra Images Upload */}
          <div>
            <label className="block text-sm font-medium text-charcoal/70 mb-2">Extra Images</label>
            
            {/* Existing extra images (when editing) */}
            {existingExtraImages.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-charcoal/50 mb-2">Current extra images:</p>
                <div className="flex flex-wrap gap-3">
                  {existingExtraImages.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`Extra ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-charcoal/10" />
                      <button
                        type="button"
                        onClick={() => removeExistingExtraImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New extra image previews */}
            {extraPreviews.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-charcoal/50 mb-2">New images to upload:</p>
                <div className="flex flex-wrap gap-3">
                  {extraPreviews.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt={`New ${i + 1}`} className="w-20 h-20 object-cover rounded-lg border border-rose-gold/20" />
                      <button
                        type="button"
                        onClick={() => removeNewExtraImage(i)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload button */}
            <div className="border-2 border-dashed border-charcoal/15 rounded-xl p-5 text-center hover:bg-cream/50 transition-colors">
              <input
                type="file"
                id="extraImagesUpload"
                accept="image/*"
                multiple
                onChange={handleExtraImagesChange}
                className="hidden"
              />
              <label htmlFor="extraImagesUpload" className="cursor-pointer flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-dusty-pink/10 text-dusty-pink flex items-center justify-center mb-2">
                  <Upload size={16} />
                </div>
                <span className="text-sm font-medium text-charcoal">Add extra images</span>
                <span className="text-xs text-charcoal/40 mt-1">Select multiple files at once</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Product Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-cream border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-gold"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Price</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-cream border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-gold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Compare at</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full bg-cream border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-gold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Category</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-cream border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-gold appearance-none"
              >
                <option value="" disabled>Select a category</option>
                {categoriesOptions.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">Length / Style</label>
              <select
                required
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full bg-cream border border-charcoal/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-rose-gold appearance-none"
              >
                <option value="" disabled>Select a style</option>
                {stylesOptions.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>



          <div className="pt-4 flex justify-end gap-3 border-t border-charcoal/10">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-sm font-medium text-charcoal/60 hover:bg-cream transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium bg-charcoal text-white hover:bg-rose-gold transition-colors disabled:opacity-50"
            >
              <Check size={16} />
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
