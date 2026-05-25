import { useProducts } from "../hooks/useProducts";
import ProductGrid from "../components/ProductGrid";

export default function Sale() {
  const { products, loading, error } = useProducts("sale");
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-widest flex items-center gap-2">
            <span className="bg-orange-500 text-white text-sm font-black px-3 py-1 rounded-full">SALE</span>
            Best Deals
          </h1>
          <p className="text-gray-400 text-sm mt-1">Limited time offers — grab them before they're gone!</p>
        </div>
      </div>
      <ProductGrid products={products} loading={loading} error={error} emptyMsg="No sale products right now. Check back soon!" />
    </div>
  );
}