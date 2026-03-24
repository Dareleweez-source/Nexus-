import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, Plus, Search, Tag } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function Shop() {
  const stores = useStore((state) => state.stores);
  const products = useStore((state) => state.products);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const filteredStores = useMemo(() => {
    if (!searchQuery.trim()) return stores;
    const query = searchQuery.toLowerCase();
    return stores.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query)
    );
  }, [stores, searchQuery]);

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72 transition-colors duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">Marketplace</h2>
        <div className="flex items-center gap-4 flex-1 md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or stores..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link 
            to="/shop/create" 
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors whitespace-nowrap shadow-lg shadow-indigo-100"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Store</span>
          </Link>
        </div>
      </div>

      {searchQuery.trim() && filteredProducts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-500" />
            Matching Products
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/shop/${product.storeId}`}
                className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="aspect-square relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg shadow-sm">
                    <span className="text-sm font-bold text-indigo-600">${product.price}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                  <p className="text-gray-500 text-xs line-clamp-1">{product.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          {searchQuery.trim() ? 'Matching Stores' : 'Featured Stores'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStores.map((store) => (
            <Link 
              key={store.id} 
              to={`/shop/${store.id}`}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={store.logoUrl} 
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold">{store.name}</h3>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{store.description}</p>
                <div className="mt-4 flex items-center text-xs text-gray-400 font-medium uppercase tracking-wider">
                  Owned by @{store.ownerUid}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {filteredStores.length === 0 && filteredProducts.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
