import React from 'react';

const Brands = () => {
  const brands = [
    { name: 'VERSACE', src: '/images/Vector.png' },
    { name: 'ZARA', src: '/images/Vector (1).png' },
    { name: 'GUCCI', src: '/images/Vector (2).png' },
    { name: 'PRADA', src: '/images/Vector (3).png' },
    { name: 'CALVIN KLEIN', src: '/images/Vector (4).png' }
  ];

  return (
    <div id="brands" className="bg-black w-full py-8 md:py-11">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-12 md:gap-x-16 lg:gap-x-24 gap-y-6 md:gap-y-0">
          {brands.map((brand) => (
            <img 
              key={brand.name}
              src={brand.src}
              alt={brand.name}
              className="h-5 sm:h-6 md:h-7 lg:h-8 object-contain brightness-0 invert opacity-100 hover:opacity-80 transition-opacity"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
