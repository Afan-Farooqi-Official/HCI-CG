import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Plus, Pencil, Trash2, Package, AlertTriangle, TrendingUp, Layers, Palette } from 'lucide-react';
import { addFabric, updateFabric, deleteFabric } from '../store/slices/fabricsSlice';
import { Modal, Btn, FormInput, EmptyState, ConfirmDialog, Badge } from '../components/ui';

const FABRIC_TYPES = ['Cotton', 'Silk', 'Wool', 'Linen', 'Chiffon', 'Denim', 'Velvet', 'Polyester', 'Satin', 'Georgette', 'Other'];
const EMPTY = { name: '', type: 'Cotton', color: '', pricePerMeter: '', quantity: '', unit: 'meters', colorCode: '#475569' };

export default function Fabrics() {
  const { search } = useOutletContext();
  const fabrics = useSelector(s => s.fabrics.list);
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = fabrics.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.type.toLowerCase().includes(search.toLowerCase()) ||
    f.color.toLowerCase().includes(search.toLowerCase())
  );

  const lowStock = fabrics.filter(f => parseFloat(f.quantity) < 2);
  const totalValue = fabrics.reduce((sum, f) => sum + (f.pricePerMeter * f.quantity), 0);

  const openAdd = () => { setForm(EMPTY); setEditingId(null); setModalOpen(true); };
  const openEdit = (f) => { setForm(f); setEditingId(f.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form, pricePerMeter: Number(form.pricePerMeter), quantity: Number(form.quantity) };
    if (editingId) dispatch(updateFabric({ ...data, id: editingId }));
    else dispatch(addFabric(data));
    closeModal();
  };

  const handleDelete = () => { dispatch(deleteFabric(deleteId)); setDeleteId(null); };

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Material Repository</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Manage and audit your workshop's <span className="text-amber-500 font-bold">textile inventory</span>.</p>
        </div>
        <Btn onClick={openAdd} variant="primary" size="lg" className="rounded-2xl shadow-2xl shadow-amber-500/10">
          <Plus size={20} /> Initialize Deposit
        </Btn>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 section-spacing">
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-xl shadow-amber-500/5">
            <Layers size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Total Variants</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">{fabrics.length}</p>
          </div>
        </div>
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border transition-all shadow-xl ${lowStock.length > 0 ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5'}`}>
            <AlertTriangle size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Stock Alerts</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">{lowStock.length}</p>
          </div>
        </div>
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Global Valuation</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">PKR {(totalValue/1000).toFixed(1)}k</p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border shadow-2xl scale-in">
        <div className="px-10 py-8 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white font-[Outfit] tracking-tight">Inventory Ledger</h3>
          {lowStock.length > 0 && (
            <div className="flex items-center gap-3 px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-400 uppercase tracking-[0.2em] animate-pulse">
              <AlertTriangle size={14} /> Critically Low Stock Detected
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="py-32">
              <EmptyState icon={Package} message="No materials found within the current inventory ledger." />
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-800 bg-slate-900/40">
                  <th className="px-10 py-8">Material Designation</th>
                  <th className="px-10 py-8">Classification</th>
                  <th className="px-10 py-8">Visual Profile</th>
                  <th className="px-10 py-8">Unit Rate</th>
                  <th className="px-10 py-8">Stock Level</th>
                  <th className="px-10 py-8">Net Value</th>
                  <th className="px-10 py-8 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map(f => {
                  const isLow = parseFloat(f.quantity) < 2;
                  return (
                    <tr key={f.id} className={`hover:bg-amber-500/[0.03] transition-colors group ${isLow ? 'bg-red-500/[0.04]' : ''}`}>
                      <td className="px-10 py-6">
                        <span className="text-white font-black text-sm tracking-wide group-hover:text-amber-400 transition-colors">{f.name}</span>
                      </td>
                      <td className="px-10 py-6">
                        <span className="px-3 py-1 bg-slate-900 text-slate-400 text-[10px] font-black rounded-lg border border-slate-800 uppercase tracking-widest">{f.type}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-xl border border-slate-700 shadow-2xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12"
                            style={{ backgroundColor: f.colorCode || '#475569' }}>
                          </div>
                          <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{f.color}</span>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-amber-500 font-black text-sm tracking-tight">PKR {f.pricePerMeter?.toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border font-black text-[10px] tracking-widest uppercase ${isLow ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                          {f.quantity} m
                          {isLow && <AlertTriangle size={12} className="animate-bounce" />}
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="text-white font-black text-sm tracking-tight">PKR {(f.pricePerMeter * f.quantity).toLocaleString()}</span>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button onClick={() => openEdit(f)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-amber-500/5">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteId(f.id)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/5">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Inventory Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Modify Textile Profile' : 'Initialize New Deposit'} size="lg">
        <form onSubmit={handleSubmit} className="p-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Designation Name *" id="fname" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Italian Silk" required className="md:col-span-2" />
            
            <FormInput label="Classification Type *" id="ftype" as="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              {FABRIC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </FormInput>
            <FormInput label="Visual Color Label" id="fcolor" value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} placeholder="Midnight Blue" />
            
            <div className="relative group">
              <FormInput label="Rate / Meter (PKR) *" id="fprice" type="number" value={form.pricePerMeter} onChange={e => setForm({ ...form, pricePerMeter: e.target.value })} placeholder="0.00" required />
              <div className="absolute right-5 bottom-4 text-slate-500 font-black text-[10px] tracking-widest group-focus-within:text-amber-500 transition-colors bg-slate-900/60 px-2 py-0.5 rounded-md">PKR</div>
            </div>
            
            <div className="relative group">
              <FormInput label="Stock Archive (Meters) *" id="fqty" type="number" step="0.5" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} placeholder="0.00" required />
              <div className="absolute right-5 bottom-4 text-slate-500 font-black text-[10px] tracking-widest group-focus-within:text-amber-500 transition-colors bg-slate-900/60 px-2 py-0.5 rounded-md">M</div>
            </div>
            
            <div className="md:col-span-2 space-y-2.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-1">Visual Color Representation</label>
              <div className="flex gap-4 items-center bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
                <input type="color" value={form.colorCode || '#475569'} onChange={e => setForm({ ...form, colorCode: e.target.value })} className="w-14 h-14 rounded-xl cursor-pointer border-none bg-transparent" />
                <div className="flex-1">
                  <p className="text-white font-black text-sm uppercase tracking-tighter">{form.colorCode || '#475569'}</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Select accurate hex representation</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={closeModal} className="flex-1">Discard</Btn>
            <Btn type="submit" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/10">
              {editingId ? 'Seal Modifications' : 'Commit Deposit'}
            </Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Inventory Deletion" message="Are you certain you wish to purge this material record? This will permanently remove the asset from your workshop's ledger." />
    </div>
  );
}
