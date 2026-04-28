import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Ruler, Save, User, Info, CheckCircle } from 'lucide-react';
import { updateMeasurements } from '../store/slices/measurementsSlice';
import { Btn, FormInput } from '../components/ui';

export default function Measurements() {
  const customers = useSelector(s => s.customers.list);
  const measurements = useSelector(s => s.measurements.list);
  const dispatch = useDispatch();

  const [selectedId, setSelectedId] = useState('');
  const [unit, setUnit] = useState('in');
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);

  const fields = [
    { key: 'chest', label: 'Chest', cat: 'Anatomy - Upper Body' },
    { key: 'waist', label: 'Waist', cat: 'Anatomy - Upper Body' },
    { key: 'shoulder', label: 'Shoulder', cat: 'Anatomy - Upper Body' },
    { key: 'neck', label: 'Neck', cat: 'Anatomy - Upper Body' },
    { key: 'sleeve', label: 'Sleeve', cat: 'Anatomy - Upper Body' },
    { key: 'hips', label: 'Hips', cat: 'Anatomy - Lower Body' },
    { key: 'thigh', label: 'Thigh', cat: 'Anatomy - Lower Body' },
    { key: 'inseam', label: 'Inseam', cat: 'Anatomy - Lower Body' },
    { key: 'height', label: 'Height', cat: 'Physical Profile' },
    { key: 'weight', label: 'Weight', cat: 'Physical Profile', unit: 'kg' },
  ];

  const handleSelect = (id) => {
    const cid = Number(id);
    setSelectedId(id);
    const m = measurements.find(m => m.customerId === cid);
    if (m) {
      setForm({ ...m.values });
      setUnit(m.unit);
    } else {
      setForm({});
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedId) return;
    dispatch(updateMeasurements({
      customerId: Number(selectedId),
      unit,
      values: form,
      date: new Date().toISOString().split('T')[0]
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const categories = [...new Set(fields.map(f => f.cat))];

  return (
    <div className="max-w-7xl mx-auto space-y-12 fade-in pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div className="flex items-center gap-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl shadow-amber-500/5">
            <Ruler size={32} />
          </div>
          <div>
            <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Anatomical Diagnostics</h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">Precision mapping for <span className="text-amber-500 font-bold">bespoke tailoring</span> protocols.</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex bg-slate-950/80 p-2 rounded-2xl border border-slate-700/30 backdrop-blur-md gap-1">
            {['in', 'cm'].map(u => (
              <button key={u} onClick={() => setUnit(u)}
                className={`px-8 py-3 rounded-xl text-xs font-black tracking-[0.2em] transition-all whitespace-nowrap ${unit === u ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Customer Selector */}
        <div className="xl:col-span-4">
          <div className="glass-card rounded-[2.5rem] p-10 premium-border sticky top-10 overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><User size={120} /></div>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                <User size={24} />
              </div>
              <h3 className="text-2xl font-black text-white font-[Outfit] tracking-tighter">Client Focus</h3>
            </div>
            
            <div className="space-y-8">
              <FormInput label="Search Client Database" id="customerId" as="select" value={selectedId} onChange={e => handleSelect(e.target.value)}>
                <option value="">-- Choose a record --</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>)}
              </FormInput>
              
              {!selectedId && (
                <div className="bg-slate-950/50 border border-slate-800/60 rounded-3xl p-10 mt-10 relative overflow-hidden">
                  <div className="flex flex-col gap-6 items-center text-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-inner">
                      <Info size={32} className="text-amber-500/40" />
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed font-black uppercase tracking-[0.2em] opacity-80">
                      Identify a client to initialize diagnostic mapping. Records are archived automatically for precision drafting.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Measurement Grid */}
        <div className="xl:col-span-8">
          {selectedId ? (
            <form onSubmit={handleSave} className="space-y-10 scale-in">
              {categories.map(cat => (
                <div key={cat} className="glass-card rounded-[2.5rem] p-10 premium-border hover:border-amber-500/20 transition-all duration-500 group/cat">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover/cat:h-10 transition-all" />
                    <h4 className="text-amber-500 font-black text-[11px] uppercase tracking-[0.3em]">{cat}</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {fields.filter(f => f.cat === cat).map(f => (
                      <div key={f.key} className="relative group/field">
                        <FormInput label={f.label} id={f.key} type="number" step="0.1" value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder="0.0" />
                        <span className="absolute right-6 bottom-4 text-[10px] font-black text-slate-600 uppercase tracking-widest pointer-events-none group-focus-within/field:text-amber-500 transition-colors bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800/40">
                          {f.unit || unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-10">
                <Btn type="submit" size="lg" className={`w-full sm:w-auto min-w-[320px] py-6 rounded-[2rem] transition-all duration-1000 shadow-2xl ${saved ? 'bg-emerald-500 hover:bg-emerald-500 scale-105 shadow-emerald-500/20 text-white' : 'shadow-amber-500/10'}`}>
                  {saved ? (
                    <span className="flex items-center gap-4 font-black uppercase tracking-widest"><CheckCircle size={24} /> Record Synchronized</span>
                  ) : (
                    <span className="flex items-center gap-4 font-black uppercase tracking-widest"><Save size={24} /> Commit Anatomical Data</span>
                  )}
                </Btn>
              </div>
            </form>
          ) : (
            <div className="glass-card rounded-[2.5rem] p-32 flex flex-col items-center justify-center text-center h-full min-h-[600px] border border-dashed border-slate-800/60 bg-slate-900/10">
              <div className="w-28 h-28 bg-slate-950/60 rounded-[2.5rem] flex items-center justify-center text-slate-700 mb-10 border border-slate-800 shadow-inner group transition-all">
                <Ruler size={56} className="opacity-30 group-hover:scale-110 transition-transform duration-700" />
              </div>
              <h3 className="text-4xl font-black text-white mb-4 font-[Outfit] tracking-tighter">Awaiting Client Focus</h3>
              <p className="text-slate-500 text-xs max-w-sm leading-relaxed uppercase tracking-[0.3em] font-black opacity-40">
                Initiate anatomical diagnostic protocols by selecting a client record
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
