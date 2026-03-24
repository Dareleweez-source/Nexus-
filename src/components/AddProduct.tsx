import { FormEvent, useState, ChangeEvent } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Tag, ArrowLeft, Plus, Image as ImageIcon, DollarSign } from 'lucide-react';

export default function AddProduct() {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const addProduct = useStore((state) => state.addProduct);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) return;

    setIsUploading(true);
    // Simulate upload
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newProduct = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      storeId: storeId!,
      ratings: [],
    };
    addProduct(newProduct);
    setIsUploading(false);
    navigate(`/shop/${storeId}`);
  };

  return (
    <div className="max-w-2xl mx-auto pt-24 pb-20 px-4 sm:pt-24 sm:pl-72 transition-colors duration-300">
      <Link to={`/shop/${storeId}`} className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Store
      </Link>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-2xl shadow-indigo-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 rounded-2xl">
            <Tag className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Add New Product</h2>
            <p className="text-gray-500">List a new item in your store.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g., Cool T-Shirt"
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Price ($)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Product Image</label>
              <div className="flex gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all font-medium text-gray-500 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    {formData.imageUrl ? 'Change Image' : 'Upload Image'}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                  {formData.imageUrl ? (
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-300" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Description</label>
            <textarea 
              required
              rows={4}
              placeholder="Describe your product..."
              className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all font-medium resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            disabled={isUploading || !formData.imageUrl}
            className={`w-full py-4 text-white font-black rounded-2xl transition-all hover:scale-[1.02] shadow-xl flex items-center justify-center gap-2 ${
              isUploading || !formData.imageUrl 
                ? 'bg-gray-300 shadow-none cursor-not-allowed text-gray-400' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Plus className="w-6 h-6" />
                Add Product to Store
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
