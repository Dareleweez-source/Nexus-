import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ShoppingBag, ArrowLeft, Plus, Image as ImageIcon } from 'lucide-react';

export default function CreateStore() {
  const navigate = useNavigate();
  const addStore = useStore((state) => state.addStore);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newStore = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      ownerUid: 'current_user', // Mock user for now
    };
    addStore(newStore);
    navigate('/shop');
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72 transition-colors duration-300">
      <Link to="/shop" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-indigo-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Create Your Store</h2>
            <p className="text-gray-500">Start selling your products to the community.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Store Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Vintage Vibes"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
            <textarea 
              required
              rows={4}
              placeholder="Tell people what your store is about..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Logo URL</label>
            <div className="flex gap-4">
              <div className="flex-1">
                <input 
                  type="url" 
                  required
                  placeholder="https://example.com/logo.png"
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                />
              </div>
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-300" />
                )}
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all hover:scale-[1.02] shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Launch Store
          </button>
        </form>
      </div>
    </div>
  );
}
