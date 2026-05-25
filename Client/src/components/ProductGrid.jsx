import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24"
          fill={i <= Math.round(rating) ? "#F47A20" : "none"}
          stroke="#F47A20" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
      {rating && <span className="text-[10px] text-gray-400 ml-1">{rating}</span>}
    </div>
  );
}

export function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const p = product;

  const handleAdd = (e) => {
    e.stopPropagation(); // image click saathe conflict na thay
    addToCart(
      { id: p._id, name: p.shortName || p.name, price: p.price, oldPrice: p.oldPrice, discount: p.discount, thumb: p.thumb },
      p.colors?.[0]?.name || "Default", 1, isLoggedIn, () => navigate("/login")
    );
  };

  const handleCardClick = () => {
    navigate(`/product/${p._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group relative flex flex-col cursor-pointer"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {p.badge && <span className="bg-orange-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{p.badge}</span>}
        {p.discount && <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-full">{p.discount}% OFF</span>}
      </div>
      {!p.available && (
        <div className="absolute inset-0 bg-white/70 z-20 flex items-center justify-center">
          <span className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full">Out of Stock</span>
        </div>
      )}

      {/* Image */}
      <div className="overflow-hidden h-52 bg-gray-50 relative">
        <img
          src={p.thumb}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          onError={e => { e.target.src = "https://placehold.co/400x300?text=Watch"; }}
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-full shadow-lg">
            View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">{p.category}</p>
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1 group-hover:text-orange-500 transition-colors">
          {p.shortName || p.name}
        </p>
        {p.rating && <div className="mt-2"><StarRating rating={p.rating} /></div>}
        <div className="flex items-center gap-2 mt-2">
          <span className="font-black text-gray-900">₹{p.price?.toLocaleString()}</span>
          {p.oldPrice && <span className="text-xs text-gray-400 line-through">₹{p.oldPrice?.toLocaleString()}</span>}
        </div>
        <button
          onClick={handleAdd}
          className="mt-3 w-full bg-gray-900 hover:bg-orange-500 text-white text-xs font-black py-2.5 rounded-lg transition-colors active:scale-95"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, error, emptyMsg = "No products found." }) {
  if (loading) return (
    <div className="flex items-center justify-center py-32 gap-3 text-gray-400">
      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
      Loading products...
    </div>
  );
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (products.length === 0) return (
    <div className="text-center py-32 text-gray-400">
      <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mx-auto mb-4 opacity-30">
        <circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/>
        <path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83"/>
      </svg>
      <p className="font-semibold">{emptyMsg}</p>
    </div>
  );
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );
}