import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Star, StarHalf, Minus, Plus, Check, ChevronRight, ChevronDown } from 'lucide-react';
import { getProductById, getProducts } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { getReviewsByProductId } from '../api/reviewApi';
import WriteReviewModal from '../components/WriteReviewModal';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, MoreHorizontal } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('reviews'); // 'details', 'reviews', 'faqs'
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('Latest');
  const [selectedImage, setSelectedImage] = useState(0);

  // Dynamic values based on selection
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [displayedOldPrice, setDisplayedOldPrice] = useState(0);
  const [displayedImage, setDisplayedImage] = useState('');
  const [availableSizes, setAvailableSizes] = useState([]);

  const fetchProductAndReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getProductById(id);
      const data = response.data;
      setProduct(data);
      
      // Initial setup
      const initialColor = data.baseColor || (data.variants?.length > 0 ? data.variants[0].color : (data.colors?.length > 0 ? data.colors[0] : null));
      setSelectedColor(initialColor);
      
      setDisplayedPrice(data.price);
      setDisplayedOldPrice(data.oldPrice);
      setDisplayedImage(data.image);
      setAvailableSizes(data.sizes || []);

      const reviewsData = await getReviewsByProductId(id);
      setReviews(reviewsData.data);
      
      // Fetch related products based on category
      if (data.category) {
        try {
          const relatedResponse = await getProducts({ category: data.category, limit: 5 });
          // Filter out the current product and slice to 4
          const filteredRelated = relatedResponse.data
            .filter(p => p._id !== id)
            .slice(0, 4);
          setRelatedProducts(filteredRelated);
        } catch (error) {
          console.error("Failed to fetch related products", error);
        }
      }
      
    } catch (err) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductAndReviews();
    window.scrollTo(0, 0);
  }, [fetchProductAndReviews]);

  useEffect(() => {
    if (product && selectedColor) {
      const variant = product.variants?.find(v => v.color.trim().toLowerCase() === selectedColor.trim().toLowerCase());
      if (variant) {
        setDisplayedPrice(variant.price || product.price);
        setDisplayedOldPrice(variant.oldPrice || product.oldPrice);
        if (variant.images && variant.images.length > 0) {
            setDisplayedImage(variant.images[0]);
        } else {
            setDisplayedImage(product.image);
        }
        
        const newSizes = variant.sizes?.length > 0 ? variant.sizes : product.sizes;
        setAvailableSizes(newSizes);
        if (!newSizes.includes(selectedSize)) {
            setSelectedSize(newSizes[0]);
        }
      } else {
        setDisplayedPrice(product.price);
        setDisplayedOldPrice(product.oldPrice);
        setDisplayedImage(product.image);
        setAvailableSizes(product.sizes);
      }
    }
  }, [selectedColor, product, selectedSize]);

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    alert('Added to cart!');
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFC633] text-[#FFC633]" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#FFC633] text-[#FFC633]" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-black/10" />);
      }
    }
    return stars;
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  // Dynamically compile thumbnails: if variant has distinct images, use ONLY those. Otherwise fallback to main gallery.
  const activeVariant = product.variants?.find(v => v.color.trim().toLowerCase() === selectedColor?.trim().toLowerCase());
  let images = [displayedImage, ...(product.thumbnails || [])].filter(img => !!img);
  
  if (activeVariant && activeVariant.images && activeVariant.images.length > 0) {
      images = [...activeVariant.images].filter(img => !!img);
  }
  
  // Make sure to remove any exact duplicates generated during fallback merges
  images = Array.from(new Set(images));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-black/60 text-sm md:text-base mb-8 font-satoshi">
        <span className="hover:text-black cursor-pointer">Home</span>
        <ChevronRight size={16} />
        <span className="hover:text-black cursor-pointer">Shop</span>
        <ChevronRight size={16} />
        <span className="hover:text-black cursor-pointer">{product.category || 'Category'}</span>
        <ChevronRight size={16} />
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
        {/* Gallery Section */}
        <div className="flex flex-col lg:flex-row-reverse gap-4 md:gap-5">
          {/* Main Image */}
          <div className="flex-1 bg-[#F0EEED] rounded-[20px] aspect-[4/5] sm:aspect-square overflow-hidden">
            <img 
              src={images[selectedImage] || displayedImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-3 min-w-0 lg:w-[150px] overflow-x-auto lg:overflow-y-visible hide-scrollbar pb-2 lg:pb-0">
            {images.map((img, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 w-24 sm:w-28 lg:w-full aspect-square bg-[#F0EEED] rounded-[20px] overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === idx ? 'border-black' : 'border-transparent hover:border-black/20'}`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} ${idx + 1}`} 
                  className="w-full h-full object-contain p-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-integral uppercase mb-3 md:mb-4 tracking-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="flex">
              {renderStars(product.rating || 0)}
            </div>
            <span className="text-black text-sm md:text-base font-satoshi">
              {product.rating}/<span className="text-black/60">5</span>
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-6">
            <span className="text-2xl md:text-3xl font-bold text-black">${displayedPrice}</span>
            {displayedOldPrice && displayedOldPrice > displayedPrice && (
              <span className="text-2xl md:text-3xl font-bold text-black/30 line-through">${displayedOldPrice}</span>
            )}
            {product.discount > 0 && (
              <span className="bg-[#FF3333]/10 text-[#FF3333] text-sm md:text-base font-medium px-4 py-1.5 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-black/60 font-satoshi leading-relaxed mb-6 md:mb-8 pb-6 md:pb-8 border-b border-black/10 text-sm md:text-base max-w-lg">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-black/10">
            <h3 className="text-black/60 font-satoshi mb-4 text-base">Select Colors</h3>
            <div className="flex flex-wrap gap-4">
              {/* Combine baseColor, variants, and base colors */}
              {Array.from(new Set([
                ...(product.baseColor ? [product.baseColor] : []),
                ...(product.variants?.map(v => v.color) || []),
                ...(product.colors || [])
              ])).filter(Boolean).map((color, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(0); // Reset to main image when color changes
                  }}
                  className={`w-9 h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 ${selectedColor === color ? 'border-black' : 'border-black/10'}`}
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  {selectedColor === color && <Check size={16} className={['#ffffff', 'white', '#fff'].includes(color.toLowerCase()) ? 'text-black' : 'text-white'} />}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6 md:mb-8 pb-6 md:pb-8 border-b border-black/10">
            <h3 className="text-black/60 font-satoshi mb-4 text-base">Choose Size</h3>
            <div className="flex flex-wrap gap-3">
              {(availableSizes?.length > 0 ? availableSizes : ['Small', 'Medium', 'Large', 'X-Large']).map((size) => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-5 py-2.5 md:px-6 md:py-3 rounded-full text-sm md:text-base font-satoshi transition-all border ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-[#F0EEED] text-black/60 border-transparent hover:bg-black/5'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 md:gap-5">
            <div className="flex items-center justify-between w-[120px] md:w-[170px] bg-[#F0EEED] rounded-full py-3 px-5 md:py-4 md:px-6">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-black hover:scale-110 transition-all font-bold"
              >
                <Minus size={20} />
              </button>
              <span className="font-bold text-base md:text-xl font-satoshi">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-black hover:scale-110 transition-all font-bold"
              >
                <Plus size={20} />
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-black text-white font-satoshi font-medium py-3 md:py-4 px-8 rounded-full text-sm md:text-base hover:bg-black/90 transition-all active:scale-[0.98]"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Section (Details, Reviews, FAQs) */}
      <div className="mt-12 md:mt-20">
        {/* Tab Headers */}
        <div className="flex border-b border-black/10">
          <button 
            onClick={() => setActiveTab('details')}
            className={`flex-1 text-center py-4 md:py-6 text-sm md:text-xl font-satoshi font-medium transition-all relative ${activeTab === 'details' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Product Details
            {activeTab === 'details' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 text-center py-4 md:py-6 text-sm md:text-xl font-satoshi font-medium transition-all relative ${activeTab === 'reviews' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            Rating & Reviews
            {activeTab === 'reviews' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
          <button 
            onClick={() => setActiveTab('faqs')}
            className={`flex-1 text-center py-4 md:py-6 text-sm md:text-xl font-satoshi font-medium transition-all relative ${activeTab === 'faqs' ? 'text-black' : 'text-black/40 hover:text-black'}`}
          >
            FAQs
            {activeTab === 'faqs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black"></div>}
          </button>
        </div>

        {/* Tab Content */}
        <div className="py-8 md:py-12">
          {activeTab === 'details' && (
            <div className="max-w-4xl font-satoshi text-black/60 leading-relaxed">
              <h3 className="text-xl font-bold text-black mb-4 uppercase font-integral">Product Specifications</h3>
              <p className="mb-6">{product.description}</p>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-black mb-3">Material & Care</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Premium Quality Fabric</li>
                    <li>Style Type: {product.style || 'Casual'}</li>
                    <li>Machine wash cold with like colors</li>
                    <li>Tumble dry low, do not iron on print</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {/* Reviews Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl md:text-2xl font-bold font-satoshi">All Reviews</h2>
                  <span className="text-black/60 font-normal text-sm md:text-base">({reviews.length})</span>
                </div>
                <div className="flex items-center gap-2 md:gap-3">
                  <button className="p-3 bg-[#F0F0F0] rounded-full hover:bg-black/5 transition-all"><SlidersHorizontal size={20} /></button>
                  <div className="bg-[#F0F0F0] rounded-full flex items-center px-4 py-3 text-sm font-bold group relative cursor-pointer min-w-[120px]">
                    Sort by: <span className="ml-1 flex items-center gap-1">{sortOrder} <ChevronDown size={14} /></span>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white border border-black/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
                        <button onClick={() => setSortOrder('Latest')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black">Latest</button>
                        <button onClick={() => setSortOrder('Oldest')} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black">Oldest</button>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="bg-black text-white px-6 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold hover:bg-black/90 transition-all active:scale-95"
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Reviews Grid */}
              {reviews.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                  {reviews.map((review) => (
                    <div key={review._id} className="border border-black/10 rounded-[20px] p-6 md:p-8 flex flex-col gap-3 relative animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex justify-between items-start">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <button className="text-black/30 hover:text-black transition-colors"><MoreHorizontal size={20} /></button>
                      </div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-base md:text-lg font-satoshi">{review.name}</h4>
                        {review.isVerified && (
                           <div className="w-4 h-4 md:w-5 md:h-5 bg-green-500 rounded-full flex items-center justify-center">
                             <Check size={10} className="text-white" strokeWidth={4} />
                           </div>
                        )}
                      </div>
                      <p className="text-sm md:text-base text-black/60 font-satoshi leading-relaxed italic">
                        "{review.comment}"
                      </p>
                      <p className="mt-4 text-sm md:text-base font-bold text-black/40 font-satoshi">
                        Posted on {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center flex flex-col items-center gap-4 border-2 border-dashed border-black/10 rounded-[20px] bg-gray-50/50">
                  <div className="w-16 h-16 bg-white border border-black/5 rounded-full flex items-center justify-center text-gray-400 shadow-sm">
                    <Star size={32} />
                  </div>
                  <h3 className="text-xl font-bold font-satoshi">No reviews yet</h3>
                  <p className="text-black/60 font-satoshi max-w-xs">Be the first to share your experience with this product!</p>
                  <button 
                    onClick={() => setShowReviewModal(true)}
                    className="mt-2 text-black underline font-bold hover:text-black/70"
                  >
                    Be the First to Review
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'faqs' && (
            <div className="max-w-3xl space-y-6 animate-in fade-in duration-500">
               <div className="p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-base md:text-lg font-bold font-satoshi mb-2">What is the return policy?</h4>
                  <p className="text-sm md:text-base text-black/60 font-satoshi">We offer a 30-day money-back guarantee for all products. Items must be in their original condition and packaging.</p>
               </div>
               <div className="p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-base md:text-lg font-bold font-satoshi mb-2">How long does shipping take?</h4>
                  <p className="text-sm md:text-base text-black/60 font-satoshi">Standard shipping usually takes 3-5 business days. International shipping may take 7-14 business days.</p>
               </div>
               <div className="p-6 bg-gray-50 rounded-2xl">
                  <h4 className="text-base md:text-lg font-bold font-satoshi mb-2">Can I change my order?</h4>
                  <p className="text-sm md:text-base text-black/60 font-satoshi">Orders can be changed within 2 hours of placement. Please contact our support team immediately.</p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Write review modal */}
      {showReviewModal && (
        <WriteReviewModal 
          productId={id} 
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            setShowReviewModal(false);
            fetchProductAndReviews();
          }}
        />
      )}

      {/* You Might Also Like Section */}
      <div className="mt-16 md:mt-24 mb-10">
        <h2 className="font-integral font-extrabold text-[32px] md:text-5xl text-black uppercase text-center mb-10 md:mb-14">
          YOU MIGHT ALSO LIKE
        </h2>
        {relatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {relatedProducts.map(product => (
              <ProductCard key={product._id} {...product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 font-satoshi italic">
            No related products found for this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
