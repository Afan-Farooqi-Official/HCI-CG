import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Phone, Mail, MapPin, User, ChevronRight } from 'lucide-react';
import { addCustomer, updateCustomer, deleteCustomer } from '../store/slices/customersSlice';
import { Modal, Btn, FormInput, EmptyState, ConfirmDialog, Badge } from '../components/ui';

const EMPTY_FORM = { name: '', phone: '', email: '', address: '', notes: '' };

export default function Customers() {
  const { search } = useOutletContext();
  const customers = useSelector(s => s.customers.list);
  const orders = useSelector(s => s.orders.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(EMPTY_FORM); setEditingId(null); setModalOpen(true); };
  const openEdit = (c) => { setForm(c); setEditingId(c.id); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingId) dispatch(updateCustomer({ ...form, id: editingId }));
    else dispatch(addCustomer(form));
    closeModal();
  };

  const handleDelete = () => {
    dispatch(deleteCustomer(deleteId));
    setDeleteId(null);
  };

  const getOrderCount = (cid) => orders.filter(o => o.customerId === cid).length;

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Client Registry</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Curating <span className="text-amber-500 font-bold">{filtered.length}</span> bespoke tailoring profiles within your database.</p>
        </div>
        <Btn onClick={openAdd} variant="primary" size="lg" className="rounded-2xl shadow-2xl shadow-amber-500/10">
          <Plus size={20} /> Register New Client
        </Btn>
      </div>

      {/* Customer Grid */}
      {filtered.length === 0 ? (
        <EmptyState icon={User} message="No clients detected in the registry. Initiate your first client profile to begin." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 scale-in">
          {filtered.map(c => (
            <div key={c.id}
              className="glass-card rounded-[2.5rem] p-10 cursor-pointer group premium-border relative"
              onClick={() => navigate(`/customers/${c.id}`)}>
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-[1.5rem] flex items-center justify-center text-slate-950 font-black text-2xl shadow-2xl shadow-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-black text-white font-[Outfit] tracking-tight leading-tight group-hover:text-amber-400 transition-colors">{c.name}</p>
                    <p className="text-slate-500 text-[11px] uppercase font-black tracking-[0.2em] mt-2 opacity-80">Member since {c.createdAt}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0" onClick={e => e.stopPropagation()}>
                  <button onClick={() => openEdit(c)} className="w-10 h-10 bg-slate-900/80 hover:bg-amber-500/20 hover:text-amber-400 text-slate-400 rounded-xl flex items-center justify-center transition-all border border-slate-800 shadow-lg">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteId(c.id)} className="w-10 h-10 bg-slate-900/80 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl flex items-center justify-center transition-all border border-slate-800 shadow-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-slate-400 bg-slate-950/40 px-5 py-4 rounded-2xl border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                  <Phone size={16} className="text-amber-500/70" />
                  <span className="text-sm font-bold tracking-tight">{c.phone}</span>
                </div>
                {c.email && (
                  <div className="flex items-center gap-4 text-slate-400 bg-slate-950/40 px-5 py-4 rounded-2xl border border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                    <Mail size={16} className="text-amber-500/70" />
                    <span className="text-sm font-bold truncate">{c.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(getOrderCount(c.id), 3))].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center">
                        <ShoppingBag size={10} className="text-amber-500" />
                      </div>
                    ))}
                  </div>
                  <span className="text-[11px] text-white font-black tracking-[0.2em] uppercase opacity-70">{getOrderCount(c.id)} Commisions</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500 font-black text-[11px] tracking-widest uppercase group-hover:gap-4 transition-all">
                  Inspect <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editingId ? 'Modify Client Profile' : 'Initialize New Registration'} size="lg">
        <form onSubmit={handleSubmit} className="p-2 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormInput label="Full Name *" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Omar Hussain" required className="md:col-span-2" />
            <FormInput label="Phone Number *" id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX" required />
            <FormInput label="Email Address" id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="client@email.com" />
            <FormInput label="Residential Address" id="address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Street, Sector, City" className="md:col-span-2" />
            <FormInput label="Technical Profile Notes" id="notes" as="textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any specific tailoring preferences or fitting requirements..." className="md:col-span-2" />
          </div>
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={closeModal} className="flex-1">Discard</Btn>
            <Btn type="submit" variant="primary" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/10">
              {editingId ? 'Seal Modifications' : 'Commit Registration'}
            </Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} message="Deleting this client will permanently purge their anatomical history and commission logs. This action is irreversible." />
    </div>
  );
}
