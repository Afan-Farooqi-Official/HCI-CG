import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Measurements from './pages/Measurements';
import Orders from './pages/Orders';
import Sizes from './pages/Sizes';
import Fabrics from './pages/Fabrics';
import Billing from './pages/Billing';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="measurements" element={<Measurements />} />
          <Route path="orders" element={<Orders />} />
          <Route path="sizes" element={<Sizes />} />
          <Route path="fabrics" element={<Fabrics />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
