import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const STATIC = [
  { _id:"s1", name:"Fastrack UFO Quartz Multifunction Green Dial Silver Stainless Steel Strap Watch", category:"Guys Watches", price:5995, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwe3fcaac7/images/Fastrack/Catalog/3327SM01_1.jpg?sw=360&sh=360" },
  { _id:"s2", name:"Fastrack Vyb Nimbus Quartz Analog Black Dial Two Toned Color Metal Strap Watch", category:"Guys Watches", price:2195, oldPrice:3135, discount:30, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw9cd3d075/images/Fastrack/Catalog/FV30010KM02W_1.jpg?sw=360&sh=360" },
  { _id:"s3", name:"Fastrack Pulse IV Dual Time Analog Watch with Green Dial & Brown Leather Strap", category:"Guys Watches", price:4295, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwaf5a6d4a/images/Fastrack/Catalog/3341QL01_1.jpg?sw=600&sh=600" },
  { _id:"s4", name:"Vyb Striker By Fastrack Quartz Analog Rose Gold Dial Rose Gold Metal Strap Watch For Girls", category:"Girls Watches", price:1995, oldPrice:2850, discount:30, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw57e35cef/images/Fastrack/Catalog/FV60130WM01W_1.jpg?sw=600&sh=600" },
  { _id:"s5", name:"Fastrack Astor FR2 Pro Smart Watch with 3.63 cm AMOLED Display, AI Voice Assistant", category:"Unisex Watches", price:2799, oldPrice:5499, discount:49, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dw8178fcf1/images/Fastrack/Catalog/38156NM01_1.jpg?sw=600&sh=600" },
  { _id:"s6", name:"Fastrack MYND - 4.9 cm AMOLED Display, AI Watchface, BT Calling IP68 Smartwatch", category:"Unisex Watch", price:3599, oldPrice:5499, discount:35, thumb:"https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Sites-titan-master-catalog/default/dwd1ba24e6/images/Fastrack/Catalog/38184PP01K_1.jpg?sw=600&sh=600" },
];

export default function Trending() {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const { products: dbProducts, loading } = useProducts("trending");
  const { addToCart } = useCart();
  const { isLoggedIn } = useAuth();

  const list = dbProducts.length > 0 ? dbProducts : STATIC;
  const scroll = (dir) => scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <div className="w-full py-8 max-w-screen-xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-black text-gray-900 tracking-widest">TRENDING</h2>
        {loading && <span className="text-xs text-gray-400 animate-pulse">Loading...</span>}
      </div>

      <div className="relative">
        <button onClick={() => scroll(-1)}
          className="absolute -left-11 top-1/2 -translate-y-1/2 z-10 bg-white border shadow w-9 h-9 flex items-center justify-center hover:bg-orange-50 transition-colors text-lg">
          ‹
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {list.map((p) => (
            <div
              key={p._id}
              onClick={() => {
                // Static fallback products (_id starts with "s") — detail page nathi khulti
                if (String(p._id).startsWith("s")) return;
                navigate(`/product/${p._id}`);
              }}
              className={`flex-shrink-0 border rounded-lg overflow-hidden group transition-all ${
                !String(p._id).startsWith("s") ? "cursor-pointer hover:shadow-lg" : ""
              }`}
              style={{ width: 300 }}
            >
              <div className="relative h-[320px] overflow-hidden bg-gray-50">
                <img
                  src={p.thumb || p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={e => { e.target.src = "https://placehold.co/300x320?text=Watch"; }}
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{p.badge}</span>
                )}
                {/* Hover overlay — DB products only */}
                {!String(p._id).startsWith("s") && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-all bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-full shadow-lg">
                      View Details
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-orange-500 transition-colors">{p.name}</p>
                <p className="text-xs text-gray-400 mt-1">{p.category}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-bold">₹ {p.price?.toLocaleString()}</span>
                  {p.oldPrice && <span className="text-xs line-through text-gray-400">₹ {p.oldPrice?.toLocaleString()}</span>}
                  {p.discount && <span className="text-xs font-bold text-orange-500">{p.discount}% off</span>}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(
                      { id: p._id, name: p.name, price: p.price, oldPrice: p.oldPrice, discount: p.discount, thumb: p.thumb || p.image },
                      p.colors?.[0]?.name || "Default", 1, isLoggedIn, () => navigate("/login")
                    );
                  }}
                  className="mt-3 w-full bg-gray-900 hover:bg-orange-500 text-white text-xs font-bold py-2 rounded transition-colors"
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => scroll(1)}
          className="absolute -right-11 top-1/2 -translate-y-1/2 z-10 bg-white border shadow w-9 h-9 flex items-center justify-center hover:bg-orange-50 transition-colors text-lg">
          ›
        </button>
      </div>
    </div>
  );
}