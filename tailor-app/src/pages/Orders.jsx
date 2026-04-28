import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, ShoppingBag, Clock, Calendar, DollarSign, Filter, ChevronDown } from 'lucide-react';
import { addOrder, updateOrder, updateOrderStatus, deleteOrder } from '../store/slices/ordersSlice';
import { Modal, Btn, FormInput, EmptyState, ConfirmDialog, Badge } from '../components/ui';

const CLOTHING_TYPES = ["Men's Shirt", "Men's Trousers", "Women's Dress", "Women's Blouse", "Kurta", "Suit", "Kids Wear", "Other"];
const STATUSES = ['Pending', 'In Progress', 'Ready', 'Delivered'];
const EMPTY = { customerId: '', clothingType: "Men's Shirt", fabricId: '', size: 'M', isCustomSize: false, price: '', advancePaid: '', dueDate: '', notes: '', status: 'Pending' };

export default function Orders() {
  const { search } = useOutletContext();
  const customers = useSelector(s => s.customers.list);
  const orders = useSelector(s => s.orders.list);
  const fabrics = useSelector(s => s.fabrics.list);
  const sizes = useSelector(s => s.sizes.charts);
  const dispatch = useDispatch();

  const [tab, setTab] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = orders.filter(o => {
    const customer = customers.find(c => c.id === o.customerId);
    const matchesSearch = !search ||
      customer?.name.toLowerCase().includes(search.toLowerCase()) ||
      o.clothingType.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === 'All' || o.status === tab;
    return matchesSearch && matchesTab;
  });

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (o) => { setForm(o); setEditingId(o.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, customerId: Number(form.customerId), fabricId: Number(form.fabricId), price: Number(form.price), advancePaid: Number(form.advancePaid) };
    if (editingId) dispatch(updateOrder({ ...data, id: editingId }));
    else dispatch(addOrder(data));
    closeModal();
  };

  const handleStatusChange = (id, status) => dispatch(updateOrderStatus({ id, status }));
  const handleDelete = () => { dispatch(deleteOrder(deleteId)); setDeleteId(null); };

  const availableSizes = sizes[form.clothingType] ? sizes[form.clothingType].map(s => s.size) : ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const tabCounts = { 
    All: orders.length, 
    Pending: orders.filter(o => o.status === 'Pending').length, 
    'In Progress': orders.filter(o => o.status === 'In Progress').length, 
    Ready: orders.filter(o => o.status === 'Ready').length, 
    Delivered: orders.filter(o => o.status === 'Delivered').length 
  };

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Header & Filter Section */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Orders Lifecycle</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Track, manage and process client commissions with precision.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex flex-wrap bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700/30 backdrop-blur-md gap-1">
            {['All', ...STATUSES].map(s => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${tab === s ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                {s}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${tab === s ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
                  {tabCounts[s]}
                </span>
              </button>
            ))}
          </div>
          <Btn onClick={openAdd} size="lg" className="rounded-2xl shadow-2xl shadow-amber-500/10">
            <Plus size={20} /> Initialize Commission
          </Btn>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border shadow-2xl scale-in">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-800 bg-slate-900/40">
                <th className="px-10 py-8">Reference</th>
                <th className="px-10 py-8">Client Profile</th>
                <th className="px-10 py-8">Garment Details</th>
                <th className="px-10 py-8">Financials</th>
                <th className="px-10 py-8">Timeline</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-10 py-32">
                    <EmptyState icon={ShoppingBag} message="No active commissions matching your current filter criteria." />
                  </td>
                </tr>
              ) : filtered.map(o => {
                const customer = customers.find(c => c.id === o.customerId);
                const fabric = fabrics.find(f => f.id === o.fabricId);
                return (
                  <tr key={o.id} className="hover:bg-amber-500/[0.03] transition-colors group">
                    <td className="px-10 py-6 text-slate-600 font-mono text-xs font-bold tracking-tighter">#{String(o.id).padStart(4, '0')}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-black text-sm shadow-inner group-hover:border-amber-500/20 transition-all">
                          {customer?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-black text-sm tracking-wide">{customer?.name}</p>
                          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-0.5 opacity-80">{customer?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold text-sm tracking-tight">{o.clothingType}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="px-2.5 py-1 bg-slate-900 text-amber-500 text-[10px] font-black rounded-lg border border-slate-700/50 uppercase tracking-widest">
                            {o.isCustomSize ? 'Bespoke' : `Size ${o.size}`}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm">PKR {o.price?.toLocaleString()}</span>
                        {o.advancePaid > 0 && (
                          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mt-1.5 opacity-80">Adv: PKR {o.advancePaid?.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2.5 text-slate-400 bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-800/50 w-fit">
                        <Clock size={14} className="text-amber-500/60" />
                        <span className="text-xs font-black text-slate-300 tracking-tighter">{o.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="relative inline-block group/select">
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          className="appearance-none bg-slate-900/60 border border-slate-700/50 rounded-2xl px-5 py-2.5 pr-12 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 focus:outline-none focus:border-amber-500/50 focus:ring-8 focus:ring-amber-500/5 cursor-pointer transition-all hover:bg-slate-800 hover:border-slate-600 shadow-sm"
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none group-hover/select:text-amber-500 transition-colors" />
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => openEdit(o)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-amber-500/5">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteId(o.id)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/5">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commission Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Modify Active Commission' : 'Initialize New Commission'} size="lg">
        <form onSubmit={handleSubmit} className="p-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <FormInput label="Assign Client *" id="customerId" as="select" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} required>
                <option value="">Search internal client records...</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </FormInput>
            </div>
            
            <FormInput label="Garment Classification *" id="clothingType" as="select" value={form.clothingType} onChange={e => setForm({ ...form, clothingType: e.target.value })}>
              {CLOTHING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </FormInput>
            
            <FormInput label="Fabric Inventory" id="fabricId" as="select" value={form.fabricId} onChange={e => setForm({ ...form, fabricId: e.target.value })}>
              <option value="">Client's Personal Material</option>
              {fabrics.map(f => <option key={f.id} value={f.id}>{f.name} ({f.color}) — {f.quantity}m left</option>)}
            </FormInput>

            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Size Specification</label>
              <div className="relative">
                <select
                  value={form.isCustomSize ? 'custom' : form.size}
                  onChange={e => {
                    if (e.target.value === 'custom') setForm({ ...form, isCustomSize: true, size: 'Custom' });
                    else setForm({ ...form, isCustomSize: false, size: e.target.value });
                  }}
                  className="w-full bg-slate-900/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all appearance-none cursor-pointer"
                >
                  {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="custom">Bespoke Anatomy / Tailored</option>
                </select>
                <ChevronDown size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>

            <FormInput label="Project Deadline *" id="dueDate" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} required />
            
            <div className="relative group">
              <FormInput label="Contract Value (PKR) *" id="price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" required />
              <div className="absolute right-5 bottom-4 text-slate-500 font-black text-[10px] tracking-widest group-focus-within:text-amber-500 transition-colors bg-slate-900/60 px-2 py-0.5 rounded-md">PKR</div>
            </div>

            <div className="relative group">
              <FormInput label="Retainer Payment (PKR)" id="advancePaid" type="number" value={form.advancePaid} onChange={e => setForm({ ...form, advancePaid: e.target.value })} placeholder="0.00" />
              <div className="absolute right-5 bottom-4 text-slate-500 font-black text-[10px] tracking-widest group-focus-within:text-amber-500 transition-colors bg-slate-900/60 px-2 py-0.5 rounded-md">PKR</div>
            </div>
            
            <div className="md:col-span-2">
              <FormInput label="Technical Notes" id="notes" as="textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Enter specific detailing requirements, embroidery instructions, or fitting preferences..." />
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={closeModal} className="flex-1">Discard Draft</Btn>
            <Btn type="submit" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/5">
              {editingId ? 'Seal Modifications' : 'Initialize Commission'}
            </Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Purge Record" message="Are you certain you wish to permanently decommission this order? This action will remove the commission from all active ledgers." />
    </div>
  );
}
