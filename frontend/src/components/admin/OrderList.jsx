import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../api/orderApi';
import { Package } from 'lucide-react';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
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
      case 'Delivered': return 'bg-emerald-100 text-emerald-700';
      case 'Shipped': return 'bg-indigo-100 text-indigo-700';
      case 'Processing': return 'bg-blue-100 text-blue-700';
      case 'Cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h2 className="font-integral font-extrabold text-2xl uppercase">Order Management</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                  filter === f ? 'bg-white text-black shadow-sm' : 'text-black/40 hover:text-black'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[32px] border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-black/5">
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Order ID</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Customer</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Total</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Status</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Date</th>
                <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-black/40">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-black/60">#{order._id.slice(-8).toUpperCase()}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-sm text-black">{order.user?.name}</p>
                      <p className="text-[10px] text-black/40 font-medium">{order.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="font-extrabold text-black">${order.totalPrice}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-medium text-black/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="bg-gray-100 border-none rounded-lg px-2 py-1 text-[10px] font-bold uppercase outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-100 rounded-full text-black/20">
                        <Package size={40} />
                      </div>
                      <p className="text-black/40 font-bold uppercase text-xs tracking-widest">No orders found</p>
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
