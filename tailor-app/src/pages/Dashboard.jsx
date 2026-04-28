import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, Package, Plus, ArrowRight, Clock, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { StatCard, Badge, Btn } from '../components/ui';

const revenueData = [
  { month: 'Jan', revenue: 45000 },
  { month: 'Feb', revenue: 62000 },
  { month: 'Mar', revenue: 58000 },
  { month: 'Apr', revenue: 75000 },
  { month: 'May', revenue: 0 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-4 py-3 rounded-2xl border border-amber-500/20 shadow-2xl">
        <p className="text-amber-400 font-bold text-xs uppercase tracking-widest mb-1">{label}</p>
        <p className="text-white text-lg font-bold font-[Outfit]">PKR {payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const customers = useSelector(s => s.customers.list);
  const orders = useSelector(s => s.orders.list);
  const fabrics = useSelector(s => s.fabrics.list);
  const invoices = useSelector(s => s.invoices.list);
  const navigate = useNavigate();

  const activeOrders = orders.filter(o => o.status !== 'Delivered').length;
  const monthRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.total, 0);
  const lowStock = fabrics.filter(f => f.quantity < 2).length;
  const pendingOrders = orders.filter(o => o.status === 'Pending');
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter mb-2">Operational Insight</h2>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-medium">
            Real-time <span className="text-amber-500 font-bold italic">analytics</span> and order lifecycle management for the Royal Stitch workshop ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <Btn onClick={() => navigate('/orders')} variant="primary" size="lg" className="rounded-2xl shadow-2xl shadow-amber-500/10 hover:scale-105 transition-transform">
            <Plus size={22} className="mr-1" /> Initialize Commission
          </Btn>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 section-spacing">
        <StatCard title="Total Customers" value={customers.length} subtitle="Registered active base" icon={Users} color="amber" trend={8} />
        <StatCard title="Active Orders" value={activeOrders} subtitle={`${pendingOrders.length} projects pending`} icon={ShoppingBag} color="blue" trend={12} />
        <StatCard title="Monthly Revenue" value={`PKR ${(75000).toLocaleString()}`} subtitle="April fiscal cycle" icon={DollarSign} color="green" trend={15} />
        <StatCard title="Inventory Alert" value={lowStock} subtitle="Materials below 2.0m" icon={Package} color={lowStock > 0 ? 'red' : 'green'} />
      </div>

      {/* Charts and Status Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 glass-card rounded-[2.5rem] p-10 premium-border shadow-2xl scale-in">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-2xl font-black text-white font-[Outfit] flex items-center gap-4 tracking-tight">
                <Target size={24} className="text-amber-500/80" /> Revenue Trajectory
              </h3>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mt-2 opacity-70">Earnings performance — last 5 quarters</p>
            </div>
            <div className="px-5 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 tracking-widest uppercase">
              FISCAL 2026
            </div>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' }} axisLine={false} tickLine={false} dy={15} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 12 }} />
                <Bar dataKey="revenue" fill="url(#colorRev)" radius={[12, 12, 4, 4]} />
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                    <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Orders Sidebar */}
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex flex-col scale-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white font-[Outfit] tracking-tighter">Queue</h3>
            <Badge status="Pending" />
          </div>
          <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
            {pendingOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-950/40 rounded-[2rem] border border-dashed border-slate-800">
                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mb-4 text-slate-800 shadow-inner">
                  <Clock size={32} />
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">Archive Clear</p>
              </div>
            ) : pendingOrders.slice(0, 5).map(o => {
              const customer = customers.find(c => c.id === o.customerId);
              return (
                <div key={o.id} className="group p-5 bg-slate-950/60 rounded-[1.5rem] border border-slate-800/60 hover:border-amber-500/30 transition-all hover:bg-slate-900/80">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-amber-500 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-black truncate tracking-tight uppercase">{customer?.name}</p>
                      <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mt-1 opacity-60">{o.clothingType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 text-[10px] font-black tracking-widest uppercase">{o.dueDate.split('-').slice(1).join('/')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {pendingOrders.length > 5 && (
            <button onClick={() => navigate('/orders')} className="w-full mt-8 py-4 bg-slate-900/60 rounded-2xl text-[10px] font-black text-slate-500 hover:text-amber-500 hover:bg-slate-900 transition-all uppercase tracking-[0.3em] border border-slate-800/40">
              Inspect Full Queue
            </button>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border shadow-2xl scale-in" style={{ animationDelay: '0.2s' }}>
        <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
          <h3 className="text-2xl font-black text-white font-[Outfit] tracking-tighter">Recent Dispatch History</h3>
          <Btn variant="ghost" size="sm" onClick={() => navigate('/orders')} className="uppercase text-[10px] tracking-[0.2em] font-black">
            Full Archive <ArrowRight size={16} className="ml-2" />
          </Btn>
        </div>
        <div className="overflow-x-auto px-6 pb-6 custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-800/40">
                <th className="px-8 py-10">Client Profile</th>
                <th className="px-8 py-10">Garment Specification</th>
                <th className="px-8 py-10">Valuation</th>
                <th className="px-8 py-10">Deadline</th>
                <th className="px-8 py-10 text-right">Operational Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {recentOrders.map(o => {
                const customer = customers.find(c => c.id === o.customerId);
                return (
                  <tr key={o.id} className="hover:bg-amber-500/[0.03] transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-amber-500 font-black text-xs border border-slate-800 shadow-inner group-hover:rotate-6 transition-transform">
                          {customer?.name.charAt(0)}
                        </div>
                        <span className="text-white font-black text-base tracking-tighter group-hover:text-amber-400 transition-colors uppercase">{customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-slate-400 text-xs font-black uppercase tracking-widest opacity-80">{o.clothingType}</span>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-slate-200 font-black text-base tracking-tighter">PKR {o.price.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-8">
                      <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{o.dueDate}</span>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <Badge status={o.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
