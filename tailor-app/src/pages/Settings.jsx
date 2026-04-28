import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Settings as SettingsIcon, Save, Store, DollarSign, Ruler, ShieldCheck, Cpu } from 'lucide-react';
import { updateSettings } from '../store/slices/settingsSlice';
import { Btn, FormInput } from '../components/ui';

export default function Settings() {
  const settings = useSelector(s => s.settings);
  const dispatch = useDispatch();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    dispatch(updateSettings(form));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">System Configuration</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Configure and calibrate your atelier's <span className="text-amber-500 font-bold">operational framework</span>.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Shop Info */}
          <div className="glass-card rounded-[2.5rem] p-10 premium-border relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><Store size={120} /></div>
            <h3 className="text-2xl font-black text-white mb-10 font-[Outfit] flex items-center gap-4 tracking-tight">
              <Store size={26} className="text-amber-500/80" /> Atelier Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <FormInput label="Establishment Name *" id="shopName" value={form.shopName} onChange={e => setForm({ ...form, shopName: e.target.value })} placeholder="Royal Stitch Tailors" required />
              </div>
              <FormInput label="Contact Terminal *" id="sPhone" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+92 42 3571234" required />
              <FormInput label="Official Correspondence" id="sEmail" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="atelier@tailor.com" />
              <div className="md:col-span-2">
                <FormInput label="Physical Headquarters" id="sAddress" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="12 Fashion Row, Heritage District, Lahore" />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="glass-card rounded-[2.5rem] p-10 premium-border relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><DollarSign size={120} /></div>
            <h3 className="text-2xl font-black text-white mb-10 font-[Outfit] flex items-center gap-4 tracking-tight">
              <DollarSign size={26} className="text-amber-500/80" /> Operational Protocol
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <FormInput label="Primary Currency" id="currency" as="select" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                <option value="PKR">PKR — Pakistani Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="SAR">SAR — Saudi Riyal</option>
              </FormInput>
              
              <div className="relative group">
                <FormInput label="Fiscal Tax Rate (%)" id="taxRate" type="number" step="0.5" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: Number(e.target.value) })} placeholder="0.0" />
                <div className="absolute right-5 bottom-4 text-slate-500 font-black text-[10px] tracking-widest group-focus-within:text-amber-500 transition-colors bg-slate-900/60 px-2 py-0.5 rounded-md">%</div>
              </div>
              
              <div className="md:col-span-2 space-y-4">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1 block opacity-80">Universal Measurement Standard</label>
                <div className="flex bg-slate-950/80 p-2 rounded-[1.5rem] border border-slate-800 backdrop-blur-md gap-2">
                  {[['in', 'Imperial (Inches)'], ['cm', 'Metric (Centimeters)']].map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setForm({ ...form, unit: value })}
                      className={`flex-1 py-4 rounded-xl text-xs font-black tracking-widest transition-all ${form.unit === value ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Metadata */}
          <div className="glass-card rounded-[2.5rem] p-10 premium-border relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><Cpu size={120} /></div>
            <h3 className="text-xl font-black text-white mb-8 font-[Outfit] flex items-center gap-4 tracking-tight">
              <Cpu size={22} className="text-amber-500/80" /> System Metrics
            </h3>
            <div className="space-y-5">
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between group/item hover:bg-slate-900/80 transition-colors">
                <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest opacity-70">Version</span>
                <span className="text-white font-black font-mono text-xs px-3 py-1 bg-slate-950/60 rounded-lg border border-slate-800 shadow-inner tracking-tighter">v1.2.0-ELITE</span>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between group/item hover:bg-slate-900/80 transition-colors">
                <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest opacity-70">Architecture</span>
                <span className="text-slate-200 font-black text-[11px] uppercase tracking-widest">React 19.x</span>
              </div>
              <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between group/item hover:bg-slate-900/80 transition-colors">
                <span className="text-slate-500 text-[11px] font-black uppercase tracking-widest opacity-70">Security</span>
                <span className="text-emerald-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-3 py-1 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                  <ShieldCheck size={16} /> Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="sticky top-10">
            <Btn type="submit" size="lg" className={`w-full py-6 rounded-[2rem] shadow-2xl transition-all duration-1000 ${saved ? 'bg-emerald-500 hover:bg-emerald-500 scale-105 shadow-emerald-500/20' : 'shadow-amber-500/10'}`}>
              {saved ? (
                <span className="flex items-center gap-3 font-black uppercase tracking-widest">✓ Protocols Synchronized</span>
              ) : (
                <span className="flex items-center gap-3 font-black uppercase tracking-widest"><Save size={20} /> Seal Configuration</span>
              )}
            </Btn>
            <p className="text-center text-slate-500 text-[11px] uppercase font-black tracking-[0.3em] mt-6 opacity-40 animate-pulse">Authorized Atelier Personnel Only</p>
          </div>
        </div>
      </form>
    </div>
  );
}
