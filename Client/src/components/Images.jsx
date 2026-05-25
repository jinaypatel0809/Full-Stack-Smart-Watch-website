const posts = [
  {
    id: 1,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/4/17941828049781204/medium.jpg",
  },
  {
    id: 2,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/21/18064711405622221/low_resolution.jpg",
  },
  {
    id: 3,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/69/18046442920760469/low_resolution.jpg",
  },
  {
    id: 4,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/35/18063260977720835/low_resolution.jpg",
  },
  {
    id: 5,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/38/18051316648798938/low_resolution.jpg",
  },
  {
    id: 6,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/15/17983745165709515/low_resolution.jpg",
  },
  {
    id: 7,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/33/18060671347641033/medium.jpg",
  },
  {
    id: 8,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/46/17844463278284446/low_resolution.jpg",
  },
  {
    id: 9,
    image: "https://cdn-yotpo-images-production.yotpo.com/instagram/95/17976175100613395/low_resolution.jpg",
  },
];

export default function Images() {
  return (
    <div className="w-full py-8 max-w-screen-xl mx-auto px-4">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold tracking-widest text-gray-500">
          FOLLOW US
        </p>

        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-orange-500 transition-colors"
        >
          {/* Instagram icon */}
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
          </svg>
          @fastrack
        </a>
      </div>

      {/* Grid */}
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "auto auto auto",
        }}
      >
        {/* Large Left */}
        <div className="row-span-2 rounded-xl overflow-hidden relative group">
          <img
            src={posts[0].image}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

          {/* Label */}
          <div className="absolute bottom-3 left-3">
            <p className="text-white text-xs font-bold tracking-widest">
              {posts[0].label}
            </p>
          </div>
        </div>

        {/* Top Right */}
        {posts.slice(1, 3).map((p) => (
          <div key={p.id} className="rounded-xl overflow-hidden relative group">
            <img
              src={p.image}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
          </div>
        ))}

        {/* Bottom 3 */}
        <div
          className="col-start-2 col-span-2 grid gap-2"
          style={{ gridTemplateColumns: "1fr 1fr 1fr" }}
        >
          {posts.slice(3).map((p) => (
            <div key={p.id} className="rounded-xl overflow-hidden relative group">
              <img
                src={p.image}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}