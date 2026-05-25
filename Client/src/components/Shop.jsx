const vibes = [
  {
    label: "ELEVATED CASUAL",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw6ffe04e0/images/homepage/desktop/Home_EC_d.jpg",
  },
  {
    label: "PARTY",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dw51600557/images/homepage/desktop/Home_Party_d.jpg",
  },
  {
    label: "STREET",
    image: "https://www.fastrack.in/dw/image/v2/BKDD_PRD/on/demandware.static/-/Library-Sites-FastrackSharedLibrary/default/dwda196e22/images/homepage/desktop/Home_Street_d.jpg",
  },
];

export default function Shop() {
  return (
    <div className="w-full py-8 max-w-screen-xl mx-auto px-4">
      <h2 className="text-xl font-black text-gray-900 tracking-widest mb-6">
        SHOP YOUR VIBE
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vibes.map((v) => (
          <div
            key={v.label}
            className="relative rounded-2xl overflow-hidden cursor-pointer group"
            style={{ height: "clamp(280px, 35vw, 440px)" }}
          >
            {/* Image */}
            <img
              src={v.image}
              alt={v.label}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Label */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-4">
              <p className="text-white text-sm font-black tracking-widest">
                {v.label}
              </p>
            </div>

            {/* Hover border */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-400 rounded-2xl transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}