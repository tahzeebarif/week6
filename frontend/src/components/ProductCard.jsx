import React from 'react';
import { Star, StarHalf } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ _id, image, name, title, rating, price, oldPrice, discount, variants, baseColor, activeColor }) => {
  const displayTitle = name || title;
  
  let displayImage = image;
  let displayPrice = price;
  let displayOldPrice = oldPrice;

  // Variant Display Interceptor!
  if (activeColor) {
     const matchedVariant = variants?.find(v => v.color.trim().toLowerCase() === activeColor.trim().toLowerCase());
     if (matchedVariant) {
        if (matchedVariant.images && matchedVariant.images.length > 0) {
            displayImage = matchedVariant.images[0];
        }
        if (matchedVariant.price) displayPrice = matchedVariant.price;
        if (matchedVariant.oldPrice) displayOldPrice = matchedVariant.oldPrice;
     } else if (baseColor && baseColor.trim().toLowerCase() === activeColor.trim().toLowerCase()) {
        // Base color selected, explicitly stick to defaults.
        displayImage = image;
        displayPrice = price;
        displayOldPrice = oldPrice;
     }
  }

  // Render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-4 h-4 fill-[#FFC633] text-[#FFC633]" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalf key={i} className="w-4 h-4 fill-[#FFC633] text-[#FFC633]" />);
      } else {
        stars.push(<Star key={i} className="w-4 h-4 text-[#FFC633]/20" />);
      }
    }
    return stars;
  };

  return (
    <Link to={`/product/${_id}`} className="flex flex-col group cursor-pointer h-full transition-all">
      {/* Image Container */}
      <div className="bg-[#F0EEED] rounded-[20px] aspect-square overflow-hidden mb-4 relative transition-transform duration-300 group-hover:scale-[1.02]">
        <img 
          src={displayImage} 
          alt={displayTitle} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-satoshi font-bold text-base md:text-xl text-black mb-1 truncate group-hover:text-black/70 transition-colors">
          {displayTitle}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-x-2 mb-2">
          <div className="flex">
            {renderStars(rating || 0)}
          </div>
          <span className="text-black text-sm font-satoshi">
            {rating || 0}/<span className="text-black/60">5</span>
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center gap-x-3 mt-auto">
          <span className="text-xl md:text-2xl font-bold text-black">${displayPrice}</span>
          {displayOldPrice && displayOldPrice > displayPrice && (
            <span className="text-xl md:text-2xl font-bold text-black/30 line-through">
              ${displayOldPrice}
            </span>
          )}
          {discount > 0 && (
            <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] md:text-xs font-bold px-3 py-1 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
