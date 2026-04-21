import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/orderApi';
import { Package, Search, Calendar, ChevronRight, MoreVertical, Filter, Download } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await getOrders();
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (err) {
      alert('Update failed');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Shipped': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'Processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 shadow-sm">
        <div className="flex flex-wrap bg-gray-50 p-1.5 rounded-2xl border border-black/5 gap-y-1">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                  filter === f ? 'bg-white text-black shadow-md' : 'text-black/30 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <div className="flex items-center bg-gray-50 border border-black/5 rounded-2xl px-4 py-2 md:py-2.5 group focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all flex-1 min-w-[200px]">
                <Search size={18} className="text-black/30 group-focus-within:text-indigo-500 transition-colors shrink-0" />
                <input type="text" placeholder="Filter by Order ID or User..." className="bg-transparent border-none outline-none px-3 text-xs font-bold w-full" />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gray-50 rounded-2xl border border-black/5 text-[10px] font-black uppercase tracking-widest text-black/60 hover:bg-black hover:text-white transition-all flex-1 sm:flex-none">
                <Filter size={14} /> <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-[#0F172A] rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-black/10 flex-1 sm:flex-none whitespace-nowrap">
                <Download size={14} /> <span className="hidden sm:inline">Export CSV</span>
            </button>
        </div>
      </div>

      {/* Orders Table Area */}
      <div className="bg-white rounded-[40px] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 border-b border-black/5">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Reference</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Customer</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Total Amount</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Status</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Date Placed</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Fulfillment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 mt-2">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-black/20 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                            <Package size={20} />
                        </div>
                        <span className="font-mono text-xs font-black text-black">#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                      <p className="font-black text-sm text-black uppercase">{order.user?.name || 'Anonymous'}</p>
                      <p className="text-[10px] text-black/30 font-bold lowercase tracking-wider mt-0.5">{order.user?.email || 'no-email@store.com'}</p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex flex-col">
                        <p className="font-black text-lg text-black tracking-tight">${order.totalPrice}</p>
                        <p className={`text-[10px] font-bold uppercase mt-0.5 ${order.paymentStatus === 'Success' || order.paymentMethod === 'Loyalty Points' ? 'text-emerald-500' : 'text-amber-500'}`}>
                           {order.paymentMethod} • {order.paymentStatus || 'Pending'}
                        </p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2 text-black/40">
                        <Calendar size={14} />
                        <span className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-3">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="bg-gray-50 border border-black/5 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider outline-none focus:ring-2 focus:ring-indigo-500/10 cursor-pointer appearance-none relative"
                      >
                        <option value="Pending">Mark Pending</option>
                        <option value="Processing">Log Processing</option>
                        <option value="Shipped">Dispatch Order</option>
                        <option value="Delivered">Confirm Delivery</option>
                        <option value="Cancelled">Cancel Order</option>
                      </select>
                      <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-black/30 hover:text-black">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-[30px] flex items-center justify-center text-black/5 animate-pulse">
                        <Package size={40} />
                      </div>
                      <div>
                        <p className="text-black font-black uppercase text-sm tracking-widest">No orders found</p>
                        <p className="text-black/30 text-xs mt-1">Try adjusting your filters or check back later.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

