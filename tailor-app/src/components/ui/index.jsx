import React from 'react';

// Modal component
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  if (!isOpen) return null;
  const sizes = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className={`relative glass border border-slate-700/50 rounded-3xl shadow-2xl w-full ${sizes[size]} max-h-[92vh] flex flex-col fade-in overflow-hidden premium-border`}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-700/50">
          <h2 className="text-xl font-bold text-white font-[Outfit] tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center transition-all group">
            <span className="group-hover:rotate-90 transition-transform duration-300 text-2xl">×</span>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-8 py-8 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
}

// Badge for status
const badgeColors = {
  'Pending':     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'In Progress': 'bg-blue-500/10  text-blue-400  border-blue-500/20',
  'Ready':       'bg-green-500/10 text-green-400 border-green-500/20',
  'Delivered':   'bg-slate-700/30 text-slate-400 border-slate-600/30',
  'Paid':        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Unpaid':      'bg-orange-500/10  text-orange-400  border-orange-500/20',
  'Overdue':     'bg-red-500/10    text-red-400    border-red-500/20',
};
export function Badge({ status }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${badgeColors[status] || 'bg-slate-700/30 text-slate-400 border-slate-600/30'}`}>
      {status}
    </span>
  );
}

// Stat card for dashboard
export function StatCard({ title, value, subtitle, icon: Icon, color = 'amber', trend }) {
  const colors = {
    amber: 'from-amber-500/10 to-transparent border-amber-500/10 text-amber-500',
    blue:  'from-blue-500/10  to-transparent border-blue-500/10  text-blue-500',
    green: 'from-green-500/10 to-transparent border-green-500/10 text-green-500',
    red:   'from-red-500/10   to-transparent border-red-500/10   text-red-500',
    purple:'from-purple-500/10 to-transparent border-purple-500/10 text-purple-500',
  };
  return (
    <div className={`glass-card rounded-3xl p-6 fade-in flex flex-col justify-between h-full`}>
      <div className="flex items-start justify-between mb-2">
        <div className={`w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700/50 flex items-center justify-center ${colors[color].split(' ')[2]}`}>
          <Icon size={22} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${trend > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest">{title}</p>
        <p className="text-3xl font-bold text-white mt-1 font-[Outfit]">{value}</p>
        {subtitle && <p className="text-xs text-slate-600 mt-2 font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

// Form input
export function FormInput({ label, id, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {label && <label htmlFor={id} className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>}
      {props.as === 'select' ? (
        <select id={id} {...props} as={undefined}
          className="bg-slate-900/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all w-full appearance-none cursor-pointer">
          {props.children}
        </select>
      ) : props.as === 'textarea' ? (
        <textarea id={id} {...props} as={undefined}
          className="bg-slate-900/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all w-full resize-none min-h-[120px] custom-scrollbar" />
      ) : (
        <input id={id} {...props}
          className="bg-slate-900/40 border border-slate-700/50 rounded-2xl px-5 py-4 text-sm text-slate-200 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all w-full placeholder:text-slate-600" />
      )}
      {error && <p className="text-xs text-red-400 font-bold ml-1 mt-1 flex items-center gap-1.5"><span>⚠</span> {error}</p>}
    </div>
  );
}

// Primary button
export function Btn({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-[0_10px_30px_rgba(245,158,11,0.2)] hover:shadow-[0_15px_35px_rgba(245,158,11,0.3)] hover:-translate-y-1',
    secondary: 'bg-slate-800/80 hover:bg-slate-700 text-slate-100 border border-slate-700/50 hover:border-slate-500/50 hover:-translate-y-0.5',
    danger: 'bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 shadow-xl shadow-red-500/10 hover:-translate-y-0.5',
    ghost: 'text-slate-400 hover:text-amber-400 hover:bg-amber-500/5 active:bg-amber-500/10',
  };
  const sizes = { 
    sm: 'px-5 py-2.5 text-xs tracking-wider uppercase', 
    md: 'px-7 py-3.5 text-sm tracking-wide', 
    lg: 'px-10 py-4.5 text-base tracking-tight font-bold' 
  };
  return (
    <button className={`inline-flex items-center justify-center gap-3 rounded-2xl transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

// Empty state
export function EmptyState({ icon: Icon, message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 glass-card rounded-3xl border-dashed border-2 border-slate-700/50">
      <div className="w-16 h-16 rounded-2xl bg-slate-900/50 flex items-center justify-center mb-4 text-slate-600">
        <Icon size={32} />
      </div>
      <p className="text-slate-500 text-sm font-medium text-center max-w-xs">{message}</p>
    </div>
  );
}

// Confirm delete dialog
export function ConfirmDialog({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative glass border border-red-500/20 rounded-3xl p-8 max-w-sm w-full fade-in text-center premium-border">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold">!</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 font-[Outfit]">Are you sure?</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">{message || 'This action cannot be undone and will permanently delete the selected item.'}</p>
        <div className="flex gap-4">
          <Btn variant="secondary" onClick={onClose} className="flex-1">No, Cancel</Btn>
          <Btn variant="danger" onClick={onConfirm} className="flex-1">Yes, Delete</Btn>
        </div>
      </div>
    </div>
  );
}
