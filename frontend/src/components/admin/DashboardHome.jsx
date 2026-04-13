import React, { useState, useEffect } from 'react';
import { getOrderStats } from '../../api/orderApi';
import { DollarSign, ShoppingBag, Users, Layers, TrendingUp, Clock, CheckCircle, Package } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getOrderStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div>
    </div>
  );

  const statCards = [
    { title: 'Total Revenue', value: `$${stats?.totalRevenue || 0}`, icon: <DollarSign className="text-emerald-500" />, sub: 'All-time sales' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag className="text-indigo-500" />, sub: 'Placed orders' },
    { title: 'Customers', value: stats?.totalUsers || 0, icon: <Users className="text-amber-500" />, sub: 'Registered users' },
    { title: 'Products', value: stats?.totalProducts || 0, icon: <Layers className="text-rose-500" />, sub: 'In inventory' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-2xl group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-black/40 text-xs font-bold uppercase tracking-widest">{card.title}</p>
              <h3 className="text-3xl font-integral font-extrabold mt-1">{card.value}</h3>
              <p className="text-[10px] text-black/40 mt-1 uppercase font-bold">{card.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Distribution */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-black/5 shadow-sm">
           <h3 className="font-integral font-extrabold text-xl mb-6 uppercase">Order Status</h3>
           <div className="space-y-4">
             {stats?.statusStats?.map((s, i) => (
               <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                 <div className="flex items-center gap-3">
                   {s._id === 'Pending' && <Clock size={18} className="text-amber-500" />}
                   {s._id === 'Delivered' && <CheckCircle size={18} className="text-emerald-500" />}
                   {s._id === 'Processing' && <Package size={18} className="text-indigo-500" />}
                   <span className="font-bold text-sm">{s._id}</span>
                 </div>
                 <span className="text-lg font-extrabold">{s.count}</span>
               </div>
             ))}
             {(!stats?.statusStats || stats.statusStats.length === 0) && (
               <p className="text-center py-10 text-black/40 font-bold uppercase text-xs tracking-widest">No order data yet</p>
             )}
           </div>
        </div>

        {/* Placeholder for Revenue Chart */}
        <div className="lg:col-span-2 bg-black text-white p-8 rounded-[32px] shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <h3 className="font-integral font-extrabold text-xl mb-2 uppercase">Revenue Growth</h3>
             <p className="text-white/40 text-sm mb-10">Monthly revenue trends for the current year.</p>
             
             {/* Simple SVG Chart Representation */}
             <div className="h-48 flex items-end gap-3 px-4">
                {[45, 60, 40, 75, 50, 90, 65, 80, 55, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-white/10 rounded-t-lg hover:bg-white/30 transition-all group relative" style={{height: `${h}%`}}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${h * 10}
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-4 px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
               <span>Jan</span>
               <span>Mar</span>
               <span>May</span>
               <span>Jul</span>
               <span>Sep</span>
               <span>Nov</span>
             </div>
           </div>
           
           {/* Abstract Background Decoration */}
           <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
           <div className="absolute top-10 right-10 w-20 h-20 border border-white/10 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
