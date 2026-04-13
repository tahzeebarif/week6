import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../api/orderApi';
import { Package, Clock, Truck, CheckCircle, ChevronRight, ShoppingBag } from 'lucide-react';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getMyOrders();
                setOrders(res.data);
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Delivered': return <CheckCircle size={18} className="text-emerald-500" />;
            case 'Shipped': return <Truck size={18} className="text-blue-500" />;
            case 'Processing': return <Clock size={18} className="text-amber-500" />;
            default: return <Package size={18} className="text-gray-400" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Shipped': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Processing': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-black/60 text-sm mb-8 font-satoshi">
                <Link to="/" className="hover:text-black">Home</Link>
                <ChevronRight size={16} />
                <Link to="/profile" className="hover:text-black">Profile</Link>
                <ChevronRight size={16} />
                <span className="text-black font-medium">My Orders</span>
            </nav>

            <h1 className="text-3xl md:text-[40px] font-black font-integral uppercase mb-10 tracking-tighter">My Orders</h1>

            {orders.length === 0 ? (
                <div className="bg-white border border-black/5 rounded-[32px] p-20 text-center flex flex-col items-center gap-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-black/20">
                        <ShoppingBag size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold font-satoshi mb-2">No orders yet</h2>
                        <p className="text-black/60 font-satoshi max-w-xs">You haven't placed any orders yet. Start shopping to see them here!</p>
                    </div>
                    <Link to="/" className="bg-black text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-black/80 transition-all">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-black/5 rounded-[24px] overflow-hidden hover:shadow-md transition-shadow">
                            {/* Order Header */}
                            <div className="p-6 md:px-8 md:py-6 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5">
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
                                    <div>
                                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Order Placed</p>
                                        <p className="text-sm font-bold text-black">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-sm font-bold text-black">${order.totalPrice.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1">Status</p>
                                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-1 md:text-right">Order ID</p>
                                    <p className="text-xs font-mono font-bold text-black/60">#{order._id.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Order Content */}
                            <div className="p-6 md:p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {/* Items List */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {order.orderItems.map((item, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="w-20 h-24 bg-[#F0EEED] rounded-xl overflow-hidden flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-base md:text-lg font-satoshi mb-1 line-clamp-1">{item.name}</h4>
                                                    <p className="text-xs text-black/40 font-medium mb-2 uppercase tracking-tight">Qty: {item.qty} · ${item.price} each</p>
                                                    <button className="text-xs font-bold text-black underline hover:text-black/60 transition-colors">Buy it again</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Shipping Info */}
                                    <div className="bg-gray-50 rounded-2xl p-6 h-fit">
                                        <h5 className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-4">Shipping To</h5>
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-black">{order.shippingAddress.address}</p>
                                            <p className="text-sm text-black/60 font-medium">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                            <p className="text-sm text-black/60 font-medium mb-4">{order.shippingAddress.country}</p>
                                            
                                            <div className="pt-4 border-t border-black/5 mt-4">
                                                <h5 className="text-[10px] font-bold text-black/40 uppercase tracking-widest mb-2">Payment</h5>
                                                <p className="text-xs font-bold text-black opacity-80 uppercase">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
