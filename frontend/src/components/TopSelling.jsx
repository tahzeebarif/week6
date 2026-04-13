import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../api/productApi';

const TopSelling = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        // Filter for top sellers if that's the logic
        const topSellers = res.data.filter(p => p.isTopSeller).slice(0, 4);
        setProducts(topSellers);
      } catch (err) {
        console.error('Failed to fetch top sellers', err);
      }
    };

    fetchProducts();
  }, []);
  return (
    <section id="on-sale" className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24">
      {/* Section Header */}
      <h2 className="font-integral font-extrabold text-[32px] md:text-5xl text-center text-black uppercase mb-10 md:mb-14">
        TOP SELLING
      </h2>

      {/* Grid - Enhanced for responsiveness */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10 lg:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400 font-satoshi italic">
          No top selling products found at the moment.
        </div>
      )}

      {/* View All Button */}
      <div className="flex justify-center mt-12 md:mt-16">
        <button className="px-12 py-4 border border-black/10 rounded-full font-satoshi text-base font-medium text-black hover:bg-black hover:text-white transition-all active:scale-95">
          View All
        </button>
      </div>
    </section>
  );
};

export default TopSelling;
