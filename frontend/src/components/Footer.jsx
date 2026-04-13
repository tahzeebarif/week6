import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  const socialIcons = [
    {
      name: 'Twitter',
      svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M16 3.038c-.59.263-1.22.437-1.885.52.677-.407 1.198-1.05 1.442-1.815-.634.375-1.337.648-2.085.795-.598-.638-1.45-1.037-2.396-1.037-1.81 0-3.278 1.47-3.278 3.277 0 .256.03.506.085.745-2.727-.137-5.145-1.444-6.762-3.43-.283.483-.445 1.045-.445 1.646 0 1.138.578 2.143 1.457 2.73-.537-.017-1.043-.165-1.485-.41v.04c0 1.59 1.13 2.915 2.63 3.216-.276.075-.567.114-.866.114-.21 0-.414-.02-.613-.058.418 1.306 1.63 2.257 3.067 2.284-1.123.88-2.54 1.404-4.077 1.404-.265 0-.527-.015-.785-.045 1.453.93 3.178 1.474 5.032 1.474 6.038 0 9.34-5 9.34-9.338 0-.143-.004-.284-.01-.425.64-.463 1.2-1.04 1.64-1.697z"/></svg>
    },
    {
      name: 'Facebook',
      svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
    },
    {
      name: 'Instagram',
      svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/></svg>
    },
    {
      name: 'GitHub',
      svg: <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.582 0 8c0 3.535 2.292 6.533 5.47 7.59.4.075.547-.172.547-.385 0-.19-.007-.693-.01-1.36-2.226.483-2.695-1.073-2.695-1.073-.364-.924-.89-1.17-.89-1.17-.725-.496.056-.486.056-.486.803.056 1.225.824 1.225.824.714 1.223 1.873.87 2.33.665.072-.517.278-.87.507-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.312-1.587.823-2.147-.083-.202-.357-1.015.077-2.117 0 0 .672-.215 2.2.82a7.662 7.662 0 0 1 2.003-.27c.68.003 1.364.09 2.003.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.162 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.872 3.75-3.655 3.947.287.246.543.732.543 1.477 0 1.066-.01 1.924-.01 2.185 0 .215.145.465.55.386C13.71 14.53 16 11.534 16 8c0-4.418-3.582-8-8-8z"/></svg>
    }
  ];

  return (
    <footer className="bg-[#F0F0F0] pt-40 pb-10 relative mt-32 md:mt-48">
      
      {/* Newsletter Subscription Bar - Overlapping the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] max-w-[1240px] bg-black rounded-[20px] px-6 py-9 md:px-16 md:py-11 flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 z-20">
        <h2 className="font-integral font-extrabold text-[28px] sm:text-[32px] md:text-[40px] text-white leading-[1.1] max-w-[550px] text-center lg:text-left uppercase">
          STAY UP TO DATE ABOUT OUR LATEST OFFERS
        </h2>
        
        <div className="flex flex-col gap-3 w-full max-w-[349px]">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full bg-white rounded-full py-3 px-12 text-black text-sm md:text-base font-satoshi placeholder:text-black/40 outline-none"
            />
          </div>
          <button className="w-full bg-white text-black font-satoshi font-medium py-3 rounded-full hover:bg-white/90 transition-all active:scale-95 leading-none text-sm md:text-base">
            Subscribe to Newsletter
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-12 md:mb-20">
          {/* Brand Info */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="font-integral font-extrabold text-[28px] md:text-[32px] text-black mb-6 uppercase tracking-tighter">
              SHOP.CO
            </h2>
            <p className="text-black/60 font-satoshi text-sm md:text-base leading-relaxed mb-8 max-w-[248px]">
              We have clothes that suits your style and which you're proud to wear. From women to men.
            </p>
            <div className="flex items-center gap-x-3">
              {socialIcons.map((item, idx) => (
                <a key={idx} href="/" className="w-7 h-7 flex items-center justify-center rounded-full border border-black/10 bg-white hover:bg-black hover:text-white transition-all">
                  {item.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          <div className="flex flex-col gap-6">
            <h4 className="font-satoshi font-bold text-black uppercase tracking-widest text-sm md:text-base">Company</h4>
            <ul className="flex flex-col gap-4 text-black/60 font-satoshi text-sm md:text-base">
              <li><a href="/" className="hover:text-black transition-colors">About</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Features</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Works</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Career</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-satoshi font-bold text-black uppercase tracking-widest text-sm md:text-base">Help</h4>
            <ul className="flex flex-col gap-4 text-black/60 font-satoshi text-sm md:text-base">
              <li><a href="/" className="hover:text-black transition-colors">Customer Support</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Delivery Details</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Terms & Conditions</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-satoshi font-bold text-black uppercase tracking-widest text-sm md:text-base">FAQ</h4>
            <ul className="flex flex-col gap-4 text-black/60 font-satoshi text-sm md:text-base">
              <li><a href="/" className="hover:text-black transition-colors">Account</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Manage Deliveries</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Orders</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Payments</a></li>
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-satoshi font-bold text-black uppercase tracking-widest text-sm md:text-base">Resources</h4>
            <ul className="flex flex-col gap-4 text-black/60 font-satoshi text-sm md:text-base">
              <li><a href="/" className="hover:text-black transition-colors">Free eBooks</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Development Tutorial</a></li>
              <li><a href="/" className="hover:text-black transition-colors">How to - Blog</a></li>
              <li><a href="/" className="hover:text-black transition-colors">Youtube Playlist</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black/60 font-satoshi text-sm">
            Shop.co © 2000-2023, All Rights Reserved
          </p>
          <div className="flex items-center gap-x-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 bg-white px-2 py-0.5 rounded" alt="Visa" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 bg-white px-2 py-0.5 rounded" alt="Mastercard" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 bg-white px-2 py-0.5 rounded" alt="PayPal" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="h-4 bg-white px-2 py-1 rounded" alt="Apple Pay" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" className="h-4 bg-white px-2 py-1 rounded" alt="Google Pay" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
