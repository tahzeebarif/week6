import React from 'react';

const Hero = () => {
  return (
    <section className="bg-[#F2F0F1] flex flex-col md:flex-row md:items-center relative min-h-[100vh] sm:min-h-[700px] lg:min-h-[800px] overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 w-full relative z-10 flex flex-col md:flex-row items-center md:items-start pt-10 pb-0 md:py-20 lg:py-32">
        <div className="w-full max-w-2xl lg:max-w-[650px] text-left">
          <h1 className="font-integral font-black text-[36px] sm:text-[48px] md:text-[56px] lg:text-[72px] leading-[1.05] mb-5 md:mb-8 text-black uppercase tracking-tight">
            FIND CLOTHES THAT MATCHES YOUR STYLE
          </h1>
          
          <p className="text-black/60 font-satoshi text-[14px] md:text-base leading-relaxed mb-6 md:mb-10 max-w-[545px]">
            Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          
          <div className="w-full md:w-auto mb-8 md:mb-12">
            <a href="#shop" className="block w-full sm:w-max">
              <button className="w-full sm:w-auto bg-black text-white text-base font-medium px-14 py-[15px] rounded-[62px] hover:bg-black/90 transition-all active:scale-[0.98]">
                Shop Now
              </button>
            </a>
          </div>
          
          {/* Stats Bar */}
          <div className="flex flex-wrap md:flex-nowrap justify-start items-center gap-x-6 sm:gap-x-12 md:gap-x-8 gap-y-6 pb-12 md:pb-0">
             <div className="flex flex-col items-start">
               <span className="text-[24px] sm:text-[32px] md:text-[32px] lg:text-[40px] font-bold text-black leading-none font-satoshi">200+</span>
               <span className="text-black/60 text-[12px] sm:text-base mt-1 font-satoshi">International Brands</span>
             </div>
             
             <div className="hidden sm:block w-px h-[52px] bg-black/10"></div>
             
             <div className="flex flex-col items-start">
               <span className="text-[24px] sm:text-[32px] md:text-[32px] lg:text-[40px] font-bold text-black leading-none font-satoshi">2,000+</span>
               <span className="text-black/60 text-[12px] sm:text-base mt-1 font-satoshi">High-Quality Products</span>
             </div>

             <div className="hidden md:block w-px h-[52px] bg-black/10"></div>
             
             <div className="flex flex-col items-start w-full sm:w-auto">
               <span className="text-[24px] sm:text-[32px] md:text-[32px] lg:text-[40px] font-bold text-black leading-none font-satoshi">30,000+</span>
               <span className="text-black/60 text-[12px] sm:text-base mt-1 font-satoshi">Happy Customers</span>
             </div>
          </div>
        </div>
      </div>

      {/* Hero Image Container */}
      <div className="relative w-full mt-auto md:mt-0 md:absolute md:inset-0 z-0 flex justify-center md:justify-end overflow-hidden md:h-full">
        <img 
          src="/images/Rectangle 2 (1).png" 
          alt="Fashion models" 
          className="w-full md:w-auto h-auto min-h-[448px] md:h-full object-cover md:object-contain object-top md:object-right pointer-events-none select-none"
        />
        
        {/* Decorative Sparkles */}
        <div className="absolute right-[8%] top-[10%] md:right-10 md:top-[12%] z-20 scale-[0.5] sm:scale-[0.7] md:scale-100 pointer-events-none">
          <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M52 0C52 28.7188 75.2812 52 104 52C75.2812 52 52 75.2812 52 104C52 75.2812 28.7188 52 0 52C28.7188 52 52 28.7188 52 0Z" fill="black"/>
          </svg>
        </div>
        
        <div className="absolute left-[10%] top-[35%] sm:top-[40%] md:left-[52%] md:top-[55%] z-20 scale-[0.4] sm:scale-[0.6] md:scale-100 pointer-events-none">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28 0C28 15.4639 40.5361 28 56 28C40.5361 28 28 40.5361 28 56C28 40.5361 15.4639 28 0 28C15.4639 28 28 15.4639 28 0Z" fill="black"/>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default Hero;
