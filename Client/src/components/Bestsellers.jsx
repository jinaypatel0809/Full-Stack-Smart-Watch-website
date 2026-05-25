import { useRef } from "react";

const bestsellers = [
  {
    id: 1,
    name: "Vyb Striker By Fastrack Quartz Analog Rose Gold Dial Rose Go...",
    category: "Girls Watches",
    price: 1995,
    oldPrice: 2850,
    discount: 30,
    rating: null,
    reviews: null,
    bg: "#d4a96a",
    emoji: "💛",
  },
  {
    id: 2,
    name: "Fastrack Revoltt XR1 3.50 Cm, BT Calling, Fast Charge, 100+...",
    category: "Unisex Watches",
    price: 1500,
    oldPrice: 3995,
    discount: 62,
    rating: 4.1,
    reviews: 21,
    bg: "#0a0a0a",
    emoji: "📱",
  },
  {
    id: 3,
    name: "Fastrack Fastfit Quartz Analog Grey Dial Grey Colour Silicon...",
    category: "Unisex Watches",
    price: 895,
    oldPrice: 995,
    discount: 10,
    rating: null,
    reviews: null,
    bg: "#c8c8c8",
    emoji: "⌚",
  },
  {
    id: 4,
    name: "Fastrack Astor FR2 Pro Smart Watch With 3.63 Cm AMOLED Displ...",
    category: "Unisex Watches",
    price: 2799,
    oldPrice: 5499,
    discount: 49,
    rating: 4.6,
    reviews: 52,
    bg: "#1a1a1a",
    emoji: "🕐",
  },
  {
    id: 5,
    name: "Fastrack UFO Quartz Multifunction Green Dial Silver Stainles...",
    category: "Guys Watches",
    price: 5995,
    oldPrice: null,
    discount: null,
    rating: null,
    reviews: null,
    bg: "#e0e8e0",
    emoji: "🛸",
  },
  {
    id: 6,
    name: "Fastrack Vyb Nimbus Quartz Analog Black Dial Two Toned Color...",
    category: "Guys Watches",
    price: 2195,
    oldPrice: 3135,
    discount: 30,
    rating: null,
    reviews: null,
    bg: "#1e1e3a",
    emoji: "🕰️",
  },
];

export default function Bestsellers() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });
  };

  return (
    <div className="w-full py-8 max-w-screen-xl mx-auto px-4">
      <h2 className="text-xl font-black text-gray-900 tracking-widest mb-6">BESTSELLERS</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {bestsellers.map((p) => (
            <div
              key={p.id}
              className="flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
              style={{ width: 260 }}
            >
              {/* Image area */}
              <div
                className="relative flex items-center justify-center"
                style={{ height: 220, background: p.bg }}
              >
                <span style={{ fontSize: 90 }}>{p.emoji}</span>
                {/* Rating badge */}
                {p.rating && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white bg-opacity-90 rounded px-2 py-0.5">
                    <svg width="10" height="10" fill="#F47A20" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xs font-bold text-gray-700">{p.rating} ({p.reviews})</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors">
                  {p.name}
                </p>
                <p className="text-xs text-gray-400 mt-1">{p.category}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-sm font-bold text-gray-900">₹ {p.price.toLocaleString()}</span>
                  {p.oldPrice && (
                    <>
                      <span className="text-xs text-gray-400 line-through">₹ {p.oldPrice.toLocaleString()}</span>
                      <span className="text-xs font-bold text-orange-500">{p.discount}% off</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 shadow w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}