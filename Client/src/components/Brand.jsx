import { useState } from "react";

const products = [
  {
    id: 1,
    name: "Fastrack Overdrive Micromotor",
    desc: "Built for speed. Designed to stand out.",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw0024b2f3/images/homepage/desktop/ft_Overdrive_Collections_focus_1.jpg",
  },
  {
    id: 2,
    name: "Fastrack Overdrive Micromotor",
    desc: "Built for speed. Designed to stand out.",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw462ffa65/images/homepage/desktop/ft_Overdrive_Collections_focus_2.jpg",
  },
  {
    id: 3,
    name: "Fastrack Overdrive Micromotor",
    desc: "Built for speed. Designed to stand out.",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw8bcde463/images/homepage/desktop/ft_Overdrive_Collections_focus_3.jpg",
  },
  {
    id: 4,
    name: "Fastrack Overdrive Tachymeter",
    desc: "Built for speed. Designed to stand out.",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw3ee69525/images/homepage/desktop/ft_Overdrive_Collections_focus_4.jpg",
  },
  {
    id: 5,
    name: "Fastrack Overdrive Tachymeter",
    desc: "Built for speed. Designed to stand out.",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw9bba8e53/images/homepage/desktop/ft_Overdrive_Collections_focus_5.jpg",
  },
];

export default function Brand() {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c - 1 + products.length) % products.length);
  const next = () =>
    setCurrent((c) => (c + 1) % products.length);

  const p = products[current];

  return (
    <div className="w-full py-10 max-w-screen-xl mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

        {/* LEFT SIDE */}
        <div className="relative flex flex-col items-center justify-center min-h-[420px] bg-gray-50 rounded-xl">

          {/* Left Arrow */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border shadow w-10 h-10 flex items-center justify-center z-10"
          >
            ‹
          </button>

          {/* Product Image */}
          <div className="flex flex-col items-center text-center px-10">
            <img
              src={p.image}
              alt={p.name}
              className="w-[480px] h-[480px] object-contain mb-6"
            />

            <p className="text-lg font-semibold text-gray-900">
              {p.name}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {p.desc}
            </p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border shadow w-10 h-10 flex items-center justify-center z-10"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex gap-2 mt-6">
            {products.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full ${
                  i === current
                    ? "w-6 h-1.5 bg-gray-800"
                    : "w-2 h-2 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE (BANNER IMAGE) */}
        <div className="relative rounded-xl overflow-hidden min-h-[420px]">
          <img
            src="https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwd173b2f0/images/homepage/desktop/ft_Overdrive_Collections_focus_d.jpg"
            alt="fastrack banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}