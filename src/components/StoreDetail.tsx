import { useParams, Link } from 'react-router-dom';
import { useStore, Product } from '../store/useStore';
import { ShoppingBag, Plus, ArrowLeft, Tag, Star, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

function StarRating({ product }: { product: Product }) {
  const addRating = useStore((state) => state.addRating);
  const [hovered, setHovered] = useState<number | null>(null);

  const averageRating = useMemo(() => {
    if (!product.ratings || product.ratings.length === 0) return 0;
    return product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length;
  }, [product.ratings]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => addRating(product.id, star)}
            className="transition-transform hover:scale-125 focus:outline-none"
          >
            <Star
              className={`w-4 h-4 ${
                (hovered !== null ? star <= hovered : star <= Math.round(averageRating))
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="text-xs font-bold text-gray-400 ml-1">
          {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'}
        </span>
      </div>
      {product.ratings && product.ratings.length > 0 && (
        <span className="text-[10px] text-gray-400 uppercase tracking-tighter">
          {product.ratings.length} {product.ratings.length === 1 ? 'rating' : 'ratings'}
        </span>
      )}
    </div>
  );
}

export default function StoreDetail() {
  const { storeId } = useParams<{ storeId: string }>();
  
  const stores = useStore((state) => state.stores);
  const allProducts = useStore((state) => state.products);

  const store = useMemo(() => stores.find((s) => s.id === storeId), [stores, storeId]);
  const [searchQuery, setSearchQuery] = useState('');

  const products = useMemo(() => {
    const storeProducts = allProducts.filter((p) => p.storeId === storeId);
    if (!searchQuery.trim()) return storeProducts;
    const query = searchQuery.toLowerCase();
    return storeProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [allProducts, storeId, searchQuery]);

  if (!store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-24 sm:pt-24 sm:pl-72">
        <ShoppingBag className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h2>
        <p className="text-gray-500 mb-6">The store you are looking for does not exist.</p>
        <Link to="/shop" className="text-indigo-600 font-semibold hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72 transition-colors duration-300">
      <div className="mb-8">
        <Link to="/shop" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={store.logoUrl} 
                alt={store.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-gray-900">{store.name}</h2>
              <p className="text-gray-600 max-w-lg">{store.description}</p>
              <div className="mt-2 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Owned by @{store.ownerUid}
              </div>
            </div>
          </div>
          <Link 
            to={`/shop/${storeId}/add-product`} 
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg shadow-indigo-200"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search in this store..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500"
          >
            <div className="aspect-square relative overflow-hidden">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg">
                <span className="text-lg font-black text-indigo-600">${product.price}</span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                </div>
                <StarRating product={product} />
              </div>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
              <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
          <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">
            {searchQuery.trim() ? `No products matching "${searchQuery}"` : 'No products in this store yet.'}
          </p>
        </div>
      )}
    </div>
  );
}
