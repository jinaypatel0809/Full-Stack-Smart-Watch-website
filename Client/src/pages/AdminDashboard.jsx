import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts, addProduct, updateProduct, deleteProduct } from "../hooks/useProducts";

// ─────────────────────────────────────────────────────────────
// Theme context (dark / light)
// ─────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("admin_theme") !== "light";
  });
  const toggle = useCallback(() => {
    setDark(d => {
      localStorage.setItem("admin_theme", !d ? "dark" : "light");
      return !d;
    });
  }, []);
  return { dark, toggle };
}

// ─────────────────────────────────────────────────────────────
// Theme-aware class helpers
// ─────────────────────────────────────────────────────────────
function cls(dark, darkCls, lightCls) { return dark ? darkCls : lightCls; }

// ─────────────────────────────────────────────────────────────
// Sidebar menu
// ─────────────────────────────────────────────────────────────
const MENU = [
  { id: "dashboard",    label: "Dashboard",           section: null,           icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
  { id: "trending",     label: "Add Trending Watch",  section: "trending",     icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
  { id: "watches",      label: "Add Watches",         section: "watches",      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg> },
  { id: "smartwatches", label: "Add Smart Watches",   section: "smartwatches", icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> },
  { id: "vyb",          label: "Add VYB By Fastrack", section: "vyb",          icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: "sale",         label: "Add SALE",            section: "sale",         icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
  { id: "gifting",      label: "Add Gifting",         section: "gifting",      icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg> },
  { id: "accessories",  label: "Add Accessories",     section: "accessories",  icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M5.34 18.66l-1.41 1.41M19.07 19.07l-1.41-1.41M5.34 5.34L3.93 3.93M21 12h-2M5 12H3"/></svg> },
  { id: "orders",       label: "All Orders",           section: null,           icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
];

const PAGE_META = {
  trending:     { title: "Trending Watches",  subtitle: "Watches shown in the Trending section on homepage.", catDefault: "Trending" },
  watches:      { title: "Watches",           subtitle: "Analog / digital watches catalogue.", catDefault: "Analog Watch" },
  smartwatches: { title: "Smart Watches",     subtitle: "Smart watches catalogue.", catDefault: "Smart Watch" },
  vyb:          { title: "VYB By Fastrack",   subtitle: "VYB By Fastrack collection.", catDefault: "VYB By Fastrack" },
  sale:         { title: "SALE Products",     subtitle: "Watches on sale.", catDefault: "Sale" },
  gifting:      { title: "Gifting",           subtitle: "Gifting collection.", catDefault: "Gifting" },
  accessories:  { title: "Accessories",       subtitle: "Straps, chargers & accessories.", catDefault: "Accessory" },
};

// ─────────────────────────────────────────────────────────────
// Shared form field builder
// ─────────────────────────────────────────────────────────────
function productToForm(p) {
  return {
    name:        p.name || "",
    shortName:   p.shortName || "",
    price:       p.price || "",
    oldPrice:    p.oldPrice || "",
    discount:    p.discount || "",
    category:    p.category || "",
    gender:      p.gender || "Unisex",
    size:        p.size || "Medium",
    strapColor:  p.strapColor || "Black",
    badge:       p.badge || "",
    rating:      p.rating || "4.5",
    reviews:     p.reviews || "0",
    thumb:       p.thumb || "",
    description: p.description || "",
    features:    Array.isArray(p.features) ? p.features.join("\n") : (p.features || ""),
    available:   p.available !== false,
    colors:      Array.isArray(p.colors) ? p.colors.map(c => `${c.name}, ${c.hex}`).join("\n") : (p.colors || ""),
    images:      Array.isArray(p.images) ? p.images.join("\n") : (p.images || ""),
  };
}

function formToPayload(form, section) {
  return {
    ...form,
    section,
    price:    Number(form.price),
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    discount: form.discount ? Number(form.discount) : undefined,
    rating:   Number(form.rating),
    reviews:  Number(form.reviews),
    features: form.features.split("\n").map(f => f.trim()).filter(Boolean),
    colors:   form.colors.split("\n").map(line => {
      const [name, hex] = line.split(",").map(s => s.trim());
      return name ? { name, hex: hex || "#000000" } : null;
    }).filter(Boolean),
    images: form.images.split("\n").map(i => i.trim()).filter(Boolean),
  };
}

// ─────────────────────────────────────────────────────────────
// Product Form (shared for Add + Edit)
// ─────────────────────────────────────────────────────────────
function ProductForm({ initialForm, onSubmit, submitLabel, dark }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { setForm(initialForm); }, [JSON.stringify(initialForm)]);

  const ic = cls(dark,
    "w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all",
    "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
  );
  const lc = cls(dark, "block text-xs font-bold text-gray-400 tracking-widest uppercase mb-1.5",
                       "block text-xs font-bold text-gray-500 tracking-widest uppercase mb-1.5");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setSaving(true);
    try {
      await onSubmit(form);
      setSuccess("Saved successfully!");
      setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {success && <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 text-sm px-4 py-3 rounded-xl"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>{success}</div>}
      {error   && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl"><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2"><label className={lc}>Full Product Name *</label><input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Fastrack Reflex Nitro+..." className={ic}/></div>
        <div className="lg:col-span-2"><label className={lc}>Short Name (Card Display)</label><input name="shortName" value={form.shortName} onChange={handleChange} placeholder="Shorter display name" className={ic}/></div>
        <div><label className={lc}>Price (₹) *</label><input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="1799" className={ic}/></div>
        <div><label className={lc}>Original Price (₹)</label><input name="oldPrice" type="number" value={form.oldPrice} onChange={handleChange} placeholder="3999" className={ic}/></div>
        <div><label className={lc}>Discount (%)</label><input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="55" className={ic}/></div>
        <div><label className={lc}>Category</label><input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Unisex Smartwatch" className={ic}/></div>
        <div><label className={lc}>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} className={ic}>
            <option>Men</option><option>Women</option><option>Unisex</option><option>Girls</option>
          </select>
        </div>
        <div><label className={lc}>Size</label>
          <select name="size" value={form.size} onChange={handleChange} className={ic}>
            <option>Small</option><option>Medium</option><option>Large</option>
          </select>
        </div>
        <div><label className={lc}>Strap Color</label>
          <select name="strapColor" value={form.strapColor} onChange={handleChange} className={ic}>
            <option>Black</option><option>Silver</option><option>Rose Gold</option><option>Beige</option><option>Green</option><option>Pink</option><option>Navy Blue</option><option>Brown</option>
          </select>
        </div>
        <div><label className={lc}>Badge</label><input name="badge" value={form.badge} onChange={handleChange} placeholder="Best Seller / New / Hot" className={ic}/></div>
        <div><label className={lc}>Rating (1–5)</label><input name="rating" type="number" step="0.1" min="1" max="5" value={form.rating} onChange={handleChange} className={ic}/></div>
        <div><label className={lc}>No. of Reviews</label><input name="reviews" type="number" value={form.reviews} onChange={handleChange} className={ic}/></div>
      </div>

      <div><label className={lc}>Thumbnail Image URL *</label>
        <input name="thumb" value={form.thumb} onChange={handleChange} required placeholder="https://..." className={ic}/>
        {form.thumb && <img src={form.thumb} alt="preview" className="mt-2 w-20 h-20 object-cover rounded-xl border border-gray-700" onError={e => e.target.style.display='none'}/>}
      </div>
      <div><label className={lc}>Product Images (one URL per line)</label><textarea name="images" value={form.images} onChange={handleChange} rows={3} placeholder={"https://img1.jpg\nhttps://img2.jpg"} className={ic + " resize-none"}/></div>
      <div><label className={lc}>Description</label><textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description..." className={ic + " resize-none"}/></div>
      <div><label className={lc}>Features (one per line)</label><textarea name="features" value={form.features} onChange={handleChange} rows={4} placeholder={"AMOLED Display\nBT Calling\nIP68"} className={ic + " resize-none"}/></div>
      <div><label className={lc}>Colors (Name, #hex — one per line)</label><textarea name="colors" value={form.colors} onChange={handleChange} rows={3} placeholder={"Black, #1a1a1a\nNavy Blue, #1a2a4a"} className={ic + " resize-none"}/></div>

      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setForm(prev => ({ ...prev, available: !prev.available }))}
          className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${form.available ? "bg-orange-500" : "bg-gray-600"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form.available ? "translate-x-5" : ""}`}/>
        </button>
        <span className={cls(dark,"text-sm text-gray-300 font-medium","text-sm text-gray-600 font-medium")}>In Stock / Available</span>
      </div>

      <button type="submit" disabled={saving}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black text-sm px-8 py-3.5 rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-orange-500/20">
        {saving
          ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</>
          : <><svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>{submitLabel}</>
        }
      </button>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Edit Modal
// ─────────────────────────────────────────────────────────────
function EditModal({ product, section, token, dark, onClose, onSaved }) {
  const handleEdit = async (form) => {
    const payload = formToPayload(form, section);
    await updateProduct(product._id, payload, token);
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4 bg-black/70 backdrop-blur-sm">
      <div className={`w-full max-w-3xl rounded-2xl shadow-2xl ${cls(dark,"bg-gray-900 border border-gray-700","bg-white border border-gray-200")}`}>
        {/* Modal header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${cls(dark,"border-gray-800","border-gray-100")}`}>
          <div>
            <h2 className={`font-black text-lg ${cls(dark,"text-white","text-gray-900")}`}>Edit Product</h2>
            <p className={`text-xs mt-0.5 ${cls(dark,"text-gray-500","text-gray-400")}`}>{product.name}</p>
          </div>
          <button onClick={onClose}
            className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${cls(dark,"hover:bg-gray-800 text-gray-400","hover:bg-gray-100 text-gray-500")}`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {/* Modal body */}
        <div className="px-6 py-6">
          <ProductForm
            initialForm={productToForm(product)}
            onSubmit={handleEdit}
            submitLabel="Save Changes"
            dark={dark}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Admin Product Card (with Edit + Delete)
// ─────────────────────────────────────────────────────────────
function AdminProductCard({ product, dark, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);
  const cardCls = cls(dark,
    "bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden flex flex-col group",
    "bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col group shadow-sm hover:shadow-md transition-shadow"
  );
  return (
    <div className={cardCls}>
      <div className="relative overflow-hidden h-44">
        <img src={product.thumb} alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={e => { e.target.src = "https://placehold.co/400x300?text=No+Image"; }}/>
        {product.badge && <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{product.badge}</span>}
        {!product.available && <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${cls(dark,"bg-gray-900/80 text-gray-400","bg-white/90 text-gray-500")}`}>Out of Stock</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className={`text-sm font-semibold line-clamp-2 flex-1 ${cls(dark,"text-white","text-gray-800")}`}>{product.name}</p>
        <p className={`text-xs mt-1 ${cls(dark,"text-gray-500","text-gray-400")}`}>{product.category}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-orange-500 font-black text-sm">₹{product.price?.toLocaleString()}</span>
          {product.oldPrice && <span className={`text-xs line-through ${cls(dark,"text-gray-600","text-gray-400")}`}>₹{product.oldPrice?.toLocaleString()}</span>}
          {product.discount && <span className="text-green-400 text-xs font-bold">{product.discount}% off</span>}
        </div>
        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <button onClick={() => onEdit(product)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl border transition-all ${cls(dark,"bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 text-blue-400","bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600")}`}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
          <button
            onClick={async () => {
              if (!confirm("Delete this product?")) return;
              setDeleting(true);
              await onDelete(product._id);
              setDeleting(false);
            }}
            disabled={deleting}
            className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl border transition-all disabled:opacity-50 ${cls(dark,"bg-red-500/10 hover:bg-red-500/20 border-red-500/20 text-red-400","bg-red-50 hover:bg-red-100 border-red-200 text-red-500")}`}>
            {deleting ? "..." : (<><svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>Delete</>)}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Section Page
// ─────────────────────────────────────────────────────────────
function SectionPage({ menuItem, token, dark }) {
  const meta = PAGE_META[menuItem.id] || {};
  const { products, loading, error, refetch } = useProducts(menuItem.section);
  const [tab, setTab] = useState("add");
  const [editProduct, setEditProduct] = useState(null);

  const emptyForm = {
    name:"", shortName:"", price:"", oldPrice:"", discount:"",
    category: meta.catDefault || "", gender:"Unisex", size:"Medium",
    strapColor:"Black", badge:"", rating:"4.5", reviews:"0",
    thumb:"", description:"", features:"", available:true, colors:"", images:"",
  };

  const handleAdd = async (form) => {
    const payload = formToPayload(form, menuItem.section);
    await addProduct(payload, token);
    refetch();
    setTab("list");
  };

  const handleDelete = async (id) => {
    await deleteProduct(id, token);
    refetch();
  };

  const tabBtnCls = (active) => active
    ? "bg-orange-500 text-white shadow px-5 py-2 rounded-lg text-sm font-bold"
    : `px-5 py-2 rounded-lg text-sm font-bold transition-all ${cls(dark,"text-gray-400 hover:text-gray-200","text-gray-500 hover:text-gray-700")}`;

  return (
    <div className="max-w-5xl mx-auto">
      {editProduct && (
        <EditModal
          product={editProduct}
          section={menuItem.section}
          token={token}
          dark={dark}
          onClose={() => setEditProduct(null)}
          onSaved={() => { refetch(); setTab("list"); }}
        />
      )}

      <div className="mb-6">
        <h1 className={`text-2xl font-black ${cls(dark,"text-white","text-gray-900")}`}>{meta.title}</h1>
        <p className={`text-sm mt-1 ${cls(dark,"text-gray-500","text-gray-400")}`}>{meta.subtitle}</p>
      </div>

      <div className={`flex gap-1 p-1 rounded-xl mb-6 w-fit ${cls(dark,"bg-gray-800","bg-gray-100")}`}>
        <button onClick={() => setTab("add")} className={tabBtnCls(tab==="add")}>Add Product</button>
        <button onClick={() => setTab("list")} className={tabBtnCls(tab==="list")}>
          All Products {products.length > 0 ? `(${products.length})` : ""}
        </button>
      </div>

      {tab === "add" && (
        <div className={`rounded-2xl p-6 md:p-8 ${cls(dark,"bg-gray-900 border border-gray-800","bg-white border border-gray-200 shadow-sm")}`}>
          <ProductForm initialForm={emptyForm} onSubmit={handleAdd} submitLabel="Add Product" dark={dark}/>
        </div>
      )}

      {tab === "list" && (
        <div>
          {loading && <div className="flex items-center justify-center py-20 gap-3 text-gray-500"><svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Loading...</div>}
          {error && <p className="text-red-400 py-8 text-center text-sm">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <div className={`text-center py-20 ${cls(dark,"text-gray-600","text-gray-400")}`}>
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4 opacity-40"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/></svg>
              <p className="font-semibold">No products yet</p>
              <p className="text-sm mt-1">Add your first product using "Add Product" tab.</p>
            </div>
          )}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map(p => (
                <AdminProductCard key={p._id} product={p} dark={dark}
                  onEdit={setEditProduct}
                  onDelete={handleDelete}/>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────
// Orders Page
// ─────────────────────────────────────────────────────────────
const STATUS_COLORS = {
  confirmed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending:   "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  shipped:   "bg-blue-500/10 text-blue-400 border-blue-500/20",
  delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};
const STATUS_COLORS_LIGHT = {
  confirmed: "bg-green-50 text-green-600 border-green-200",
  pending:   "bg-yellow-50 text-yellow-600 border-yellow-200",
  shipped:   "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
  cancelled: "bg-red-50 text-red-500 border-red-200",
};

function OrdersPage({ token, dark }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.orders || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) { alert(err.message); }
    finally { setUpdatingId(null); }
  };

  const filtered = orders.filter(o =>
    (o.userName || "").toLowerCase().includes(search.toLowerCase()) ||
    (o.userEmail || "").toLowerCase().includes(search.toLowerCase()) ||
    o._id.includes(search)
  );

  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const totalItems   = orders.reduce((s, o) => s + (o.items?.reduce((a, i) => a + i.qty, 0) || 0), 0);

  const cardBg  = cls(dark, "bg-gray-900 border border-gray-800", "bg-white border border-gray-200 shadow-sm");
  const textPri = cls(dark, "text-white", "text-gray-900");
  const textSec = cls(dark, "text-gray-400", "text-gray-500");
  const inputCl = cls(dark,
    "bg-gray-800 border border-gray-700 text-white placeholder-gray-600 focus:border-orange-500",
    "bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-400"
  );
  const rowBg   = cls(dark, "hover:bg-gray-800/50", "hover:bg-gray-50");
  const divBg   = cls(dark, "border-gray-800", "border-gray-100");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-black ${textPri}`}>All Orders</h1>
          <p className={`text-sm mt-1 ${textSec}`}>View and manage all customer orders.</p>
        </div>
        <button onClick={fetchOrders}
          className={`flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${cls(dark,"bg-gray-800 hover:bg-gray-700 text-gray-300","bg-gray-100 hover:bg-gray-200 text-gray-600")}`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Orders",   value: orders.length,                                                     color: "from-orange-500 to-orange-600", icon: "📦" },
          { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString()}`,                               color: "from-green-500 to-green-600",   icon: "💰" },
          { label: "Items Sold",     value: totalItems,                                                         color: "from-blue-500 to-blue-600",     icon: "⌚" },
          { label: "Confirmed",      value: orders.filter(o => o.status === "confirmed").length,                color: "from-purple-500 to-purple-600", icon: "✅" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-4`}>
            <div className="text-xl mb-1">{s.icon}</div>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-wide">{s.label}</p>
            <p className="text-white text-xl font-black mt-0.5">{loading ? "..." : s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          className={`absolute left-4 top-1/2 -translate-y-1/2 ${textSec}`}>
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, email or order ID..."
          className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm focus:outline-none transition-all ${inputCl}`} />
      </div>

      {/* Orders list */}
      {loading && (
        <div className={`flex items-center justify-center py-20 gap-3 ${textSec}`}>
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Loading orders...
        </div>
      )}
      {error && <p className="text-red-400 text-sm text-center py-8">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <div className={`text-center py-20 ${textSec}`}>
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4 opacity-30">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p className="font-semibold">{search ? "No orders match your search." : "No orders yet."}</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(order => {
            const isExpanded = expandedId === order._id;
            const statusCls = (cls(dark, STATUS_COLORS, STATUS_COLORS_LIGHT))[order.status] || "";
            const orderDate = new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" });
            const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0;

            return (
              <div key={order._id} className={`rounded-2xl overflow-hidden transition-all ${cardBg}`}>
                {/* Order header row */}
                <div className={`flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer ${rowBg} transition-colors`}
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}>

                  {/* Expand icon */}
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                    className={`flex-shrink-0 transition-transform duration-200 ${textSec} ${isExpanded ? "rotate-180" : ""}`}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>

                  {/* Order ID */}
                  <div className="min-w-[140px]">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSec}`}>Order ID</p>
                    <p className={`text-xs font-mono font-bold ${textPri}`}>#{order._id.slice(-8).toUpperCase()}</p>
                  </div>

                  {/* Customer */}
                  <div className="flex-1 min-w-[140px]">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSec}`}>Customer</p>
                    <p className={`text-sm font-bold ${textPri}`}>{order.userName || order.user?.name || "—"}</p>
                    <p className={`text-xs ${textSec}`}>{order.userEmail || order.user?.email || "—"}</p>
                  </div>

                  {/* Date */}
                  <div className="min-w-[130px] hidden sm:block">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSec}`}>Date</p>
                    <p className={`text-xs ${textPri}`}>{orderDate}</p>
                  </div>

                  {/* Items */}
                  <div className="min-w-[60px]">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSec}`}>Items</p>
                    <p className={`text-sm font-bold ${textPri}`}>{itemCount}</p>
                  </div>

                  {/* Total */}
                  <div className="min-w-[90px]">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${textSec}`}>Total</p>
                    <p className="text-sm font-black text-orange-500">₹{order.total?.toLocaleString()}</p>
                  </div>

                  {/* Status dropdown */}
                  <div onClick={e => e.stopPropagation()}>
                    <select
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={e => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all focus:outline-none ${statusCls} ${cls(dark,"bg-transparent","bg-transparent")} cursor-pointer`}
                    >
                      {["pending","confirmed","shipped","delivered","cancelled"].map(s => (
                        <option key={s} value={s} className="bg-gray-900 text-white">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Expanded — product details */}
                {isExpanded && (
                  <div className={`border-t px-5 py-4 space-y-3 ${divBg}`}>
                    <p className={`text-xs font-black uppercase tracking-widest ${textSec} mb-3`}>Order Items</p>
                    {order.items?.map((item, i) => (
                      <div key={i} className={`flex items-center gap-4 py-3 border-b last:border-0 ${divBg}`}>
                        {/* Thumb */}
                        <img src={item.thumb} alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                          style={{ background: "#1f2937" }}
                          onError={e => { e.target.style.display="none"; }}/>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold line-clamp-1 ${textPri}`}>{item.shortName || item.name}</p>
                          <div className={`flex items-center gap-3 mt-1 text-xs ${textSec}`}>
                            {item.color && <span>Color: <span className="font-semibold">{item.color}</span></span>}
                            <span>Qty: <span className="font-semibold">{item.qty}</span></span>
                            {item.discount && <span className="text-orange-400">{item.discount}% off</span>}
                          </div>
                        </div>
                        {/* Price */}
                        <div className="text-right flex-shrink-0">
                          <p className={`text-sm font-black ${textPri}`}>₹{(item.price * item.qty).toLocaleString()}</p>
                          <p className={`text-xs ${textSec}`}>₹{item.price?.toLocaleString()} each</p>
                        </div>
                      </div>
                    ))}

                    {/* Order summary */}
                    <div className={`rounded-xl p-4 space-y-1.5 mt-2 ${cls(dark,"bg-gray-800","bg-gray-50")}`}>
                      <div className={`flex justify-between text-xs ${textSec}`}>
                        <span>Subtotal</span><span>₹{order.subtotal?.toLocaleString()}</span>
                      </div>
                      <div className={`flex justify-between text-xs ${textSec}`}>
                        <span>Delivery</span>
                        <span className={order.delivery === 0 ? "text-green-400 font-semibold" : ""}>{order.delivery === 0 ? "FREE" : `₹${order.delivery}`}</span>
                      </div>
                      <div className={`flex justify-between text-sm font-black pt-2 border-t ${divBg} ${textPri}`}>
                        <span>Grand Total</span><span className="text-orange-500">₹{order.total?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Dashboard Home
// ─────────────────────────────────────────────────────────────
function DashboardHome({ user, dark }) {
  const { products, loading } = useProducts();
  const counts = {};
  products.forEach(p => { counts[p.section] = (counts[p.section] || 0) + 1; });

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-orange-100 text-sm font-medium">Welcome back,</p>
          <h2 className="text-white text-2xl font-black mt-0.5">{user?.name} 👋</h2>
          <p className="text-orange-100 text-xs mt-2">Manage your Fastrack store from here.</p>
        </div>
        <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/20 items-center justify-center">
          <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label:"Total Products",  value: loading?"...":products.length,             icon:"⌚", color:"from-orange-500 to-orange-600" },
          { label:"Trending",        value: loading?"...":(counts.trending||0),         icon:"🔥", color:"from-yellow-500 to-orange-500" },
          { label:"Watches",         value: loading?"...":(counts.watches||0),          icon:"🕐", color:"from-blue-500 to-blue-600" },
          { label:"Smart Watches",   value: loading?"...":(counts.smartwatches||0),     icon:"📱", color:"from-purple-500 to-purple-600" },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-2xl p-5`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide">{s.label}</p>
            <p className="text-white text-2xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className={`font-black text-base mb-4 ${cls(dark,"text-white","text-gray-900")}`}>Products by Section</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {MENU.filter(m => m.section).map(m => (
            <div key={m.id} className={`rounded-xl p-4 flex items-center gap-3 ${cls(dark,"bg-gray-900 border border-gray-800","bg-white border border-gray-200 shadow-sm")}`}>
              <span className={cls(dark,"text-gray-500","text-gray-400")}>{m.icon}</span>
              <div>
                <p className={`text-sm font-bold ${cls(dark,"text-white","text-gray-900")}`}>{loading ? "..." : (counts[m.section] || 0)}</p>
                <p className={`text-xs ${cls(dark,"text-gray-500","text-gray-400")}`}>{m.label.replace("Add ","")}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Theme Toggle Button
// ─────────────────────────────────────────────────────────────
function ThemeToggle({ dark, toggle }) {
  return (
    <button onClick={toggle}
      title={dark ? "Switch to Light mode" : "Switch to Dark mode"}
      className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${cls(dark,"bg-gray-800 hover:bg-gray-700 text-yellow-400","bg-gray-100 hover:bg-gray-200 text-gray-600")}`}>
      {dark ? (
        /* Sun icon */
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        /* Moon icon */
        <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Main AdminDashboard
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle: toggleTheme } = useTheme();
  const [active, setActive]     = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { if (!isAdmin) navigate("/admin/login"); }, [isAdmin, navigate]);
  if (!isAdmin) return null;

  const token = localStorage.getItem("fastrack_token");
  const handleLogout = () => { logout(); navigate("/admin/login"); };
  const activeMenu = MENU.find(m => m.id === active);

  // ── theme classes
  const bg     = cls(dark, "bg-gray-950", "bg-gray-50");
  const hdrBg  = cls(dark, "bg-gray-900 border-gray-800", "bg-white border-gray-200");
  const sdbBg  = cls(dark, "bg-gray-900 border-gray-800", "bg-white border-gray-200");
  const menuAc = cls(dark, "bg-orange-500/10 border-r-2 border-orange-500 text-orange-400", "bg-orange-50 border-r-2 border-orange-500 text-orange-600");
  const menuDf = cls(dark, "text-gray-400 hover:bg-gray-800/60 hover:text-gray-200", "text-gray-500 hover:bg-gray-100 hover:text-gray-800");
  const iconAc = cls(dark, "text-orange-400", "text-orange-500");
  const iconDf = cls(dark, "text-gray-600 group-hover:text-gray-400", "text-gray-400 group-hover:text-gray-600");

  return (
    <div className={`min-h-screen flex flex-col ${bg} transition-colors duration-300`}>

      {/* ── Top Navbar ─────────────────────────────────── */}
      <header className={`border-b px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300 ${hdrBg}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(p => !p)}
            className={`lg:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-colors ${cls(dark,"hover:bg-gray-800","hover:bg-gray-100")}`}>
            <span className={`block w-5 h-0.5 rounded transition-all ${cls(dark,"bg-gray-400","bg-gray-600")} ${sidebarOpen?"rotate-45 translate-y-2":""}`}/>
            <span className={`block w-5 h-0.5 rounded transition-all ${cls(dark,"bg-gray-400","bg-gray-600")} ${sidebarOpen?"opacity-0":""}`}/>
            <span className={`block w-5 h-0.5 rounded transition-all ${cls(dark,"bg-gray-400","bg-gray-600")} ${sidebarOpen?"-rotate-45 -translate-y-2":""}`}/>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <div className="hidden sm:block">
              <span style={{fontFamily:"Georgia, serif", fontStyle:"italic", fontWeight:900, fontSize:"18px", color: dark?"#fff":"#111"}}>fastrack</span>
              <span className={`text-xs ml-2 font-bold tracking-widest uppercase ${cls(dark,"text-gray-500","text-gray-400")}`}>Admin</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <ThemeToggle dark={dark} toggle={toggleTheme}/>

          {/* User chip */}
          <div className={`hidden sm:flex items-center gap-2 rounded-xl px-3 py-2 ${cls(dark,"bg-gray-800","bg-gray-100")}`}>
            <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg width="13" height="13" fill="none" stroke="#F47A20" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span className={`text-xs font-semibold ${cls(dark,"text-gray-300","text-gray-700")}`}>{user?.name}</span>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${cls(dark,"bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white","bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900")}`}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}/>}

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className={`fixed top-16 left-0 bottom-0 z-30 w-64 border-r flex flex-col transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:z-auto lg:top-auto ${sdbBg} ${sidebarOpen?"translate-x-0":"-translate-x-full"}`}>
          <nav className="flex-1 py-4 overflow-y-auto">
            <p className={`text-[10px] font-black tracking-widest uppercase px-5 mb-2 ${cls(dark,"text-gray-600","text-gray-400")}`}>Menu</p>
            {MENU.map(item => (
              <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all group ${active===item.id ? menuAc : menuDf}`}>
                <span className={`flex-shrink-0 ${active===item.id ? iconAc : iconDf}`}>{item.icon}</span>
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Sidebar bottom — theme toggle label */}
          <div className={`p-4 border-t ${cls(dark,"border-gray-800","border-gray-200")}`}>
            <div className={`rounded-xl p-3 flex items-center justify-between ${cls(dark,"bg-gray-800/60","bg-gray-100")}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <svg width="14" height="14" fill="none" stroke="#F47A20" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <p className={`text-xs font-bold truncate max-w-[100px] ${cls(dark,"text-white","text-gray-900")}`}>{user?.name}</p>
                  <p className="text-orange-400 text-[10px] font-bold uppercase tracking-wider">Admin</p>
                </div>
              </div>
              <ThemeToggle dark={dark} toggle={toggleTheme}/>
            </div>
          </div>
        </aside>

        {/* ── Main Content ──────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8 min-w-0">
          {active === "dashboard"
            ? <DashboardHome user={user} dark={dark}/>
            : active === "orders"
            ? <OrdersPage token={token} dark={dark}/>
            : <SectionPage menuItem={activeMenu} token={token} dark={dark}/>
          }
        </main>
      </div>
    </div>
  );
}