import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Tag, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, subtotal, discount, deliveryFee, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      alert('Please login to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <div>
          <h1 className="text-3xl font-black font-integral uppercase mb-2">Your cart is empty</h1>
          <p className="text-black/60 font-satoshi">Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link to="/" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black/80 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-black/60 text-sm mb-8 font-satoshi">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight size={16} />
        <span className="text-black font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl md:text-[40px] font-black font-integral uppercase mb-8 tracking-tighter">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Cart Items List */}
        <div className="flex-1 bg-white border border-black/10 rounded-[20px] p-4 sm:p-6 space-y-6">
          {cartItems.map((item, idx) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className={`flex gap-3 sm:gap-4 pb-6 ${idx !== cartItems.length - 1 ? 'border-b border-black/10' : ''}`}>
              {/* Product Image */}
              <div className="w-[100px] h-[100px] sm:w-32 sm:h-32 bg-[#F0EEED] rounded-xl overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-base sm:text-lg md:text-xl font-satoshi mb-0.5 truncate">{item.name}</h3>
                    <p className="text-[10px] sm:text-xs md:text-sm text-black/60">Size: <span className="text-black">{item.size}</span></p>
                    <p className="text-[10px] sm:text-xs md:text-sm text-black/60">Color: <span className="text-black">{item.color}</span></p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.color, item.size)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold font-satoshi">${item.price}</span>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between w-[90px] sm:w-[120px] bg-[#F0F0F0] rounded-full py-2 px-3 sm:py-3 sm:px-5">
                    <button onClick={() => updateQty(item.id, item.color, item.size, item.qty - 1)} className="text-black hover:scale-110 transition-all font-bold">
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-xs sm:text-base font-satoshi">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.color, item.size, item.qty + 1)} className="text-black hover:scale-110 transition-all font-bold">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-[400px]">
          <div className="bg-white border border-black/10 rounded-[20px] p-6 sticky top-24">
            <h2 className="text-xl md:text-2xl font-bold font-satoshi mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-black/60 font-satoshi">
                <span>Subtotal</span>
                <span className="text-black font-bold">${subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-black/60 font-satoshi">
                <span>Discount ({discount}%)</span>
                <span className="text-red-500 font-bold">-${(subtotal * (discount / 100)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-black/60 font-satoshi">
                <span>Delivery Fee</span>
                <span className="text-black font-bold">${deliveryFee}</span>
              </div>
              <div className="flex justify-between items-center text-black/60 font-satoshi">
                <span>Tax (5%)</span>
                <span className="text-black font-bold">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                <span className="text-lg md:text-xl font-satoshi">Total</span>
                <span className="text-xl md:text-2xl font-bold font-satoshi">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Promo Code */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 flex items-center bg-[#F0F0F0] rounded-full px-4 py-3">
                <Tag size={20} className="text-black/40 mr-2" />
                <input type="text" placeholder="Add promo code" className="bg-transparent border-none outline-none w-full text-sm" />
              </div>
              <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-black/80 transition-all">Apply</button>
            </div>

            <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Go to Checkout'}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
