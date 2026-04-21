import React from 'react';
import { ChevronRight, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';

const SidebarFilters = ({ filters, onFilterChange }) => {
  const categories = ['T-Shirt', 'Shorts', 'Shirt', 'Hoodie', 'Jeans'];
  const colorMap = [
    { name: 'Green', hex: '#00C12B' },
    { name: 'Red', hex: '#F50606' },
    { name: 'Yellow', hex: '#F5DD06' },
    { name: 'Orange', hex: '#F57906' },
    { name: 'Cyan', hex: '#06CAF5' },
    { name: 'Blue', hex: '#063AF5' },
    { name: 'Purple', hex: '#7D06F5' },
    { name: 'Pink', hex: '#F506A4' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' }
  ];
  const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];
  const dressStyles = ['Casual', 'Formal', 'Party', 'Gym'];

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="w-full bg-white border border-black/10 rounded-[20px] p-6 lg:sticky lg:top-24">
      <div className="flex justify-between items-center pb-6 border-b border-black/10 mb-6">
        <h2 className="text-xl font-bold font-satoshi">Filters</h2>
        <SlidersHorizontal size={20} className="text-black/40" />
      </div>

      {/* Categories */}
      <div className="space-y-4 pb-6 border-b border-black/10 mb-6">
        {categories.map((cat) => (
          <div 
            key={cat} 
            onClick={() => onFilterChange({ ...filters, category: cat })}
            className={`flex justify-between items-center cursor-pointer hover:text-black transition-colors ${filters.category === cat ? 'text-black font-bold' : 'text-black/60'}`}
          >
            <span className="font-satoshi text-base">{cat}</span>
            <ChevronRight size={16} className="text-black/40" />
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="pb-6 border-b border-black/10 mb-6">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold font-satoshi">Price</h3>
            <ChevronDown size={20} />
        </div>
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="flex-1 text-center">
                    <label className="text-[10px] uppercase font-bold text-black/40 mb-1 block">Min Price</label>
                    <input 
                        type="number" name="minPrice" value={filters.minPrice || ''} onChange={handlePriceChange}
                        className="w-full bg-[#F0F0F0] rounded-lg px-3 py-2 text-sm outline-none text-center" placeholder="$50"
                    />
                </div>
                <div className="flex-1 text-center">
                    <label className="text-[10px] uppercase font-bold text-black/40 mb-1 block">Max Price</label>
                    <input 
                        type="number" name="maxPrice" value={filters.maxPrice || ''} onChange={handlePriceChange}
                        className="w-full bg-[#F0F0F0] rounded-lg px-3 py-2 text-sm outline-none text-center" placeholder="$200"
                    />
                </div>
            </div>
            {/* Visual Slider Placeholder */}
            <div className="relative h-1.5 bg-[#F0F0F0] rounded-full mt-4 mx-1">
                <div className="absolute left-[20%] right-[30%] h-full bg-black rounded-full text-center">
                    <div className="absolute -left-1 -top-1.5 w-4 h-4 bg-black rounded-full border-2 border-white cursor-pointer shadow-md"></div>
                    <div className="absolute -right-1 -top-1.5 w-4 h-4 bg-black rounded-full border-2 border-white cursor-pointer shadow-md"></div>
                </div>
            </div>
        </div>
      </div>

      {/* Colors */}
      <div className="pb-6 border-b border-black/10 mb-6 font-satoshi">
        <div className="flex justify-between items-center mb-5 font-bold">
            <h3 className="text-xl font-satoshi">Colors</h3>
            <ChevronDown size={20} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-3">
            {colorMap.map((color) => (
                <button 
                    key={color.name}
                    onClick={() => onFilterChange({ ...filters, color: filters.color === color.name ? '' : color.name })}
                    className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all hover:scale-110 ${filters.color === color.name ? 'border-black ring-1 ring-black/20' : 'border-black/5'}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                >
                    {filters.color === color.name && <Check size={16} className={['White', '#FFFFFF'].includes(color.name) || color.hex === '#FFFFFF' ? 'text-black' : 'text-white'} />}
                </button>
            ))}
        </div>
      </div>

      {/* Size */}
      <div className="pb-6 border-b border-black/10 mb-6 font-satoshi">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold font-satoshi">Size</h3>
            <ChevronDown size={20} />
        </div>
        <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
                <button 
                    key={size}
                    onClick={() => onFilterChange({ ...filters, size: filters.size === size ? '' : size })}
                    className={`px-4 py-2.5 rounded-full text-sm font-satoshi transition-all border ${filters.size === size ? 'bg-black text-white border-black' : 'bg-[#F0F0F0] text-black/60 border-transparent hover:bg-black/5'}`}
                >
                    {size}
                </button>
            ))}
        </div>
      </div>

      {/* Dress Style (New Section) */}
      <div className="mb-6 font-satoshi">
        <div className="flex justify-between items-center mb-5">
            <h3 className="text-xl font-bold font-satoshi">Dress Style</h3>
            <ChevronDown size={20} />
        </div>
        <div className="space-y-4">
            {dressStyles.map((style) => (
                <div 
                    key={style} 
                    onClick={() => onFilterChange({ ...filters, style: style })}
                    className={`flex justify-between items-center cursor-pointer hover:text-black transition-colors ${filters.style === style ? 'text-black font-bold' : 'text-black/60'}`}
                >
                    <span className="text-base">{style}</span>
                    <ChevronRight size={16} className="text-black/40" />
                </div>
            ))}
        </div>
      </div>

      <button 
        onClick={() => onFilterChange({ ...filters })}
        className="w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-black/90 transition-all active:scale-95 mt-4"
      >
        Apply Filter
      </button>
    </div>
  );
};

export default SidebarFilters;
