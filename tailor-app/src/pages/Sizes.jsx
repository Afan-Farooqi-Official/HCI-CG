import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2, Pencil, Shirt, Ruler, Settings, ChevronRight, Hash } from 'lucide-react';
import { addSizeRow, updateSizeRow, deleteSizeRow, addClothingType, deleteClothingType } from '../store/slices/sizesSlice';
import { Modal, Btn, FormInput, ConfirmDialog, EmptyState } from '../components/ui';

const EMPTY_ROW = { size: '', chest: '', waist: '', hips: '', shoulder: '' };

export default function Sizes() {
  const { charts } = useSelector(s => s.sizes);
  const dispatch = useDispatch();
  const clothingTypes = Object.keys(charts);
  const [activeType, setActiveType] = useState(clothingTypes[0] || '');
  const [rowModal, setRowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [rowForm, setRowForm] = useState(EMPTY_ROW);
  const [newTypeModal, setNewTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [deleteRowIdx, setDeleteRowIdx] = useState(null);
  const [deleteTypeConfirm, setDeleteTypeConfirm] = useState(false);

  const currentSizes = charts[activeType] || [];

  const openAddRow = () => { setRowForm(EMPTY_ROW); setEditIndex(null); setRowModal(true); };
  const openEditRow = (row, idx) => { setRowForm(row); setEditIndex(idx); setRowModal(true); };

  const handleRowSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) dispatch(updateSizeRow({ clothingType: activeType, index: editIndex, sizeRow: rowForm }));
    else dispatch(addSizeRow({ clothingType: activeType, sizeRow: rowForm }));
    setRowModal(false);
  };

  const handleAddType = (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    dispatch(addClothingType(newTypeName.trim()));
    setActiveType(newTypeName.trim());
    setNewTypeName('');
    setNewTypeModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 fade-in pb-20">
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 bg-slate-900/40 p-10 rounded-[2.5rem] border border-slate-800 backdrop-blur-xl premium-border">
        <div>
          <h2 className="text-4xl font-black text-white font-[Outfit] tracking-tighter">Anatomical Standards</h2>
          <p className="text-slate-400 mt-2 text-sm font-medium">Coordinate your workshop's <span className="text-amber-500 font-bold">bespoke size charts</span> and garment specifications.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap bg-slate-950/80 p-1.5 rounded-2xl border border-slate-700/30 backdrop-blur-md gap-1">
            {clothingTypes.map(type => (
              <button key={type} onClick={() => setActiveType(type)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all ${activeType === type ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20' : 'text-slate-500 hover:text-slate-300'}`}>
                {type}
              </button>
            ))}
            <button onClick={() => setNewTypeModal(true)}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-slate-500 hover:text-amber-500 hover:bg-amber-500/5 transition-all flex items-center gap-2 ml-1 border border-dashed border-slate-700/50 tracking-widest uppercase">
              <Plus size={16} /> New Class
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Left Sidebar: Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="glass-card rounded-[2.5rem] p-10 premium-border relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-700 transform rotate-12 scale-150"><Settings size={120} /></div>
            <h3 className="text-xl font-black text-white mb-8 font-[Outfit] flex items-center gap-4 tracking-tight">
              <Settings size={22} className="text-amber-500/80" /> Management
            </h3>
            <div className="space-y-5">
              <Btn onClick={openAddRow} variant="primary" className="w-full justify-center py-5 rounded-2xl shadow-2xl shadow-amber-500/10 group-hover:scale-[1.02] transition-transform">
                <Plus size={20} /> Append Variation
              </Btn>
              <Btn variant="ghost" onClick={() => setDeleteTypeConfirm(true)} className="w-full justify-center py-5 rounded-2xl border border-red-500/10 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 transition-all font-black uppercase text-[10px] tracking-widest">
                <Trash2 size={18} className="mr-2" /> Terminate Class
              </Btn>
            </div>
            
            <div className="mt-10 p-8 bg-amber-500/5 border border-amber-500/10 rounded-3xl">
              <div className="flex gap-4 mb-4 text-amber-500/70">
                <Ruler size={24} />
                <span className="text-[11px] font-black uppercase tracking-[0.25em]">Global Metric</span>
              </div>
              <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80">
                All measurements are strictly indexed in <span className="text-slate-300">Imperial Units (Inches)</span> to ensure precision mapping.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-[2.5rem] p-10 premium-border flex flex-col items-center text-center group">
            <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-amber-500 border border-slate-800 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
              <Hash size={32} />
            </div>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Archive Volume</p>
            <p className="text-3xl font-black text-white font-[Outfit] tracking-tighter">{currentSizes.length} Specifications</p>
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3">
          {!activeType ? (
            <div className="glass-card rounded-[2.5rem] p-32 premium-border scale-in">
              <EmptyState icon={Shirt} message="Initialize a garment classification to begin coordinate mapping." />
              <div className="mt-10 flex justify-center">
                <Btn onClick={() => setNewTypeModal(true)} size="lg" className="rounded-2xl shadow-xl shadow-amber-500/10"><Plus size={20} /> Register Primary Category</Btn>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-[2.5rem] overflow-hidden premium-border shadow-2xl h-full scale-in">
              <div className="px-12 py-10 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-black text-white font-[Outfit] tracking-tighter">{activeType} Chart</h3>
                  <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] mt-2 opacity-70 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Metric: Imperial (Inches)
                  </p>
                </div>
                <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/5">
                  Synchronized
                </div>
              </div>
              
              <div className="overflow-x-auto custom-scrollbar">
                {currentSizes.length === 0 ? (
                  <div className="py-32 text-center">
                    <EmptyState icon={Trash2} message="Zero coordinate points recorded for this classification archive." />
                    <Btn onClick={openAddRow} variant="ghost" className="mt-10 mx-auto uppercase text-[10px] tracking-[0.3em] font-black">Populate Archive</Btn>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-slate-500 uppercase tracking-[0.2em] text-[10px] font-black border-b border-slate-800 bg-slate-900/40">
                        <th className="px-12 py-8">Designation</th>
                        <th className="px-10 py-8">Chest</th>
                        <th className="px-10 py-8">Waist</th>
                        <th className="px-10 py-8">Hips</th>
                        <th className="px-10 py-8">Shoulder</th>
                        <th className="px-12 py-8 text-right">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/40">
                      {currentSizes.map((row, idx) => (
                        <tr key={idx} className="hover:bg-amber-500/[0.03] transition-all group">
                          <td className="px-12 py-7">
                            <span className="bg-slate-900 text-amber-500 border border-amber-500/20 px-5 py-2.5 rounded-[1rem] text-[11px] font-black tracking-[0.15em] uppercase shadow-inner group-hover:border-amber-500/40 transition-colors">
                              {row.size}
                            </span>
                          </td>
                          <td className="px-10 py-7 text-slate-200 font-black text-base tracking-tighter opacity-90">{row.chest}<span className="text-[10px] ml-1 text-slate-600">IN</span></td>
                          <td className="px-10 py-7 text-slate-200 font-black text-base tracking-tighter opacity-90">{row.waist}<span className="text-[10px] ml-1 text-slate-600">IN</span></td>
                          <td className="px-10 py-7 text-slate-200 font-black text-base tracking-tighter opacity-90">{row.hips}<span className="text-[10px] ml-1 text-slate-600">IN</span></td>
                          <td className="px-10 py-7 text-slate-200 font-black text-base tracking-tighter opacity-90">{row.shoulder}<span className="text-[10px] ml-1 text-slate-600">IN</span></td>
                          <td className="px-12 py-7 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                              <button onClick={() => openEditRow(row, idx)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-amber-500/5">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => setDeleteRowIdx(idx)} className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/20 rounded-xl flex items-center justify-center transition-all shadow-lg hover:shadow-red-500/5">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Row Modal */}
      <Modal isOpen={rowModal} onClose={() => setRowModal(false)} title={editIndex !== null ? 'Modify Anatomy Standard' : `Coordinate Map: ${activeType}`} size="lg">
        <form onSubmit={handleRowSubmit} className="p-4 space-y-10">
          <FormInput label="Size Designation *" id="sizeLabel" value={rowForm.size} onChange={e => setRowForm({ ...rowForm, size: e.target.value })} placeholder="XL, Bespoke-2024, etc." required />
          <div className="grid grid-cols-2 gap-8">
            <FormInput label="Chest Index (in) *" id="chest" value={rowForm.chest} onChange={e => setRowForm({ ...rowForm, chest: e.target.value })} placeholder="38.5" required />
            <FormInput label="Waist Index (in) *" id="waist" value={rowForm.waist} onChange={e => setRowForm({ ...rowForm, waist: e.target.value })} placeholder="32.0" required />
            <FormInput label="Hips Index (in) *" id="hips" value={rowForm.hips} onChange={e => setRowForm({ ...rowForm, hips: e.target.value })} placeholder="40.2" required />
            <FormInput label="Shoulder Span (in) *" id="shoulder" value={rowForm.shoulder} onChange={e => setRowForm({ ...rowForm, shoulder: e.target.value })} placeholder="17.5" required />
          </div>
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={() => setRowModal(false)} className="flex-1">Discard Draft</Btn>
            <Btn type="submit" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/10">
              {editIndex !== null ? 'Seal Modifications' : 'Initialize Standard'}
            </Btn>
          </div>
        </form>
      </Modal>

      {/* New Type Modal */}
      <Modal isOpen={newTypeModal} onClose={() => setNewTypeModal(false)} title="Initialize Garment Class" size="sm">
        <form onSubmit={handleAddType} className="p-4 space-y-8">
          <FormInput label="Class Identity *" id="typeName" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} placeholder="e.g. Traditional Bridal" required />
          <div className="flex items-center gap-6 pt-8 border-t border-slate-800/60">
            <Btn type="button" variant="ghost" onClick={() => setNewTypeModal(false)} className="flex-1">Cancel</Btn>
            <Btn type="submit" className="flex-[2] rounded-2xl shadow-xl shadow-amber-500/10">Register Archive</Btn>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={deleteRowIdx !== null} onClose={() => setDeleteRowIdx(null)} onConfirm={() => { dispatch(deleteSizeRow({ clothingType: activeType, index: deleteRowIdx })); setDeleteRowIdx(null); }} title="Purge Record" message="Are you certain you wish to permanently dismantle this anatomical variation from the category ledger?" />
      <ConfirmDialog isOpen={deleteTypeConfirm} onClose={() => setDeleteTypeConfirm(false)} onConfirm={() => { dispatch(deleteClothingType(activeType)); setActiveType(clothingTypes.find(t => t !== activeType) || ''); setDeleteTypeConfirm(false); }} title="Class Termination" message={`Are you certain you wish to dismantle the entire "${activeType}" classification? All coordinate mapping data within will be permanently purged.`} />
    </div>
  );
}
