import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard, Users, Ruler, ShoppingBag, Shirt, Package,
  Receipt, Settings, ChevronLeft, ChevronRight, Scissors
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/measurements', icon: Ruler, label: 'Measurements' },
  { to: '/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/sizes', icon: Shirt, label: 'Size Charts' },
  { to: '/fabrics', icon: Package, label: 'Fabrics' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const shopName = useSelector(s => s.settings.shopName);

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-72'} relative flex flex-col h-screen bg-slate-950 border-r border-slate-800 transition-all duration-500 ease-out flex-shrink-0 z-50`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-4 px-6 py-8 border-b border-slate-800/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)] group cursor-pointer hover:rotate-12 transition-transform duration-500">
          <Scissors size={20} className="text-slate-950" />
        </div>
        {!collapsed && (
          <div className="slide-in">
            <p className="text-white font-black text-base leading-none font-[Outfit] tracking-tighter uppercase">{shopName.split(' ')[0]} <span className="text-amber-500">{shopName.split(' ')[1] || 'STITCH'}</span></p>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1.5 opacity-60">Elite Atelier v1.2</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : ''}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${isActive
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]'
                  : 'text-slate-500 hover:bg-slate-900 hover:text-slate-200'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <Icon size={20} className={`flex-shrink-0 ${isActive ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'text-slate-500 group-hover:text-amber-400'} transition-all duration-300`} />
              {!collapsed && <span className={`text-[13px] font-black tracking-widest uppercase ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{label}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-6 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
              )}
              {isActive && collapsed && (
                <div className="absolute right-0 w-1 h-8 bg-amber-500 rounded-l-full shadow-[0_0_10px_rgba(245,158,11,0.6)]"></div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-10 w-8 h-8 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center hover:bg-amber-500 group transition-all duration-500 z-50 shadow-2xl"
      >
        {collapsed ? <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors" /> : <ChevronLeft size={14} className="text-slate-400 group-hover:text-slate-950 transition-colors" />}
      </button>

      {/* Footer */}
      {!collapsed && (
        <div className="px-8 py-6 border-t border-slate-800 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Operational</p>
          </div>
        </div>
      )}
    </aside>
  );
}
