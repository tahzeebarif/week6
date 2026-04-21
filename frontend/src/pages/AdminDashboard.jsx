import React, { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/productApi';
import { Plus, Edit2, Trash2, X, Star, Tag, Info, Layers, Image as ImageIcon, Palette, LayoutGrid, Search, Filter, MoreVertical, ExternalLink, Key, ShieldCheck, Users } from 'lucide-react';
import FileUpload from '../components/FileUpload';

import DashboardHome from '../components/admin/DashboardHome';
import OrderList from '../components/admin/OrderList';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
      setLoading(true);
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

  const addThumbnail = (url) => {
    setFormData({ ...formData, thumbnails: [...formData.thumbnails, url] });
  };

  const removeThumbnail = (index) => {
    const newThumbs = [...formData.thumbnails];
    newThumbs.splice(index, 1);
    setFormData({ ...formData, thumbnails: newThumbs });
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Admin Dashboard';
      case 'products': return 'Product Management';
      case 'orders': return 'Order Fulfillment';
      case 'customers': return 'Customer Database';
      case 'settings': return 'System Settings';
      default: return 'Admin Console';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-satoshi overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} ml-0`}>
        <AdminHeader title={getPageTitle()} onMenuToggle={() => setSidebarOpen(true)} />

        <main className="p-4 md:p-8 pb-20">
          {activeTab === 'dashboard' && <DashboardHome />}
          {activeTab === 'orders' && <OrderList />}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <h3 className="font-integral font-black text-xl uppercase tracking-tight text-black mb-1">Store Profile</h3>
                        <p className="text-[11px] text-black/30 font-bold uppercase tracking-widest leading-relaxed">Public identity & contact info.</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-black/5 shadow-sm space-y-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] px-1">Shop Name</label>
                            <input type="text" defaultValue="SHOP.CO OFFICIAL" className="bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black/5 transition-all font-black text-black" />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] px-1">Support Email</label>
                                <input type="email" defaultValue="care@shop.co" className="bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-black" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] px-1">Contact Phone</label>
                                <input type="text" defaultValue="+1 (555) 123-4567" className="bg-gray-50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-black/5 transition-all font-bold text-black" />
                            </div>
                        </div>
                        <button className="bg-black text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-black/10 hover:scale-[1.02] active:scale-95 transition-all">Save Profile Changes</button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-1">
                        <h3 className="font-integral font-black text-xl uppercase tracking-tight text-black mb-1">Security & API</h3>
                        <p className="text-[11px] text-black/30 font-bold uppercase tracking-widest leading-relaxed">Access keys & auth settings.</p>
                    </div>
                    <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-6">
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Key size={24} className="text-black" /></div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest text-black">OAuth Configuration</p>
                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-0.5">Google & Github Keys</p>
                                </div>
                            </div>
                            <button className="text-[10px] font-black text-black/40 uppercase tracking-widest hover:text-black transition-colors">Manage</button>
                        </div>
                        <div className="flex items-center justify-between p-6 bg-gray-50 rounded-[32px] border border-black/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm"><ShieldCheck size={24} className="text-emerald-500" /></div>
                                <div>
                                    <p className="font-black text-xs uppercase tracking-widest text-black">Payment Gateway</p>
                                    <p className="text-[10px] font-bold text-black/30 uppercase tracking-widest mt-0.5">Stripe Integration Active</p>
                                </div>
                            </div>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="flex flex-col items-center justify-center py-40 animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="w-32 h-32 bg-white rounded-[40px] border border-black/5 shadow-sm flex items-center justify-center text-black/10 mb-8">
                    <Users size={64} />
                </div>
                <h2 className="font-integral font-black text-3xl uppercase tracking-tighter text-black mb-2">Customer Hub</h2>
                <p className="text-[11px] font-bold text-black/30 uppercase tracking-[0.3em]">Module scheduled for Phase 2 Deployment</p>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Product Tools */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-black/5 group focus-within:ring-2 focus-within:ring-indigo-500/10 active:scale-95 transition-all">
                        <Search size={18} className="text-black/30 group-focus-within:text-indigo-500" />
                        <input type="text" placeholder="Search inventory..." className="bg-transparent border-none outline-none px-3 text-sm font-bold" />
                    </div>
                    <button className="p-3 bg-gray-50 rounded-2xl border border-black/5 text-black/60 hover:text-black hover:bg-gray-100 transition-all active:scale-90">
                        <Filter size={18} />
                    </button>
                    <button className="p-3 bg-gray-50 rounded-2xl border border-black/5 text-black/60 hover:text-black hover:bg-gray-100 transition-all active:scale-90">
                        <LayoutGrid size={18} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase text-black/40 leading-none">Total Items</p>
                        <p className="text-sm font-black text-black mt-1 leading-none">{products.length} Products</p>
                    </div>
                    <button 
                      onClick={() => setShowModal(true)}
                      className="bg-[#0F172A] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95 shadow-xl shadow-black/10"
                    >
                      <Plus size={20} /> Add New Product
                    </button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 group relative">
                      {/* Badge */}
                      {product.isNewArrival && (
                        <span className="absolute top-4 left-4 z-10 bg-indigo-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg shadow-indigo-500/20">New Arrival</span>
                      )}
                      
                      <div className="relative h-72 overflow-hidden bg-gray-50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        
                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                            <button onClick={() => handleEdit(product)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-black hover:bg-indigo-500 hover:text-white transition-all scale-90 group-hover:scale-100"><Edit2 size={20} /></button>
                            <button onClick={() => handleDelete(product._id)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all scale-90 group-hover:scale-100"><Trash2 size={20} /></button>
                        </div>

                        <div className="absolute bottom-4 right-4 group-hover:opacity-0 transition-opacity whitespace-nowrap">
                            <button className="p-2.5 bg-white/90 backdrop-blur rounded-xl shadow-lg border border-black/5"><MoreVertical size={16} /></button>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-bold text-lg text-black truncate leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                            <button className="p-1 hover:text-indigo-500 transition-colors"><ExternalLink size={14}/></button>
                        </div>
                        
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-2xl font-black text-black">${product.price}</span>
                          {product.oldPrice && <span className="text-black/20 line-through text-base font-bold">${product.oldPrice}</span>}
                        </div>

                        <div className="pt-5 border-t border-black/5 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase text-black/30 leading-none tracking-widest">Category</p>
                                <p className="text-xs font-black text-black truncate uppercase">{product.category}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black uppercase text-black/30 leading-none tracking-widest">Inventory</p>
                                <p className="text-xs font-black text-indigo-500 truncate uppercase">{product.variants?.length || 0} Variants</p>
                            </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>


      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300 flex flex-col max-h-[92vh] border border-black/5">
            <div className="px-10 py-8 border-b border-black/5 flex items-center justify-between bg-white shrink-0">
              <div>
                <h2 className="font-integral font-black text-2xl uppercase tracking-tight text-black">
                    {editingProduct ? 'Update Product' : 'Create New Product'}
                </h2>
                <p className="text-[10px] font-black uppercase text-black/30 tracking-widest mt-1">Inventory Management System</p>
              </div>
              <button onClick={closeModal} className="w-12 h-12 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"><X size={24} className="text-black/40" /></button>
            </div>

            <form onSubmit={handleSubmit} className="px-10 py-10 overflow-y-auto custom-scrollbar">
              <div className="space-y-12">
                {/* SECTION 1: GENERAL INFO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-black mb-1">General Information</h4>
                        <p className="text-xs text-black/40 font-medium">Basic details about your product like name, description and style.</p>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Product Title</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="bg-gray-50/50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black" placeholder="e.g. Premium Cotton Tee" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Category</label>
                                <select name="category" required value={formData.category} onChange={handleInputChange} className="bg-gray-50/50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black appearance-none cursor-pointer">
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
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Style</label>
                                <select name="style" value={formData.style} onChange={handleInputChange} className="bg-gray-50/50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black appearance-none cursor-pointer">
                                    <option value="Casual">Casual</option>
                                    <option value="Formal">Formal</option>
                                    <option value="Party">Party</option>
                                    <option value="Gym">Gym</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Product Description</label>
                            <textarea name="description" required value={formData.description} onChange={handleInputChange} rows="4" className="bg-gray-50/50 border border-black/5 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black resize-none" placeholder="Elaborate on the material, fit, and model details..." />
                        </div>
                    </div>
                </div>

                <hr className="border-black/5" />

                {/* SECTION 2: PRICING & INVENTORY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-black mb-1">Pricing & Classification</h4>
                        <p className="text-xs text-black/40 font-medium">Control the pricing, discounts, and how the product is categorized in the shop.</p>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Regular Price</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-black/30">$</span>
                                    <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full bg-indigo-50/30 border border-indigo-100 rounded-2xl pl-10 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-black text-black" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Old Price (MSRP)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-black/30">$</span>
                                    <input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleInputChange} className="w-full bg-gray-50/50 border border-black/5 rounded-2xl pl-10 pr-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black/40" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Discount (%)</label>
                                <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="bg-gray-50/50 border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-bold text-black" placeholder="0%" min="0" max="100"/>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-[32px] border border-black/5 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Sale Type</label>
                                    <select name="productType" value={formData.productType} onChange={handleInputChange} className="bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-xs uppercase tracking-widest">
                                        <option value="regular">Regular Shop Item</option>
                                        <option value="loyalty-only">Loyalty Only</option>
                                        <option value="hybrid">Points + Cash</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1">Points Value</label>
                                    <input type="number" name="pointsPrice" value={formData.pointsPrice} onChange={handleInputChange} className="bg-white border border-black/5 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-indigo-500/20 font-black text-black" placeholder="0 pts" />
                                </div>
                            </div>

                            <div className="flex items-center gap-10 pt-2 px-2">
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" name="isNewArrival" checked={formData.isNewArrival} onChange={handleInputChange} className="sr-only" />
                                        <div className={`w-12 h-7 rounded-full transition-all duration-300 ${formData.isNewArrival ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.isNewArrival ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em] group-hover:text-black">New Arrival</span>
                                </label>
                                <label className="flex items-center gap-4 cursor-pointer group">
                                    <div className="relative">
                                        <input type="checkbox" name="isTopSeller" checked={formData.isTopSeller} onChange={handleInputChange} className="sr-only" />
                                        <div className={`w-12 h-7 rounded-full transition-all duration-300 ${formData.isTopSeller ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                                        <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${formData.isTopSeller ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.2em] group-hover:text-black">Top Selling</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-black/5" />

                {/* SECTION 3: MEDIA */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-black mb-1">Media Gallery</h4>
                        <p className="text-xs text-black/40 font-medium">Upload high-quality images. The first image will be the primary cover.</p>
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-black/40 uppercase tracking-widest px-1 flex items-center gap-2"><ImageIcon size={14}/> Primary Cover</label>
                            <div className="bg-gray-50/50 p-8 rounded-[32px] border-2 border-dashed border-black/5 flex flex-col items-center justify-center">
                                <FileUpload currentImage={formData.image} onUploadSuccess={(url) => setFormData({...formData, image: url})} />
                                {!formData.image && <p className="text-[10px] font-black uppercase text-black/20 tracking-widest mt-4">Drop your main image here</p>}
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[10px] font-black text-black/40 uppercase tracking-widest flex items-center gap-2"><ImageIcon size={14}/> Product Showcase ({formData.thumbnails?.length || 0})</label>
                                <button type="button" className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:text-indigo-700">Clear All</button>
                            </div>
                            <div className="bg-gray-50/30 p-8 rounded-[32px] border border-black/5">
                                <FileUpload currentImage="" onUploadSuccess={addThumbnail} />
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 mt-8">
                                    {formData.thumbnails?.map((thumb, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group bg-white border border-black/5 shadow-sm">
                                        <img src={thumb} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                        <button type="button" onClick={() => removeThumbnail(idx)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all translate-y-2 group-hover:translate-y-0">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    ))}
                                    {formData.thumbnails?.length === 0 && (
                                        <div className="col-span-full py-8 text-center text-black/10">
                                            <ImageIcon size={32} className="mx-auto mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No gallery images</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-black/5" />

                {/* SECTION 4: VARIANTS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div>
                        <h4 className="font-black text-sm uppercase tracking-widest text-black mb-1">Color Variants</h4>
                        <p className="text-xs text-black/40 font-medium">Add product variations with different colors, prices, and specific images.</p>
                    </div>
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex flex-col gap-6">
                             {formData.variants?.map((variant, idx) => (
                                <div key={idx} className="bg-white p-8 rounded-[32px] border border-black/10 shadow-sm relative group overflow-hidden">
                                     <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
                                     <div className="flex justify-between items-center mb-8">
                                         <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-xs font-black">{idx + 1}</span>
                                            <h5 className="font-black text-xs uppercase tracking-widest text-black/60">Color Variant</h5>
                                         </div>
                                         <button type="button" onClick={() => removeVariant(idx)} className="w-10 h-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-90"><X size={20} /></button>
                                     </div>

                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                         <div className="space-y-6">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[10px] font-black text-black/30 uppercase tracking-widest">Color Name / Hex</label>
                                                <input type="text" value={variant.color} onChange={(e) => updateVariant(idx, 'color', e.target.value)} className="bg-gray-50 border border-black/5 rounded-2xl px-5 py-3.5 text-sm font-bold" placeholder="Red / #FF0000" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-widest">Variant Price</label>
                                                    <input type="number" value={variant.price} onChange={(e) => updateVariant(idx, 'price', e.target.value)} className="bg-gray-50 border border-black/5 rounded-2xl px-5 py-3.5 text-sm font-bold" placeholder="Override price" />
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-[10px] font-black text-black/30 uppercase tracking-widest">Variant Sizes</label>
                                                    <input type="text" value={variant.sizes} onChange={(e) => updateVariant(idx, 'sizes', e.target.value)} className="bg-gray-50 border border-black/5 rounded-2xl px-5 py-3.5 text-sm font-bold" placeholder="S, M, L" />
                                                </div>
                                            </div>
                                         </div>

                                         <div className="space-y-4">
                                            <label className="text-[10px] font-black text-black/30 uppercase tracking-widest">Variant Gallery ({variant.images?.length || 0})</label>
                                            <FileUpload currentImage="" onUploadSuccess={(url) => addVariantImage(idx, url)} />
                                            {variant.images?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {variant.images.map((imgUrl, imgIdx) => (
                                                        <div key={imgIdx} className="relative w-14 h-14 rounded-xl overflow-hidden group border border-black/10 border-dashed">
                                                            <img src={imgUrl} className="w-full h-full object-cover" alt="Variant" />
                                                            <button type="button" onClick={() => removeVariantImage(idx, imgIdx)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Trash2 size={12} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                         </div>
                                     </div>
                                </div>
                             ))}
                             
                             <button type="button" onClick={addVariant} className="w-full border-2 border-dashed border-black/5 rounded-[32px] py-8 flex flex-col items-center justify-center gap-3 text-black/30 hover:text-indigo-500 hover:border-indigo-500/20 hover:bg-indigo-50/30 transition-all active:scale-[0.99] group">
                                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add New Color Variant</span>
                             </button>
                        </div>
                    </div>
                </div>
              </div>

              {/* Form Footer */}
              <div className="mt-20 pt-10 border-t border-black/5 flex items-center justify-end gap-6">
                <button type="button" onClick={closeModal} className="px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">Cancel Changes</button>
                <button type="submit" className="bg-[#0F172A] text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-95 shadow-2xl shadow-black/20">
                  {editingProduct ? 'Update Product Data' : 'Publish Product to Store'}
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
