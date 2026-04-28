import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { Plus, Receipt, CheckCircle, Printer, Search, X, TrendingUp, ShieldAlert, CreditCard, ChevronRight } from 'lucide-react';
import { addInvoice, markAsPaid, deleteInvoice } from '../store/slices/invoicesSlice';
import { Modal, Btn, FormInput, EmptyState, ConfirmDialog, Badge } from '../components/ui';

export default function Billing() {
  const { search } = useOutletContext();
  const invoices = useSelector(s => s.invoices.list);
  const orders = useSelector(s => s.orders.list);
  const customers = useSelector(s => s.customers.list);
  const dispatch = useDispatch();

  const [tab, setTab] = useState('All');
  const [viewId, setViewId] = useState(null);
  const [newModal, setNewModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [newForm, setNewForm] = useState({ orderId: '', discount: 0, taxRate: 0 });

  const filtered = invoices.filter(inv => {
    const customer = customers.find(c => c.id === inv.customerId);
    const matchSearch = !search || customer?.name.toLowerCase().includes(search.toLowerCase());
    const matchTab = tab === 'All' || inv.status === tab;
    return matchSearch && matchTab;
  });

  const tabCounts = {
    All: invoices.length,
    Paid: invoices.filter(i => i.status === 'Paid').length,
    Unpaid: invoices.filter(i => i.status === 'Unpaid').length,
    Overdue: invoices.filter(i => i.status === 'Overdue').length,
  };

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + (i.total - i.paid), 0);

  const uninvoicedOrders = orders.filter(o => !invoices.find(inv => inv.orderId === o.id));

  const generateInvoice = (e) => {
    e.preventDefault();
    const order = orders.find(o => o.id === Number(newForm.orderId));
    if (!order) return;
    const subtotal = order.price;
    const discount = Number(newForm.discount) || 0;
    const taxRate = Number(newForm.taxRate) || 0;
    const total = subtotal - discount + Math.round(subtotal * taxRate / 100);
    dispatch(addInvoice({
      orderId: order.id,
      customerId: order.customerId,
      items: [{ description: `${order.clothingType} (Size: ${order.size})`, qty: 1, rate: order.price, amount: order.price }],
      subtotal, discount, tax: Math.round(subtotal * taxRate / 100), total,
      paid: order.advancePaid || 0,
      status: order.advancePaid >= total ? 'Paid' : 'Unpaid',
      issuedDate: new Date().toISOString().split('T')[0],
      dueDate: order.dueDate,
    }));
    setNewModal(false);
    setNewForm({ orderId: '', discount: 0, taxRate: 0 });
  };

  const viewInvoice = invoices.find(i => i.id === viewId);
  const viewCustomer = viewInvoice ? customers.find(c => c.id === viewInvoice.customerId) : null;

  return (
    <div className="space-y-12 fade-in pb-20">
      {/* Header & High-Level Stats */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Financial Ledger</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Audit, invoice, and revenue tracking system for <span className="text-amber-500 font-bold">Royal Stitch</span>.</p>
        </div>
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-wrap bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700/30 backdrop-blur-md gap-1">
            {['All', 'Paid', 'Unpaid', 'Overdue'].map(s => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${tab === s ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                {s}
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${tab === s ? 'bg-slate-950/20 text-slate-900' : 'bg-slate-800 text-slate-500'}`}>
                  {tabCounts[s]}
                </span>
              </button>
            ))}
          </div>
          <Btn onClick={() => setNewModal(true)} size="lg" className="rounded-2xl shadow-2xl shadow-amber-500/10">
            <Plus size={20} /> Authorize Issuance
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 section-spacing">
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-xl shadow-emerald-500/5">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Settled Revenue</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">PKR {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className="w-16 h-16 bg-orange-500/10 rounded-3xl flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-xl shadow-orange-500/5">
            <ShieldAlert size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Outstanding Debt</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">PKR {totalPending.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card rounded-[2.5rem] p-10 premium-border flex items-center gap-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-xl shadow-amber-500/5">
            <CreditCard size={32} />
          </div>
          <div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2">Total Issuances</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">{invoices.length} Documents</p>
          </div>
        </div>
      </div>

      {/* Invoice Ledger Table */}
      <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border shadow-2xl scale-in">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-800 bg-slate-900/40">
                <th className="px-10 py-8">Ledger Reference</th>
                <th className="px-10 py-8">Account Holder</th>
                <th className="px-10 py-8">Audit Timeline</th>
                <th className="px-10 py-8">Financial Value</th>
                <th className="px-10 py-8">Status</th>
                <th className="px-10 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-10 py-32">
                    <EmptyState icon={Receipt} message="No financial records detected matching current audit filters." />
                  </td>
                </tr>
              ) : filtered.map(inv => {
                const customer = customers.find(c => c.id === inv.customerId);
                const balance = inv.total - inv.paid;
                return (
                  <tr key={inv.id} className="hover:bg-amber-500/[0.03] transition-colors group">
                    <td className="px-10 py-6 text-slate-600 font-mono text-xs font-bold tracking-tighter">INV-{String(inv.id).padStart(4, '0')}</td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 font-black text-sm uppercase shadow-inner group-hover:border-amber-500/20 transition-all">
                          {customer?.name.slice(0, 2)}
                        </div>
                        <span className="text-white font-black text-sm tracking-wide">{customer?.name}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-bold text-xs tracking-tight">Issued: {inv.issuedDate}</span>
                        <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] mt-1.5 opacity-80">Deadline: {inv.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-sm tracking-tight">PKR {inv.total?.toLocaleString()}</span>
                        {balance > 0 ? (
                          <span className="text-red-500 font-black text-[10px] uppercase tracking-widest mt-1.5 opacity-80">Bal: PKR {balance.toLocaleString()}</span>
                        ) : (
                          <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest mt-1.5 opacity-80">Settled Full</span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <Badge status={inv.status} />
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <button onClick={() => setViewId(inv.id)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-amber-500/5" title="View Document">
                          <Receipt size={16} />
                        </button>
                        {inv.status !== 'Paid' && (
                          <button onClick={() => dispatch(markAsPaid(inv.id))} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-emerald-500/5" title="Authorize Clearance">
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button onClick={() => setDeleteId(inv.id)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/5" title="Void Transaction">
                          <X size={16} />
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

      {/* Invoice View Modal */}
      <Modal isOpen={!!viewId} onClose={() => setViewId(null)} title={`Ledger Entry INV-${String(viewId).padStart(4, '0')}`} size="lg">
        {viewInvoice && viewCustomer && (
          <div className="p-4 space-y-10">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-10 bg-slate-950/40 p-10 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-xl">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.3)] flex items-center justify-center text-slate-950">
                    <Receipt size={28} />
                  </div>
                  <h4 className="text-3xl font-black text-white font-[Outfit] tracking-tighter">Royal Stitch</h4>
                </div>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] leading-loose opacity-80">
                  12 Fashion Row, Heritage District<br />Lahore, Pakistan<br />+92 42 3571234
                </p>
              </div>
              <div className="text-right sm:mt-2">
                <p className="text-amber-500 font-black text-[11px] uppercase tracking-[0.3em] mb-4">Invoice Metadata</p>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm font-bold">Serial No: <span className="text-white font-mono font-black text-base tracking-tighter">#{String(viewInvoice.id).padStart(4,'0')}</span></p>
                  <p className="text-slate-400 text-sm font-bold">Issued: <span className="text-white font-black tracking-tight">{viewInvoice.issuedDate}</span></p>
                  <p className="text-red-400 font-black uppercase text-[10px] tracking-[0.2em] mt-3 inline-block px-3 py-1 bg-red-400/5 border border-red-400/10 rounded-lg">Deadline: {viewInvoice.dueDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-1">
              <div className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12"><Receipt size={120} /></div>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Remit To Account</p>
                <p className="text-2xl font-black text-white mb-2 font-[Outfit] tracking-tight group-hover:text-amber-400 transition-colors">{viewCustomer.name}</p>
                <p className="text-slate-400 text-sm font-bold tracking-tight mb-4">{viewCustomer.phone}</p>
                <div className="h-px w-10 bg-amber-500/30 mb-4" />
                <p className="text-slate-500 text-xs font-medium leading-relaxed italic">{viewCustomer.address || 'Standard Workshop Pickup Protocol'}</p>
              </div>
              <div className="p-10 bg-slate-900 border border-slate-800 rounded-[2.5rem] flex flex-col justify-center items-center text-center group">
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Settlement Status</p>
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  <Badge status={viewInvoice.status} />
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/20">
              <table className="w-full text-sm">
                <thead><tr className="bg-slate-900/50 text-slate-500 border-b border-slate-800 text-left uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="px-8 py-6">Commission Specification</th>
                  <th className="px-8 py-6">Units</th>
                  <th className="px-8 py-6">Unit Rate</th>
                  <th className="px-8 py-6 text-right">Aggregate</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-800/50">
                  {viewInvoice.items?.map((item, i) => (
                    <tr key={i} className="text-slate-300 group/row hover:bg-slate-900/30 transition-colors">
                      <td className="px-8 py-6 font-black text-slate-200 tracking-tight">{item.description}</td>
                      <td className="px-8 py-6 text-slate-500 font-bold">{item.qty} QTY</td>
                      <td className="px-8 py-6 text-slate-500 font-bold">PKR {item.rate?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right font-black text-white text-lg tracking-tighter">PKR {item.amount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col items-end gap-4 px-6">
              <div className="flex justify-between w-full max-w-[320px] group">
                <span className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-slate-400 transition-colors">Gross Subtotal</span>
                <span className="text-white font-black text-sm">PKR {viewInvoice.subtotal?.toLocaleString()}</span>
              </div>
              {viewInvoice.discount > 0 && (
                <div className="flex justify-between w-full max-w-[320px] text-emerald-500 font-black text-[11px] uppercase tracking-[0.2em] italic bg-emerald-500/5 px-4 py-2 rounded-xl border border-emerald-500/10">
                  <span>Rebate Applied</span>
                  <span>- PKR {viewInvoice.discount?.toLocaleString()}</span>
                </div>
              )}
              {viewInvoice.tax > 0 && (
                <div className="flex justify-between w-full max-w-[320px] text-slate-500 text-[11px] font-black uppercase tracking-[0.2em]">
                  <span>Fiscal Levy</span>
                  <span>PKR {viewInvoice.tax?.toLocaleString()}</span>
                </div>
              )}
              <div className="w-full max-w-[320px] h-px bg-slate-800/80 my-2"></div>
              <div className="flex justify-between w-full max-w-[320px] items-end">
                <span className="text-amber-500 text-xs font-black uppercase tracking-[0.3em] mb-1.5">Total Liability</span>
                <span className="text-amber-500 font-black text-4xl font-[Outfit] tracking-tighter leading-none">PKR {viewInvoice.total?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[320px] text-emerald-500/80 font-black text-[10px] uppercase tracking-[0.2em] mt-2 border-t border-slate-800/40 pt-4">
                <span>Retainer Credit</span>
                <span>PKR {viewInvoice.paid?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between w-full max-w-[320px] font-black text-xs uppercase tracking-[0.2em] text-red-500/90 pt-1">
                <span>Residual Balance</span>
                <span className="text-xl text-red-500 tracking-tighter font-black">PKR {(viewInvoice.total - viewInvoice.paid).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t border-slate-800/60">
              <Btn variant="secondary" onClick={() => window.print()} size="lg" className="flex-1 rounded-2xl py-5">
                <Printer size={20} /> Execute Print Protocol
              </Btn>
              {viewInvoice.status !== 'Paid' && (
                <Btn onClick={() => { dispatch(markAsPaid(viewInvoice.id)); setViewId(null); }} size="lg" className="flex-1 rounded-2xl py-5 shadow-2xl shadow-amber-500/20">
                  <CheckCircle size={20} /> Authorize Final Clearance
                </Btn>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* New Invoice Modal */}
      <Modal isOpen={newModal} onClose={() => setNewModal(false)} title="Financial Issuance" size="sm">
        <form onSubmit={generateInvoice} className="p-4 space-y-8">
          <FormInput label="Link Active Commission *" id="orderId" as="select" value={newForm.orderId} onChange={e => setNewForm({ ...newForm, orderId: e.target.value })} required>
            <option value="">Awaiting commission selection...</option>
            {uninvoicedOrders.map(o => {
              const c = customers.find(cu => cu.id === o.customerId);
              return <option key={o.id} value={o.id}>{c?.name} — {o.clothingType} (PKR {o.price?.toLocaleString()})</option>;
            })}
          </FormInput>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormInput label="Direct Rebate (PKR)" id="discount" type="number" value={newForm.discount} onChange={e => setNewForm({ ...newForm, discount: e.target.value })} placeholder="0.00" />
            <FormInput label="Tax Valuation (%)" id="taxRate" type="number" step="0.5" value={newForm.taxRate} onChange={e => setNewForm({ ...newForm, taxRate: e.target.value })} placeholder="0.0" />
          </div>

          <div className="bg-amber-500/5 border border-amber-500/10 rounded-[2rem] p-10 mt-10">
            <div className="flex flex-col gap-6 items-center text-center">
              <ShieldAlert size={48} className="text-amber-500/40" />
              <p className="text-slate-400 text-xs leading-relaxed uppercase tracking-[0.2em] font-black opacity-60">
                Confirming this action will generate a formal financial record. Advance payments will be deducted automatically from the gross total.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={() => setNewModal(false)} className="flex-1">Discard Draft</Btn>
            <Btn type="submit" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/10">Authorize Issuance</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { dispatch(deleteInvoice(deleteId)); setDeleteId(null); }} title="Void Invoice" message="Are you certain you wish to void this financial record? This action will permanently remove the audit trail for this specific issuance." />
    </div>
  );
}
