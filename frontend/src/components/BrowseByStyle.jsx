import React from 'react';
import { Link } from 'react-router-dom';

const StyleCard = ({ title, image, className }) => (
  <Link 
    to={`/shop?style=${title}`}
    className={`relative h-[190px] md:h-[289px] bg-white rounded-[20px] overflow-hidden group cursor-pointer block ${className}`}
  >
    <h3 className="absolute left-6 top-6 md:left-9 md:top-7 font-satoshi font-bold text-2xl md:text-[36px] text-black z-10">
      {title}
    </h3>
    <img 
      src={image} 
      alt={title} 
      className="absolute inset-0 w-full h-full object-cover md:object-right-top transition-transform duration-500 group-hover:scale-110"
    />
  </Link>
);

const BrowseByStyle = () => {
  return (
    <section id="shop" className="max-w-[1440px] mx-auto px-4 md:px-8 mb-20 md:mb-32">
      <div className="bg-[#F0F0F0] rounded-[20px] md:rounded-[40px] px-6 py-10 md:px-16 md:py-16">
        {/* Section Header */}
        <h2 className="font-integral font-extrabold text-[32px] md:text-5xl text-center text-black uppercase mb-7 md:mb-16 leading-tight">
          BROWSE BY DRESS STYLE
        </h2>

        {/* Grid Layout */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Row 1: Casual (Small) & Formal (Large) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <StyleCard 
              title="Casual" 
              image="/images/image 11.png" 
              className="md:flex-[0.4]"
            />
            <StyleCard 
              title="Formal" 
              image="/images/image 13.png" 
              className="md:flex-[0.6]"
            />
          </div>

          {/* Row 2: Party (Large) & Gym (Small) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            <StyleCard 
              title="Party" 
              image="/images/image 12.png" 
              className="md:flex-[0.6]"
            />
            <StyleCard 
              title="Gym" 
              image="/images/image 14.png" 
              className="md:flex-[0.4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseByStyle;
