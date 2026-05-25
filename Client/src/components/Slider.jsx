import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwd6dcbcbb/images/homepage/desktop/ft_aprl_sale_hero_d.jpg",
  },
  {
    id: 2,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw67f30fac/images/homepage/desktop/ft_wild_hero_banner_updated_d.jpg",
  },
  {
    id: 3,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwcb78bbd2/images/homepage/desktop/FT_groove_hero_banner_d.jpg",
  },
  {
    id: 4,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwee08318a/images/homepage/desktop/FT_override_hero_d.jpg"
  },
  {
    id: 5,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw5e2492bc/images/homepage/desktop/FT_UFO_hero_d.jpg"
  },
  {
    id: 6,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw5e46a121/images/homepage/desktop/FT_Oceanyx_updated_D.jpeg"
  },
  {
    id: 7,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwf8a1d7b1/images/homepage/desktop/FT_Bestsellers_D.jpg"
  },
  {
    id: 8,
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwc1562bd6/images/homepage/desktop/Vyb_men_feb_d.jpg"
  },
];

export default function Slider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () =>
    setCurrent((c) => (c + 1) % slides.length);

  return (
    <div className="relative w-full overflow-hidden h-[380px]">

      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={slide.image}
            alt="banner"
            className="w-full h-full object-cover"
          />

          {/* Optional overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center"
      >
        ‹
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white w-10 h-10 flex items-center justify-center"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full ${
              i === current
                ? "w-6 h-1.5 bg-white"
                : "w-2 h-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}