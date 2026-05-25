import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <svg key={i} width="14" height="14" viewBox="0 0 24 24"
            fill={i <= Math.round(rating) ? "#F47A20" : "none"}
            stroke="#F47A20" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500 font-medium">
        {rating} {reviews ? `(${reviews} reviews)` : ""}
      </span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Product not found");
        setProduct(data.product);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center gap-3 text-gray-400">
      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      Loading product...
    </div>
  );

  if (error || !product) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-gray-500">
      <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="opacity-30">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p className="font-semibold">{error || "Product not found"}</p>
      <button onClick={() => navigate(-1)}
        className="text-orange-500 text-sm font-bold hover:underline">
        ← Go Back
      </button>
    </div>
  );

  const p = product;
  const allImages = p.images?.length > 0 ? p.images : [p.thumb];
  const savings = p.oldPrice ? p.oldPrice - p.price : 0;

  const handleAddToCart = () => {
    addToCart(
      { id: p._id, name: p.shortName || p.name, price: p.price, oldPrice: p.oldPrice, discount: p.discount, thumb: p.thumb },
      p.colors?.[selectedColor]?.name || "Default",
      qty,
      isLoggedIn,
      () => navigate("/login")
    );
    if (isLoggedIn) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6">
        <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
        <span>/</span>
        <button onClick={() => navigate(-1)} className="hover:text-orange-500 transition-colors capitalize">
          {p.section || "Products"}
        </button>
        <span>/</span>
        <span className="text-gray-600 line-clamp-1">{p.shortName || p.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">

        {/* ── Left: Image Gallery ──────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square">
            {p.badge && (
              <span className="absolute top-4 left-4 z-10 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full">
                {p.badge}
              </span>
            )}
            {p.discount && (
              <span className="absolute top-4 right-4 z-10 bg-black text-white text-xs font-black px-3 py-1 rounded-full">
                {p.discount}% OFF
              </span>
            )}
            <img
              src={allImages[activeImg]}
              alt={p.name}
              className="w-full h-full object-contain p-4 transition-all duration-300"
              onError={e => { e.target.src = "https://placehold.co/600x600?text=Watch"; }}
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImg === i ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img src={img} alt={`view ${i + 1}`}
                    className="w-full h-full object-contain bg-gray-50"
                    onError={e => { e.target.src = "https://placehold.co/64x64?text=W"; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Right: Product Info ──────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* Category + Name */}
          <div>
            <p className="text-xs font-bold text-orange-500 tracking-widest uppercase mb-2">{p.category}</p>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 leading-snug">{p.name}</h1>
          </div>

          {/* Rating */}
          {p.rating && <StarRating rating={p.rating} reviews={p.reviews} />}

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-gray-900">₹{p.price?.toLocaleString()}</span>
            {p.oldPrice && (
              <>
                <span className="text-lg text-gray-400 line-through mb-0.5">₹{p.oldPrice?.toLocaleString()}</span>
                <span className="text-green-500 font-black text-sm mb-0.5">Save ₹{savings.toLocaleString()}</span>
              </>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${p.available ? "bg-green-400" : "bg-red-400"}`} />
            <span className={`text-sm font-semibold ${p.available ? "text-green-600" : "text-red-500"}`}>
              {p.available ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Colors */}
          {p.colors?.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-2">
                Color — <span className="text-gray-800 normal-case font-semibold">{p.colors[selectedColor]?.name}</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {p.colors.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedColor(i)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      selectedColor === i ? "border-orange-500 scale-110 shadow-md" : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: c.hex || "#ccc" }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            {/* Qty control */}
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="px-4 py-3 text-gray-500 hover:bg-gray-100 font-bold transition-colors">−</button>
              <span className="px-4 py-3 font-black text-gray-900 min-w-[2.5rem] text-center">{qty}</span>
              <button onClick={() => setQty(q => q + 1)}
                className="px-4 py-3 text-gray-500 hover:bg-gray-100 font-bold transition-colors">+</button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!p.available}
              className={`flex-1 py-3.5 rounded-xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                added
                  ? "bg-green-500 text-white"
                  : p.available
                  ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {added ? (
                <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>Added!</>
              ) : (
                <><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>Add to Cart</>
              )}
            </button>
          </div>

          {/* Perks */}
          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-gray-100">
            {[
              { icon: "🚚", label: "Free Delivery", sub: "Orders above ₹999" },
              { icon: "↩️", label: "30-Day Returns", sub: "Easy returns" },
              { icon: "🛡️", label: "2 Year Warranty", sub: "Titan warranty" },
            ].map(perk => (
              <div key={perk.label} className="text-center">
                <div className="text-xl mb-1">{perk.icon}</div>
                <p className="text-xs font-bold text-gray-700">{perk.label}</p>
                <p className="text-[10px] text-gray-400">{perk.sub}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {p.description && (
            <div>
              <h3 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wide">About this product</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.description}</p>
            </div>
          )}

          {/* Features */}
          {p.features?.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">Key Features</h3>
              <ul className="space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <svg width="16" height="16" fill="none" stroke="#F47A20" strokeWidth="2.5" viewBox="0 0 24 24" className="flex-shrink-0 mt-0.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta info */}
          <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-100">
            {p.gender && <p>Gender: <span className="text-gray-600 font-semibold">{p.gender}</span></p>}
            {p.size && <p>Size: <span className="text-gray-600 font-semibold">{p.size}</span></p>}
            {p.strapColor && <p>Strap Color: <span className="text-gray-600 font-semibold">{p.strapColor}</span></p>}
          </div>
        </div>
      </div>
    </div>
  );
}