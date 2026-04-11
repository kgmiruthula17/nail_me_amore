"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "../../components/AnimatedSection";
import ProductForm from "./components/ProductForm";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleSaved = () => {
    setIsFormOpen(false);
    fetchProducts();
  };

  return (
    <div className="space-y-6">
      <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal mb-1">
            Product Management
          </h1>
          <p className="text-charcoal/50 text-sm">
            Add new designs, edit prices, and manage your inventory.
          </p>
        </div>

        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-gold transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Product
        </button>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cream/50 text-xs uppercase tracking-wider text-charcoal/50 border-b border-charcoal/10">
                    <th className="px-6 py-4 font-medium">Product</th>
                    <th className="px-6 py-4 font-medium">Pricing</th>
                    <th className="px-6 py-4 font-medium hidden md:table-cell">Category / Style</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg bg-cream flex-shrink-0 overflow-hidden border border-charcoal/5 flex justify-center items-center">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="text-charcoal/20" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-heading text-base text-charcoal font-medium">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-charcoal text-sm">₹{product.price}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-charcoal/40 line-through">₹{product.originalPrice}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <div className="flex gap-2">
                           <span className="inline-flex items-center px-2 py-1 rounded bg-rose-gold/10 text-rose-gold text-[10px] font-medium uppercase tracking-wider">
                            {product.category}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded bg-charcoal/5 text-charcoal/60 text-[10px] font-medium uppercase tracking-wider">
                            {product.style}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 text-charcoal/40">
                          <button
                            onClick={() => openEdit(product)}
                            className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
             <div className="text-center py-20">
              <p className="font-heading text-xl text-charcoal/40 mb-2">No products found</p>
              <p className="text-sm text-charcoal/30">Start by adding your first product!</p>
            </div>
          )}
        </div>
      </AnimatedSection>

      {isFormOpen && (
        <ProductForm 
          product={editingProduct} 
          onClose={() => setIsFormOpen(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}
