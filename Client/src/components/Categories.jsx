import { useRef } from "react";

const categories = [
  {
    label: "ANALOG WATCHES",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw56e193a5/images/homepage/desktop/FT_Analog_Watches_d.jpg",
  },
  {
    label: "SMART WATCHES",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw52772a07/images/homepage/desktop/FT_smart_card_d.jpg",
  },
  {
    label: "BAGS",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwe782a562/images/homepage/desktop/FT_categories_bag_Aug_d.jpg",
  },
  {
    label: "PERFUMES",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw030d50f5/images/homepage/desktop/FT_homepage_perfumes_d.png",
  },
  {
    label: "ACCESSORIES",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638",
  },
  {
    label: "SUNGLASSES",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
  },
];

export default function Categories() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div className="w-full py-10 px-4 max-w-screen-xl mx-auto">
      <div className="flex items-stretch gap-4">

        {/* Scroll Area */}
        <div className="relative flex-1 overflow-hidden">

          {/* Left Arrow */}
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow w-8 h-8 flex items-center justify-center"
          >
            ‹
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto px-10"
            style={{ scrollbarWidth: "none" }}
          >
            {categories.map((cat) => (
              <div
                key={cat.label}
                className="relative flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer"
                style={{ width: 220, height: 400 }}
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
                  <p className="text-white text-sm font-bold tracking-widest">
                    {cat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border shadow w-8 h-8 flex items-center justify-center"
          >
            ›
          </button>
        </div>

        {/* Vertical Text */}
        <div className="hidden md:flex items-center">
          <p
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "28px",
              fontWeight: "900",
              letterSpacing: "0.1em",
            }}
          >
            FASTRACK CATEGORIES
          </p>
        </div>
      </div>
    </div>
  );
}