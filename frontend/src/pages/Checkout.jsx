import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orderApi';
import { ChevronRight, CreditCard, Gift, MapPin, CheckCircle, ArrowRight, Truck } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Initialize Stripe. We use an environment variable or dummy key.
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
        headers: { Authorization: `Bearer ${token}` }
    };
};

const CheckoutContent = () => {
    const { cartItems, subtotal, deliveryFee, tax, total, clearCart } = useCart();
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    
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

    const handleLoyaltyPayment = async (orderData) => {
        // Send totalPoints variable along with standard order creation to trigger backend logic securely
        orderData.totalPoints = Math.floor(total);
        await createOrder(orderData);
        // Refresh local user points state for smooth UX
        if (setUser && user) {
           setUser({ ...user, loyaltyPoints: user.loyaltyPoints - Math.floor(total) });
        }
        return true;
    };

    const handleStripePayment = async (orderData) => {
        if (!stripe || !elements) {
             throw new Error("Stripe has not loaded yet.");
        }

        // 1. Create standard order in DB as Pending
        const createdOrderRes = await createOrder(orderData);
        const orderId = createdOrderRes.data._id;

        // 2. Fetch Payment Intent from backend
        const intentRes = await axios.post('http://localhost:4000/api/payments/create-payment-intent', { orderId }, getAuthHeader());
        const { clientSecret } = intentRes.data;

        // 3. Confirm Card Payment via Stripe
        const cardElement = elements.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
             payment_method: {
                 card: cardElement,
                 billing_details: {
                     name: user.name,
                     email: user.email,
                     address: {
                        line1: shippingAddress.address,
                        city: shippingAddress.city,
                        postal_code: shippingAddress.postalCode,
                        country: shippingAddress.country
                     }
                 }
             }
        });

        if (error) {
             throw new Error(error.message);
        }

        if (paymentIntent.status === 'succeeded') {
             return true;
        }
        
        throw new Error("Payment could not be completed.");
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

            if (paymentMethod === 'Loyalty Points') {
                 if (user.loyaltyPoints < Math.floor(total)) {
                     throw new Error("Not enough loyalty points.");
                 }
                 await handleLoyaltyPayment(orderData);
            } else if (paymentMethod === 'Credit Card') {
                 await handleStripePayment(orderData);
            } else {
                 await createOrder(orderData); // Cash on Delivery fallback
            }

            setOrderSuccess(true);
            clearCart();
            setTimeout(() => {
                navigate('/profile');
            }, 3000);
        } catch (err) {
            alert(err.response?.data?.message || err.message || 'Failed to place order');
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

    const canPayWithPoints = user && user.loyaltyPoints >= Math.floor(total);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            <nav className="flex items-center gap-2 text-black/60 text-sm mb-8 font-satoshi">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight size={16} />
                <Link to="/cart" className="hover:text-black">Cart</Link>
                <ChevronRight size={16} />
                <span className="text-black font-medium">Checkout</span>
            </nav>

            <h1 className="text-3xl md:text-[40px] font-black font-integral uppercase mb-10 tracking-tighter">Checkout</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                <form className="flex-1 space-y-10">
                    {/* Shipping Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                            <MapPin size={24} />
                            <h2 className="text-xl font-bold font-satoshi uppercase tracking-wider">Shipping Address</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Full Address</label>
                                <input type="text" name="address" required value={shippingAddress.address} onChange={handleInputChange} placeholder="House number and street name" className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">City</label>
                                <input type="text" name="city" required value={shippingAddress.city} onChange={handleInputChange} placeholder="City" className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Postal Code</label>
                                <input type="text" name="postalCode" required value={shippingAddress.postalCode} onChange={handleInputChange} placeholder="Postal Code" className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold text-black/40 uppercase mb-2 block tracking-widest">Country</label>
                                <input type="text" name="country" required value={shippingAddress.country} onChange={handleInputChange} placeholder="Country" className="w-full bg-[#F0F0F0] border-none rounded-xl px-4 py-4 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                            </div>
                        </div>
                    </section>

                    {/* Payment Section */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 border-b border-black/10 pb-4">
                            <CreditCard size={24} />
                            <h2 className="text-xl font-bold font-satoshi uppercase tracking-wider">Payment Method</h2>
                        </div>
                        <div className="space-y-4">
                            {/* Card Option */}
                            <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Credit Card' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/10'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Credit Card' ? 'border-black' : 'border-black/20'}`}>
                                        {paymentMethod === 'Credit Card' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Credit Card (Stripe)</p>
                                        <p className="text-[10px] text-black/40 font-medium">Safe and Secure Payments</p>
                                    </div>
                                </div>
                                <input type="radio" value="Credit Card" checked={paymentMethod === 'Credit Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="hidden" />
                                <div className="flex gap-1">
                                    <div className="w-8 h-5 bg-gray-200 rounded text-[6px] flex items-center justify-center font-bold text-gray-800">VISA</div>
                                    <div className="w-8 h-5 bg-gray-200 rounded text-[6px] flex items-center justify-center font-bold text-gray-800">MC</div>
                                </div>
                            </label>

                            {/* Show actual Stripe Card Inputs if selected */}
                            {paymentMethod === 'Credit Card' && (
                                <div className="p-4 bg-gray-50 border border-t-0 border-black/5 rounded-b-2xl -mt-5 pt-7">
                                    <div className="bg-white p-3 border border-black/10 rounded-xl shadow-inner">
                                        <CardElement options={{style: {base: {fontSize: '16px', color: '#424770', '::placeholder': {color: '#aab7c4'}}}}} />
                                    </div>
                                </div>
                            )}

                            {/* Loyalty Points Option */}
                            <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'Loyalty Points' ? 'border-black bg-black/5' : 'border-black/5 hover:border-black/10'} ${!canPayWithPoints ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'Loyalty Points' ? 'border-black' : 'border-black/20'}`}>
                                        {paymentMethod === 'Loyalty Points' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm flex gap-2 items-center">
                                            Pay with Loyalty Points
                                            {!canPayWithPoints && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">Insufficient</span>}
                                        </p>
                                        <p className="text-[10px] text-black/40 font-medium">Balance: {user?.loyaltyPoints || 0} Points (Need {Math.floor(total)})</p>
                                    </div>
                                </div>
                                <input type="radio" value="Loyalty Points" disabled={!canPayWithPoints} checked={paymentMethod === 'Loyalty Points'} onChange={(e) => {
                                     if(canPayWithPoints) setPaymentMethod(e.target.value);
                                }} className="hidden" />
                                <Gift size={20} className="text-black/20" />
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
                            disabled={loading || !shippingAddress.address || (paymentMethod === 'Credit Card' && !stripe)}
                            className="w-full bg-black text-white py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/20"
                        >
                            {loading ? 'Processing...' : `Pay ${paymentMethod === 'Loyalty Points' ? Math.floor(total) + ' Points' : '$' + total.toFixed(2)}`}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                        <p className="text-center text-[10px] text-black/40 mt-4 font-medium uppercase tracking-widest flex items-center justify-center gap-1">
                            <CheckCircle size={12} /> Guaranteed Secure Checkout
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutContent />
        </Elements>
    );
};

export default Checkout;
