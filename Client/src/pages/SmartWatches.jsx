import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// ── Filters config ──────────────────────────────────────────────
const FILTERS = {
  gender:     { label: "Gender",      options: ["Men", "Girls", "Unisex"] },
  size:       { label: "Screen Size", options: ["Small", "Medium", "Large"] },
  price:      { label: "Price",       options: ["Under ₹1000", "₹1000–₹2000", "₹2000–₹4000", "Above ₹4000"] },
  strapColor: { label: "Strap Color", options: ["Black", "Silver", "Rose Gold", "Beige", "Green", "Pink"] },
  discount:   { label: "Discount",    options: ["10% and above", "30% and above", "50% and above"] },
};

function priceMatch(price, range) {
  if (range === "Under ₹1000")   return price < 1000;
  if (range === "₹1000–₹2000")  return price >= 1000 && price <= 2000;
  if (range === "₹2000–₹4000")  return price > 2000 && price <= 4000;
  if (range === "Above ₹4000")  return price > 4000;
  return true;
}

function discountMatch(discount, range) {
  if (!discount) return false;
  if (range === "10% and above") return discount >= 10;
  if (range === "30% and above") return discount >= 30;
  if (range === "50% and above") return discount >= 50;
  return true;
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="11" height="11" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#f97316" : "#e5e7eb"}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <span className="text-[11px] text-gray-400 ml-1">{rating}</span>
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col transition-all duration-300"
      style={{
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.13)" : "0 2px 8px rgba(0,0,0,0.05)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      {/* Image */}
      <div
        onClick={() => navigate(`/product/${product._id}`)}
        className="relative bg-gray-50 cursor-pointer overflow-hidden"
        style={{ height: 250 }}
      >
        <img
          src={product.thumb || product.image}
          alt={product.name}
          className="w-full h-full object-contain p-3 transition-transform duration-300"
          style={{ transform: hovered ? "scale(1.07)" : "scale(1)" }}
          onError={(e) => { e.target.src = "https://placehold.co/300x210?text=SmartWatch"; }}
        />
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wide">
            {product.badge}
          </span>
        )}
        {product.discount && (
          <span className="absolute top-2.5 right-2.5 bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        <div
          className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          style={{ background: hovered ? "rgba(0,0,0,0.07)" : "transparent" }}
        >
          {hovered && (
            <span className="bg-white text-gray-900 text-[11px] font-black px-4 py-2 rounded-full shadow-lg">
              View Details
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <p
          onClick={() => navigate(`/product/${product._id}`)}
          className="text-[12.5px] font-bold text-gray-800 line-clamp-2 leading-snug cursor-pointer hover:text-orange-500 transition-colors"
        >
          {product.shortName || product.name}
        </p>
        <p className="text-[11px] text-gray-400">{product.category}</p>
        {product.rating && (
          <div className="flex items-center gap-1.5">
            <Stars rating={product.rating} />
            {product.reviews && (
              <span className="text-[10px] text-gray-400">({product.reviews})</span>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[15px] font-black text-gray-900">
            ₹{product.price?.toLocaleString()}
          </span>
          {product.oldPrice && (
            <span className="text-[11px] text-gray-400 line-through">
              ₹{product.oldPrice?.toLocaleString()}
            </span>
          )}
          {product.discount && (
            <span className="text-[11px] font-bold text-orange-500">
              {product.discount}% off
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="mt-2 w-full bg-gray-900 hover:bg-orange-500 text-white text-[11px] font-black py-2.5 rounded-xl transition-colors tracking-wide"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default function SmartWatches() {
  const navigate = useNavigate();
  const { products: dbProducts, loading } = useProducts("smartwatches");
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState({});
  const [sortBy,   setSortBy]   = useState("relevance");

  const toggleFilter = (key, value) => {
    setSelected((prev) => {
      const cur = prev[key] || [];
      return {
        ...prev,
        [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  };

  const clearAll = () => { setSelected({}); setSearch(""); };
  const activeCount = Object.values(selected).flat().length;

  const filtered = useMemo(() => {
    let list = [...dbProducts];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.strapColor || "").toLowerCase().includes(q)
      );
    }
    if (selected.size?.length)       list = list.filter((p) => selected.size.includes(p.size));
    if (selected.gender?.length)     list = list.filter((p) => selected.gender.includes(p.gender));
    if (selected.price?.length)      list = list.filter((p) => selected.price.some((r) => priceMatch(p.price, r)));
    if (selected.strapColor?.length) list = list.filter((p) => selected.strapColor.includes(p.strapColor));
    if (selected.discount?.length)   list = list.filter((p) => selected.discount.some((r) => discountMatch(p.discount, r)));

    if (sortBy === "price-asc")  list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "discount")   list.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    if (sortBy === "rating")     list.sort((a, b) => (b.rating || 0) - (a.rating || 0));

    return list;
  }, [search, selected, sortBy, dbProducts]);

  const handleAddToCart = (product) => {
    addToCart(
      {
        id:        product._id,
        name:      product.name,
        shortName: product.shortName,
        price:     product.price,
        oldPrice:  product.oldPrice,
        discount:  product.discount,
        thumb:     product.thumb || product.image,
      },
      product.colors?.[0]?.name || "Default",
      1,
      isLoggedIn,
      () => navigate("/login")
    );
  };

  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* Hero Banner */}
      <div
        className="relative overflow-hidden text-center py-12 px-4"
        style={{ background: "linear-gradient(135deg,#111 0%,#1a1a2e 60%,#0d1b2a 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%,rgba(249,115,22,.13) 0%,transparent 60%)," +
              "radial-gradient(circle at 80% 20%,rgba(99,102,241,.08) 0%,transparent 50%)",
          }}
        />
        <p className="text-orange-500 text-[11px] font-black tracking-[4px] uppercase mb-2">
          Fastrack Collection
        </p>
        <h1 className="text-white text-4xl font-black tracking-tight">Smart Watches</h1>
        <p className="text-gray-400 text-sm mt-2">
          {loading
            ? "Loading collection..."
            : dbProducts.length === 0
            ? "No smart watches added yet"
            : `${filtered.length} smart styles for every wrist`}
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-5 py-7">

        {/* Filter Bar */}
        <div
          className="bg-white rounded-2xl border border-gray-100 px-5 py-4 mb-6 flex flex-wrap gap-3 items-center"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
        >
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]">🔍</span>
            <input
              type="text"
              placeholder="Search smart watches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-[13px] bg-gray-50 outline-none focus:border-orange-400 transition-colors"
            />
          </div>

          {Object.entries(FILTERS).map(([key, cfg]) => (
            <select
              key={key}
              onChange={(e) => { if (e.target.value) toggleFilter(key, e.target.value); e.target.value = ""; }}
              className="border rounded-xl px-3 py-2.5 text-[12px] font-semibold outline-none cursor-pointer transition-all"
              style={{
                borderColor: selected[key]?.length ? "#f97316" : "#e5e7eb",
                background:  selected[key]?.length ? "#fff7ed" : "#fafaf8",
                color:       selected[key]?.length ? "#f97316" : "#374151",
              }}
            >
              <option value="">
                {cfg.label}{selected[key]?.length ? ` (${selected[key].length})` : ""}
              </option>
              {cfg.options.map((opt) => (
                <option key={opt} value={opt}>
                  {selected[key]?.includes(opt) ? "✓ " : ""}{opt}
                </option>
              ))}
            </select>
          ))}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-[12px] font-semibold bg-gray-50 outline-none cursor-pointer"
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="discount">Best Discount</option>
            <option value="rating">Top Rated</option>
          </select>

          {(activeCount > 0 || search) && (
            <button
              onClick={clearAll}
              className="border border-orange-400 text-orange-500 rounded-xl px-4 py-2.5 text-[12px] font-bold hover:bg-orange-50 transition-colors"
            >
              Clear {activeCount > 0 ? `(${activeCount})` : ""}
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(selected).flatMap(([key, values]) =>
              (values || []).map((val) => (
                <button
                  key={`${key}-${val}`}
                  onClick={() => toggleFilter(key, val)}
                  className="bg-orange-50 border border-orange-200 text-orange-600 text-[12px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-orange-100 transition-colors"
                >
                  {val}
                  <span className="text-base leading-none">×</span>
                </button>
              ))
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-medium">Loading smart watches...</span>
          </div>
        )}

        {/* No products */}
        {!loading && dbProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">⌚</p>
            <p className="text-lg font-black text-gray-800 mb-2">No smart watches added yet</p>
            <p className="text-sm text-gray-400">
              Admin dashboard → "smartwatches" section maa products add karo, aena pachhi ahiya show thase.
            </p>
          </div>
        )}

        {/* Filters returned no results */}
        {!loading && dbProducts.length > 0 && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-lg font-black text-gray-800 mb-2">No matches found</p>
            <p className="text-sm text-gray-400 mb-6">Try adjusting your filters or search</p>
            <button
              onClick={clearAll}
              className="bg-orange-500 hover:bg-orange-600 text-white font-black text-sm px-6 py-3 rounded-xl transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Result count */}
        {!loading && filtered.length > 0 && (
          <p className="text-[13px] text-gray-400 mb-5">
            Showing <strong className="text-gray-800">{filtered.length}</strong> smart watches
          </p>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}