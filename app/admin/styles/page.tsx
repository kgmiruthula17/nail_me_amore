"use client";

import { useEffect, useState } from "react";
import AnimatedSection from "../../components/AnimatedSection";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export default function AdminStylesPage() {
  const [styles, setStyles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");

  const fetchStyles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/styles");
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setStyles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await fetch("/api/styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })
      });
      setNewName("");
      setIsAdding(false);
      fetchStyles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await fetch(`/api/styles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() })
      });
      setEditingId(null);
      fetchStyles();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this length/style?")) return;
    try {
      await fetch(`/api/styles/${id}`, { method: "DELETE" });
      fetchStyles();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl text-charcoal mb-1">
            Lengths / Styles
          </h1>
          <p className="text-charcoal/50 text-sm">
            Manage product lengths and styles for the shop.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-charcoal text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-gold transition-colors shadow-sm cursor-pointer"
        >
          <Plus size={16} />
          Add Length
        </button>
      </AnimatedSection>

      <AnimatedSection delay={0.1}>
        <div className="bg-white rounded-2xl shadow-sm border border-dusty-pink/10 overflow-hidden p-6">
          {loading ? (
             <div className="py-10 flex justify-center items-center">
              <div className="w-6 h-6 rounded-full border-2 border-charcoal/20 border-t-rose-gold animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {isAdding && (
                <div className="flex items-center gap-3 bg-cream/30 p-3 rounded-lg border border-charcoal/10">
                  <input
                    type="text"
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New length name"
                    className="flex-1 bg-white border border-charcoal/10 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-rose-gold"
                  />
                  <button onClick={handleAdd} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"><Check size={18} /></button>
                  <button onClick={() => setIsAdding(false)} className="p-1.5 text-charcoal/40 hover:bg-charcoal/5 rounded-md transition-colors"><X size={18} /></button>
                </div>
              )}

              {styles.length === 0 && !isAdding ? (
                 <p className="text-sm text-charcoal/40 text-center py-6 col-span-full">No lengths found. Add one above.</p>
              ) : (
                styles.map((style) => (
                  <div key={style.id} className="flex items-center justify-between p-3 rounded-lg bg-white border border-charcoal/10 hover:bg-cream/30 transition-colors group">
                    {editingId === style.id ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input
                          type="text"
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-white border border-charcoal/10 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-rose-gold"
                        />
                        <button onClick={() => handleUpdate(style.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"><Check size={18} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 text-charcoal/40 hover:bg-charcoal/5 rounded-md transition-colors"><X size={18} /></button>
                      </div>
                    ) : (
                      <>
                        <span className="text-charcoal font-medium text-sm">{style.name}</span>
                        <div className="flex gap-2 text-charcoal/40">
                          <button
                            onClick={() => { setEditingId(style.id); setEditName(style.name); }}
                            className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(style.id)}
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
}