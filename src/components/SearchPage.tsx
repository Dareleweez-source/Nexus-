import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Search, ShoppingBag, User, Image as ImageIcon, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProfileSuggestions from './ProfileSuggestions';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const posts = useStore((state) => state.posts);
  const stores = useStore((state) => state.stores);
  const products = useStore((state) => state.products);

  const results = useMemo(() => {
    if (!query.trim()) return { posts: [], stores: [], products: [] };
    const q = query.toLowerCase();

    return {
      posts: posts.filter(p => p.caption.toLowerCase().includes(q) || p.authorUid.toLowerCase().includes(q)),
      stores: stores.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)),
      products: products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    };
  }, [query, posts, stores, products]);

  const hasResults = results.posts.length > 0 || results.stores.length > 0 || results.products.length > 0;

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight mb-6">Search</h2>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for posts, stores, or products..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all shadow-sm text-lg"
            value={query}
            autoFocus
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {!query.trim() ? (
        <div className="space-y-12">
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium text-lg">Type something to start searching Nexus</p>
          </div>
          <ProfileSuggestions />
        </div>
      ) : !hasResults ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No results found for "{query}"</p>
          <p className="text-gray-400 text-sm mt-2">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Stores Section */}
          {results.stores.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                Stores ({results.stores.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {results.stores.map(store => (
                  <Link 
                    key={store.id} 
                    to={`/shop/${store.id}`}
                    className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all group"
                  >
                    <img src={store.logoUrl} alt={store.name} className="w-12 h-12 rounded-xl object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold group-hover:text-indigo-600 transition-colors">{store.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-1">{store.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products Section */}
          {results.products.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Products ({results.products.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.products.map(product => (
                  <Link 
                    key={product.id} 
                    to={`/shop/${product.storeId}`}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
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

          {/* Posts Section */}
          {results.posts.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                Posts ({results.posts.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {results.posts.map(post => (
                  <Link 
                    key={post.id} 
                    to={`/profile/${post.authorUid}`}
                    className="aspect-square relative group overflow-hidden rounded-lg"
                  >
                    <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                      <p className="text-white text-xs font-medium line-clamp-2 text-center">{post.caption}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
