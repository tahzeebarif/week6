import React, { useState, useEffect } from 'react';
import { getOrderStats } from '../../api/orderApi';
import { DollarSign, ShoppingBag, Users, Layers, TrendingUp, Clock, CheckCircle, Package, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

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
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  const statCards = [
    { 
      title: 'Gross Revenue', 
      value: `$${stats?.totalRevenue?.toLocaleString() || 0}`, 
      icon: <DollarSign className="text-white" />, 
      color: 'bg-indigo-600',
      trend: '+12.5%',
      isUp: true,
      sparkline: [30, 45, 35, 60, 50, 80, 70]
    },
    { 
      title: 'Total Orders', 
      value: stats?.totalOrders || 0, 
      icon: <ShoppingBag className="text-white" />, 
      color: 'bg-emerald-500',
      trend: '+24.1%',
      isUp: true,
      sparkline: [20, 30, 45, 40, 60, 55, 90]
    },
    { 
      title: 'Registered Users', 
      value: stats?.totalUsers || 0, 
      icon: <Users className="text-white" />, 
      color: 'bg-amber-500',
      trend: '+8.2%',
      isUp: true,
      sparkline: [40, 35, 50, 45, 60, 70, 85]
    },
    { 
      title: 'Product Inventory', 
      value: stats?.totalProducts || 0, 
      icon: <Layers className="text-white" />, 
      color: 'bg-rose-500',
      trend: '-2.4%',
      isUp: false,
      sparkline: [80, 75, 70, 72, 65, 60, 55]
    },
  ];

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="flex justify-between items-center mb-4 md:mb-6 relative z-10">
              <div className={`p-3 ${card.color} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${card.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {card.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {card.trend}
              </div>
            </div>
            
            <div className="relative z-10">
              <p className="text-black/40 text-[10px] font-black uppercase tracking-widest leading-none mb-2">{card.title}</p>
              <h3 className="text-3xl font-black text-black leading-none">{card.value}</h3>
            </div>

            {/* Sparkline SVG */}
            <div className="absolute bottom-0 left-0 w-full h-16 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full">
                    <path 
                        d={`M 0 30 ${card.sparkline.map((val, idx) => `L ${(idx * 100) / (card.sparkline.length - 1)} ${30 - (val / 100) * 30}`).join(' ')} L 100 30 Z`} 
                        fill={card.isUp ? '#10b981' : '#ef4444'} 
                    />
                </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Status Distribution */}
        <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-black/5 shadow-sm">
           <div className="flex items-center justify-between mb-8">
              <h3 className="font-integral font-black text-xl uppercase tracking-tight">Order Status</h3>
              <button className="text-black/30 hover:text-black transition-colors"><MoreHorizontal size={20}/></button>
           </div>
           
           <div className="space-y-4">
             {stats?.statusStats?.map((s, i) => (
               <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-3xl group hover:bg-white hover:shadow-lg hover:shadow-black/5 border border-transparent hover:border-black/5 transition-all">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-black/5">
                        {s._id === 'Pending' && <Clock size={20} className="text-amber-500" />}
                        {s._id === 'Delivered' && <CheckCircle size={20} className="text-emerald-500" />}
                        {s._id === 'Processing' && <Package size={20} className="text-indigo-500" />}
                    </div>
                    <div>
                        <span className="block font-black text-sm uppercase text-black">{s._id}</span>
                        <span className="text-[10px] font-bold text-black/30 uppercase tracking-widest">Manage Items</span>
                    </div>
                 </div>
                 <span className="text-xl font-black text-black">{s.count}</span>
               </div>
             ))}
             {(!stats?.statusStats || stats.statusStats.length === 0) && (
               <div className="text-center py-10">
                 <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-black/10">
                    <Package size={30}/>
                 </div>
                 <p className="text-black/40 font-black uppercase text-[10px] tracking-widest">No order data yet</p>
               </div>
             )}
           </div>
        </div>

        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#0F172A] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
           <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h3 className="font-integral font-black text-2xl uppercase tracking-tighter mb-2">Revenue Analytics</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Yearly Performance Data</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase transition-all">Yearly</button>
                  <button className="px-4 py-2 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase transition-all">Monthly</button>
              </div>
           </div>
           
           <div className="relative z-10 flex-1 flex flex-col justify-end">
             {/* Chart Representation */}
             <div className="h-64 flex items-end gap-3 px-2">
                {[45, 65, 55, 85, 70, 95, 80, 100, 90, 85, 75, 40].map((h, i) => (
                  <div key={i} className="flex-1 bg-indigo-500/10 rounded-t-2xl hover:bg-indigo-500 transition-all group relative border-x border-white/5" style={{height: `${h}%`}}>
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-xl whitespace-nowrap">
                      ${h * 125}k
                    </div>
                  </div>
                ))}
             </div>
             <div className="flex justify-between mt-8 px-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
               <span>Jan</span>
               <span>Mar</span>
               <span>May</span>
               <span>Jul</span>
               <span>Sep</span>
               <span>Dec</span>
             </div>
           </div>
           
           {/* Abstract Decoration */}
           <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
           <div className="absolute top-10 right-10 w-24 h-24 border border-white/5 rounded-[40px] rotate-12"></div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

