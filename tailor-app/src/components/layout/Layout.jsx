import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [search, setSearch] = useState('');
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header searchValue={search} onSearchChange={setSearch} />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="page-container">
            <Outlet context={{ search }} />
          </div>
        </main>
      </div>
    </div>
  );
}
