import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import { Plus, Edit2, Trash2, X, Star, Tag, Info, Layers, Image as ImageIcon, Palette } from 'lucide-react';
import FileUpload from '../components/FileUpload';

import DashboardHome from '../components/admin/DashboardHome';
import OrderList from '../components/admin/OrderList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const initialFormData = {
    name: '',
    price: '',
    oldPrice: '',
    description: '',
    image: '',
    thumbnails: [],
    category: '',
    style: 'Casual',
    isNewArrival: false,
    isTopSeller: false,
    productType: 'regular',
    pointsPrice: 0,
    discount: 0,
    baseColor: '',
    colors: '',
    sizes: '',
    variants: []
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Clean up data
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        discount: Number(formData.discount),
        pointsPrice: Number(formData.pointsPrice),
        baseColor: formData.baseColor,
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : formData.sizes,
        colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(s => s.trim()).filter(Boolean) : formData.colors,
        variants: formData.variants.map(v => ({
           ...v,
           sizes: typeof v.sizes === 'string' ? v.sizes.split(',').map(s => s.trim()).filter(Boolean) : v.sizes
        }))
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, dataToSubmit);
      } else {
        await createProduct(dataToSubmit);
      }
      fetchProducts();
      closeModal();
    } catch (err) {
      alert('Operation failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ...initialFormData,
      ...product,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || '',
      discount: product.discount?.toString() || '0',
      pointsPrice: product.pointsPrice?.toString() || '0',
      baseColor: product.baseColor || '',
      colors: product.colors?.join(', ') || '',
      sizes: product.sizes?.join(', ') || '',
      variants: product.variants?.map(v => ({...v, sizes: v.sizes?.join(', ') || ''})) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        alert('Delete failed');
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData(initialFormData);
  };

  // Removed handleArrayInput since we treat them as strings until submit

  // Variant Helpers
  const addVariant = () => {
    setFormData({
      ...formData,
      variants: [...formData.variants, { color: '', images: [], price: '', oldPrice: '', sizes: '' }]
    });
  };

  const removeVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData({ ...formData, variants: newVariants });
  };

  const addVariantImage = (variantIndex, url) => {
    const newVariants = [...formData.variants];
    const currentImages = newVariants[variantIndex].images || [];
    newVariants[variantIndex].images = [...currentImages, url];
    setFormData({ ...formData, variants: newVariants });
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const newVariants = [...formData.variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    setFormData({ ...formData, variants: newVariants });
  };

  // Thumbnail Helpers
  const addThumbnail = (url) => {
    setFormData({ ...formData, thumbnails: [...formData.thumbnails, url] });
  };

  const removeThumbnail = (index) => {
    const newThumbs = [...formData.thumbnails];
    newThumbs.splice(index, 1);
    setFormData({ ...formData, thumbnails: newThumbs });
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Star size={18} /> },
    { id: 'products', label: 'Products', icon: <Layers size={18} /> },
    { id: 'orders', label: 'Orders', icon: <ImageIcon size={18} /> },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10 font-satoshi min-h-screen bg-gray-50/30">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-integral font-extrabold text-[32px] md:text-5xl text-black uppercase tracking-tight">
            Admin Console
          </h1>
          <p className="text-black/60 mt-2">Manage your inventory, variants, and multi-image galleries.</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-10 border-b border-black/5 pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-8 py-4 rounded-t-3xl font-bold uppercase tracking-widest text-xs transition-all ${
              activeTab === tab.id 
              ? 'bg-black text-white shadow-lg' 
              : 'text-black/40 hover:text-black hover:bg-gray-100'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dashboard' && <DashboardHome />}
      {activeTab === 'orders' && <OrderList />}

      {activeTab === 'products' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex justify-between items-center mb-10">
            <h2 className="font-integral font-extrabold text-2xl uppercase">Inventory</h2>
            <button 
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black/80 transition-all active:scale-95 shadow-lg"
            >
              <Plus size={20} /> Add New Product
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-[20px] overflow-hidden border border-black/5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => handleDelete(product._id)} className="p-2.5 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-xl mb-2 truncate">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-extrabold">${product.price}</span>
                      {product.oldPrice && <span className="text-black/30 line-through text-lg font-bold">${product.oldPrice}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-black/40 text-xs font-bold uppercase">
                       <Palette size={14} /> <span>{product.variants?.length || 0} Variants</span>
                       <span className="mx-2">•</span>
                       <ImageIcon size={14} /> <span>{product.thumbnails?.length || 0} More Images</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-4xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-white shrink-0">
              <h2 className="font-integral font-extrabold text-2xl uppercase">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="px-8 py-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <h3 className="md:col-span-2 font-integral text-lg uppercase mb-2">Base Information</h3>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Product Name</label>
                        <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" placeholder="Product Name" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> Base Price ($)</label>
                        <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" placeholder="0.00" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> Base Old Price ($)</label>
                        <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" placeholder="0.00" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Tag size={14}/> Discount (%)</label>
                        <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium" placeholder="0 for none" min="0" max="100"/>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Layers size={14}/> Category</label>
                        <select name="category" required value={formData.category} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium">
                            <option value="">Select Category</option>
                            <option value="T-Shirt">T-Shirt</option>
                            <option value="Shorts">Shorts</option>
                            <option value="Shirt">Shirt</option>
                            <option value="Hoodie">Hoodie</option>
                            <option value="Jeans">Jeans</option>
                            <option value="Apparel">Apparel</option>
                            <option value="Accessories">Accessories</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><Palette size={14}/> Dress Style</label>
                        <select name="style" value={formData.style} onChange={handleInputChange} className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium">
                            <option value="Casual">Casual</option>
                            <option value="Formal">Formal</option>
                            <option value="Party">Party</option>
                            <option value="Gym">Gym</option>
                        </select>
                    </div>
                </div>

                {/* Images & Gallery */}
                <div className="md:col-span-2 grid grid-cols-1 gap-6 p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <h3 className="font-integral text-lg uppercase mb-2">Images & Gallery</h3>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Main Cover Image</label>
                      <FileUpload currentImage={formData.image} onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-4">
                      <label className="text-xs font-bold text-black/40 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Additional Gallery Images ({formData.thumbnails?.length})</label>
                      <FileUpload currentImage="" onUploadSuccess={addThumbnail} />
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-3">
                        {formData.thumbnails?.map((thumb, idx) => (
                           <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-black/10 bg-white">
                              <img src={thumb} alt={formData.name + ' thumbnail'} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => removeThumbnail(idx)} className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Trash2 size={16} />
                              </button>
                           </div>
                        ))}
                      </div>
                    </div>
                </div>

                {/* Variants Management */}
                <div className="md:col-span-2 p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-integral text-lg uppercase">Color Variants</h3>
                        <button type="button" onClick={addVariant} className="bg-black text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-black/80">
                            <Plus size={14} /> Add Variant
                        </button>
                    </div>

                    <div className="space-y-6">
                        {formData.variants?.map((variant, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-sm uppercase tracking-widest bg-black text-white px-3 py-1 rounded-lg">Variant #{idx + 1}</span>
                                    <button type="button" onClick={() => removeVariant(idx)} className="text-red-500 hover:text-red-700 transition-colors"><X size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase text-black/40">Color Name/Hex</label>
                                        <input type="text" value={variant.color} onChange={(e) => updateVariant(idx, 'color', e.target.value)} className="bg-gray-50 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none" placeholder="e.g. Red / #FF0000" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase text-black/40">Variant Price ($)</label>
                                        <input type="number" value={variant.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} className="bg-gray-50 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none" placeholder="Override price" />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] font-black uppercase text-black/40">Variant Old Price ($)</label>
                                        <input type="number" value={variant.oldPrice} onChange={(e) => updateVariant(idx, 'oldPrice', e.target.value)} className="bg-gray-50 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none" placeholder="Override previous price" />
                                    </div>
                                    <div className="md:col-span-2 lg:col-span-2">
                                        <div className="flex items-center gap-2 mb-2">
                                          <label className="text-[10px] font-black uppercase text-black/40">Variant Images ({variant.images?.length || 0})</label>
                                        </div>
                                        <div className="space-y-3">
                                            <FileUpload currentImage="" onUploadSuccess={(url) => addVariantImage(idx, url)} />
                                            {variant.images?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {variant.images.map((imgUrl, imgIdx) => (
                                                        <div key={imgIdx} className="relative w-12 h-12 rounded-lg overflow-hidden group border border-black/10">
                                                            <img src={imgUrl} className="w-full h-full object-cover" alt="Variant" />
                                                            <button 
                                                              type="button" 
                                                              onClick={() => removeVariantImage(idx, imgIdx)} 
                                                              className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                                            >
                                                              <Trash2 size={12} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 lg:col-span-1">
                                        <label className="text-[10px] font-black uppercase text-black/40">Available Sizes (comma sep)</label>
                                        <input type="text" value={variant.sizes} onChange={(e) => updateVariant(idx, 'sizes', e.target.value)} className="bg-gray-50 rounded-lg px-3 py-3 text-sm focus:ring-2 focus:ring-black/5 outline-none" placeholder="S, M, L, XL" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {formData.variants?.length === 0 && (
                            <p className="text-center py-6 text-black/40 font-medium italic text-sm">No specific color variants added. Base information will be used.</p>
                        )}
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-3xl border border-black/5">
                    <h3 className="md:col-span-2 font-integral text-lg uppercase mb-2">Details & Classification</h3>
                    
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest text-[#FF3333]">Original Product Color (Base Images Color)</label>
                        <input type="text" name="baseColor" value={formData.baseColor} onChange={handleInputChange} className="bg-white border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm border-l-4 border-l-[#FF3333]" placeholder="e.g. Red, #FF0000" />
                        <p className="text-[10px] text-black/40">This maps the Main Gallery images above strictly to this specific color.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Product Type</label>
                        <select name="productType" value={formData.productType} onChange={handleInputChange} className="bg-white border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm">
                            <option value="regular">Regular Product</option>
                            <option value="loyalty-only">Loyalty Rewards Only</option>
                            <option value="hybrid">Hybrid (Cash + Points)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Pricing in Points (if applicable)</label>
                        <input type="number" name="pointsPrice" value={formData.pointsPrice} onChange={handleInputChange} className="bg-white border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm" placeholder="e.g. 500 points" />
                    </div>

                    <div className="md:col-span-2 flex items-center gap-8 py-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleInputChange} className="sr-only" />
                                <div className={`w-10 h-6 rounded-full transition-colors ${formData.isNewArrival ? 'bg-black' : 'bg-gray-200'}`}></div>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isNewArrival ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-xs font-bold text-black/60 uppercase tracking-widest group-hover:text-black transition-colors">Mark as New Arrival</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" name="isTopSeller" checked={formData.isTopSeller} onChange={handleInputChange} className="sr-only" />
                                <div className={`w-10 h-6 rounded-full transition-colors ${formData.isTopSeller ? 'bg-black' : 'bg-gray-200'}`}></div>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.isTopSeller ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                            <span className="text-xs font-bold text-black/60 uppercase tracking-widest group-hover:text-black transition-colors">Mark as Top Seller</span>
                        </label>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Base Sizes (Default)</label>
                        <input type="text" name="sizes" value={formData.sizes} onChange={handleInputChange} className="bg-white border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm" placeholder="S, M, L, XL" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Base Colors (Default Variants)</label>
                        <input type="text" name="colors" value={formData.colors} onChange={handleInputChange} className="bg-white border-none rounded-xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium text-sm" placeholder="Blue, Green (leave empty if using Variant tool)" />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-xs font-bold text-black/40 uppercase tracking-widest">Description</label>
                        <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="3" className="bg-white border-none rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-black/10 transition-all font-medium resize-none" placeholder="Product details..." />
                    </div>
                </div>
              </div>

              <div className="mt-10 mb-4 px-2">
                <button type="submit" className="w-full bg-black text-white py-5 rounded-2xl font-bold text-lg uppercase tracking-widest hover:bg-black/90 transition-all active:scale-95 shadow-xl shadow-black/20">
                  {editingProduct ? 'Update Product & Variants' : 'Create Product with Variants'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
