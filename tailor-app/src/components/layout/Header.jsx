import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { useSelector } from 'react-redux';

const routeTitles = {
  '/': 'Dashboard',
  '/customers': 'Customers',
  '/measurements': 'Measurements',
  '/orders': 'Orders',
  '/sizes': 'Size Charts',
  '/fabrics': 'Fabrics & Materials',
  '/billing': 'Billing & Invoices',
  '/settings': 'Settings',
};

export default function Header({ searchValue, onSearchChange }) {
  const location = useLocation();
  const title = Object.entries(routeTitles).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] || 'Dashboard';
  const orders = useSelector(s => s.orders.list);
  const pendingCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-white font-[Outfit]">{title}</h1>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString('en-PK', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {onSearchChange && (
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 w-52 transition-all"
            />
          </div>
        )}
        <div className="relative">
          <button className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all border border-slate-700">
            <Bell size={16} />
          </button>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full text-xs text-slate-900 font-bold flex items-center justify-center">{pendingCount}</span>
          )}
        </div>
        <div className="w-9 h-9 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center text-slate-900 font-bold text-sm cursor-pointer hover:scale-105 transition-transform">
          T
        </div>
      </div>
    </header>
  );
}
