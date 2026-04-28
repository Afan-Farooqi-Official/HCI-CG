import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, Ruler, ShoppingBag, Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { Btn, Badge } from '../components/ui';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const customer = useSelector(s => s.customers.list.find(c => c.id === Number(id)));
  const measurement = useSelector(s => s.measurements.list.find(m => m.customerId === Number(id)));
  const orders = useSelector(s => s.orders.list.filter(o => o.customerId === Number(id)));
  const fabrics = useSelector(s => s.fabrics.list);

  if (!customer) return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
        <MapPin size={32} className="opacity-20" />
      </div>
      <p className="text-lg font-bold font-[Outfit]">Client Not Found</p>
      <Btn onClick={() => navigate('/customers')} className="mt-6" variant="secondary">
        <ChevronLeft size={14} /> Back to Database
      </Btn>
    </div>
  );

  const measureFields = [
    ['Chest', 'chest'], ['Waist', 'waist'], ['Hips', 'hips'], ['Shoulder', 'shoulder'],
    ['Sleeve', 'sleeve'], ['Neck', 'neck'], ['Thigh', 'thigh'], ['Inseam', 'inseam'],
    ['Height', 'height'], ['Weight', 'weight'],
  ];

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Header */}
      <div className="flex items-center gap-8 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <button onClick={() => navigate('/customers')} className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-slate-400 hover:text-amber-500 hover:border-amber-500/20 transition-all shadow-xl active:scale-95 group">
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">{customer.name}</h2>
          <div className="flex items-center gap-3 mt-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse"></span>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.25em]">Verified Client Profile</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 section-spacing">
        {/* Left Col: Info & Measurements */}
        <div className="space-y-10">
          <div className="glass-card rounded-[2.5rem] p-10 premium-border relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><MapPin size={120} /></div>
            <div className="flex items-center gap-8 mb-10">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[2rem] flex items-center justify-center text-slate-950 font-black text-4xl shadow-2xl shadow-amber-500/30 group-hover:scale-105 transition-transform duration-500">
                {customer.name.charAt(0)}
              </div>
              <div>
                <p className="text-slate-500 text-[11px] uppercase font-black tracking-[0.2em] mb-2 opacity-70">Member Since</p>
                <p className="text-white font-black text-lg tracking-tight">{customer.createdAt}</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-start gap-5 p-6 bg-slate-950/40 rounded-3xl border border-slate-800/50 group/item hover:border-amber-500/30 transition-all cursor-default">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1.5 opacity-60">Mobile</p>
                  <p className="text-white font-black text-sm tracking-wide">{customer.phone}</p>
                </div>
              </div>
              {customer.email && (
                <div className="flex items-start gap-5 p-6 bg-slate-950/40 rounded-3xl border border-slate-800/50 group/item hover:border-amber-500/30 transition-all cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1.5 opacity-60">Email Address</p>
                    <p className="text-white font-black text-sm truncate tracking-tight">{customer.email}</p>
                  </div>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-5 p-6 bg-slate-950/40 rounded-3xl border border-slate-800/50 group/item hover:border-amber-500/30 transition-all cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 group-hover/item:scale-110 transition-transform">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-1.5 opacity-60">Physical Address</p>
                    <p className="text-white font-bold text-sm leading-relaxed tracking-tight">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-10 premium-border scale-in">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-white font-[Outfit] flex items-center gap-4 tracking-tight">
                <Ruler size={24} className="text-amber-500/80" /> Body Profile
              </h3>
              <Btn variant="ghost" size="sm" onClick={() => navigate('/measurements')} className="uppercase text-[10px] tracking-[0.2em] font-black">Calibrate</Btn>
            </div>
            
            {measurement ? (
              <div className="grid grid-cols-2 gap-6">
                {measureFields.slice(0, 6).map(([label, key]) => (
                  <div key={key} className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800/40 hover:bg-slate-900 transition-colors">
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mb-2 opacity-70">{label}</p>
                    <p className="text-white font-black text-xl tracking-tighter">
                      {measurement[key]} <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest ml-1">{key === 'weight' ? 'kg' : measurement.unit}</span>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-14 bg-slate-950/20 rounded-3xl border border-dashed border-slate-800">
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic opacity-60">No anatomical data recorded.</p>
                <Btn variant="secondary" size="md" className="mt-8 px-8 rounded-xl" onClick={() => navigate('/measurements')}>Begin Record</Btn>
              </div>
            )}
            
            {measurement && (
              <Btn variant="secondary" className="w-full mt-10 py-5 rounded-2xl border-slate-800 text-slate-300 hover:text-white uppercase text-[10px] font-black tracking-[0.25em]" onClick={() => navigate('/measurements')}>
                Inspect Full Anatomy <ExternalLink size={16} className="ml-2" />
              </Btn>
            )}
          </div>
        </div>

        {/* Right Col: Orders */}
        <div className="xl:col-span-2 space-y-10">
          <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border flex flex-col h-full shadow-2xl">
            <div className="px-10 py-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
              <h3 className="text-2xl font-black text-white font-[Outfit] tracking-tighter">Commission Portfolio</h3>
              <div className="px-6 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] shadow-lg shadow-amber-500/5">
                {orders.length} ACTIVE PROJECTS
              </div>
            </div>
            
            <div className="flex-1">
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-40 opacity-40 px-10 text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-8 shadow-inner">
                    <ShoppingBag size={40} className="text-slate-700" />
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-[0.3em]">Portfolio Empty</p>
                  <Btn variant="primary" size="lg" className="mt-10 rounded-2xl shadow-xl shadow-amber-500/10" onClick={() => navigate('/orders')}>Initiate New Project</Btn>
                </div>
              ) : (
                <div className="overflow-x-auto px-6 pb-6 custom-scrollbar">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-800/40">
                        <th className="px-8 py-10">Clothing Type</th>
                        <th className="px-8 py-10">Fabric Specification</th>
                        <th className="px-8 py-10">Timeline</th>
                        <th className="px-8 py-10">Valuation</th>
                        <th className="px-8 py-10 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {orders.map(o => {
                        const fabric = fabrics.find(f => f.id === o.fabricId);
                        return (
                          <tr key={o.id} className="hover:bg-amber-500/[0.03] transition-all group">
                            <td className="px-8 py-8">
                              <p className="text-white font-black text-base tracking-tight group-hover:text-amber-400 transition-colors">{o.clothingType}</p>
                              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 opacity-70">Size Class: {o.size}</p>
                            </td>
                            <td className="px-8 py-8 min-w-[180px]">
                              <p className="text-slate-300 text-xs font-black tracking-tight">{fabric?.name || "Customer's Own Material"}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="w-3 h-3 rounded-md border border-slate-800 shadow-sm" style={{ backgroundColor: fabric?.colorCode }}></div>
                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{fabric?.color}</span>
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <div className="flex flex-col">
                                <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Deadline</span>
                                <span className="text-amber-500 text-xs font-black tracking-widest">{o.dueDate}</span>
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <span className="text-slate-200 font-black text-base tracking-tighter">PKR {o.price.toLocaleString()}</span>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
