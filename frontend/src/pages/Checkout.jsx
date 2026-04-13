import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi';
import { ChevronRight, CreditCard, Truck, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

const Checkout = () => {
    const { cartItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('Credit Card');

    const handleInputChange = (e) => {
        setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        
        setLoading(true);
        try {
            const orderData = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item.id
                })),
                shippingAddress,
                paymentMethod,
                totalPrice: total
            };

            await createOrder(orderData);
            setOrderSuccess(true);
            clearCart();
            // Redirect after 3 seconds
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to place order');
        } finally {
            setLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-8">
                    <CheckCircle size={64} />
                </div>
                <h1 className="text-4xl md:text-6xl font-black font-integral uppercase mb-4 tracking-tighter">Order Success!</h1>
                <p className="text-black/60 font-satoshi text-lg max-w-md mx-auto">
                    Thank you for your purchase. Your order has been received and is being processed. 
                    Redirecting you to your profile...
                </p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center flex flex-col items-center gap-6">
                <h1 className="text-4xl font-black font-integral uppercase mb-2">Cart is Empty</h1>
                <Link to="/" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black/80 transition-all">
                    Back to Shop
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
                <Link to="/cart" className="hover:text-black">Cart</Link>
                <ChevronRight size={16} />
                <span className="text-black font-medium">Checkout</span>
            </nav>

            <h1 className="text-3xl md:text-[40px] font-black font-integral uppercase mb-10 tracking-tighter">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Form Section */}
                <form onSubmit={handleSubmit} className="flex-1 space-y-10">
                    {/* Shipping Address */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                            <MapPin size={24} />
                            <h2 className="text-xl font-bold font-satoshi uppercase tracking-wider">Shipping Address</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Full Address</label>
                                <input 
                                    type="text" name="address" required value={shippingAddress.address} onChange={handleInputChange}
                                    placeholder="House number and street name"
                                    className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">City</label>
                                <input 
                                    type="text" name="city" required value={shippingAddress.city} onChange={handleInputChange}
                                    placeholder="City"
                                    className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Postal Code</label>
                                <input 
                                    type="text" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange}
                                    placeholder="Postal Code"
                                    className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Country</label>
                                <input 
                                    type="text" name="country" required value={shippingAddress.country} onChange={handleInputChange}
                                    placeholder="Country"
                                    className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Payment Method */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                            <CreditCard size={24} />
                            <h2 className="text-xl font-bold font-satoshi uppercase tracking-wider">Payment Method</h2>
                        </div>
                        <div className="space-y-4">
                            <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Credit Card' ? 'border-black' : 'border-black/20'}`}>
                                        {paymentMethod === 'Credit Card' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Credit Card (Simulation)</p>
                                        <p className="text-[10px] text-black/40 font-medium">Safe for testing - no real payment</p>
                                    </div>
                                </div>
                                <input type="radio" value="Credit Card" checked={paymentMethod === 'Credit Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-gray-200 rounded text-[6px] flex items-center justify-center font-bold">VISA</div>
                                    <div className="w-8 h-5 bg-gray-200 rounded text-[6px] flex items-center justify-center font-bold">MC</div>
                                </div>
                            </label>

                            <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Cash on Delivery' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Cash on Delivery' ? 'border-black' : 'border-black/20'}`}>
                                        {paymentMethod === 'Cash on Delivery' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Cash on Delivery</p>
                                        <p className="text-[10px] text-black/40 font-medium">Pay when your order arrives</p>
                                    </div>
                                </div>
                                <input type="radio" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                <Truck size={20} className="text-black/20" />
                            </label>
                        </div>
                    </section>
                </form>

                {/* Summary Section */}
                <div className="lg:w-[450px]">
                    <div className="bg-white border border-black/10 rounded-[20px] p-6 md:p-8 sticky top-24">
                        <h2 className="text-2xl font-bold font-satoshi mb-8">Order Summary</h2>
                        
                        <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                            {cartItems.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                                    <div className="w-16 h-16 bg-[#F0EEED] rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                                        <p className="text-[10px] text-black/40">Qty: {item.qty} · {item.color} · {item.size}</p>
                                        <p className="font-bold text-sm mt-1">${item.price * item.qty}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-8 pt-6 border-t border-black/10">
                            <div className="flex justify-between items-center text-black/60 font-satoshi text-sm">
                                <span>Subtotal</span>
                                <span className="text-black font-bold">${subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-black/60 font-satoshi text-sm">
                                <span>Shipping</span>
                                <span className="text-black font-bold">${deliveryFee}</span>
                            </div>
                            <div className="flex justify-between items-center text-black/60 font-satoshi text-sm">
                                <span>Tax</span>
                                <span className="text-black font-bold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="pt-4 border-t border-black/10 flex justify-between items-center">
                                <span className="text-lg font-satoshi font-bold uppercase tracking-widest">Total</span>
                                <span className="text-2xl font-bold font-satoshi">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSubmit}
                            disabled={loading || !shippingAddress.address}
                            className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                        <p className="text-center text-[10px] text-black/40 mt-4 font-medium uppercase tracking-widest">
                            Guaranteed Secure Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
