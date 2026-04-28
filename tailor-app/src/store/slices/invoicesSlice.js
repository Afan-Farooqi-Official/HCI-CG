import { createSlice } from '@reduxjs/toolkit';
import { mockInvoices } from '../../data/mockData';

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState: { list: mockInvoices, nextId: mockInvoices.length + 1 },
  reducers: {
    addInvoice: (state, action) => {
      state.list.push({ ...action.payload, id: state.nextId++, issuedDate: new Date().toISOString().split('T')[0] });
    },
    markAsPaid: (state, action) => {
      const idx = state.list.findIndex(inv => inv.id === action.payload);
      if (idx !== -1) {
        state.list[idx].status = 'Paid';
        state.list[idx].paid = state.list[idx].total;
      }
    },
    updateInvoice: (state, action) => {
      const idx = state.list.findIndex(inv => inv.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteInvoice: (state, action) => {
      state.list = state.list.filter(inv => inv.id !== action.payload);
    },
  },
});

export const { addInvoice, markAsPaid, updateInvoice, deleteInvoice } = invoicesSlice.actions;
export default invoicesSlice.reducer;
