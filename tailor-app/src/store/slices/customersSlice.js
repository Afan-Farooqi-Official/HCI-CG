import { createSlice } from '@reduxjs/toolkit';
import { mockCustomers } from '../../data/mockData';

const customersSlice = createSlice({
  name: 'customers',
  initialState: { list: mockCustomers, nextId: mockCustomers.length + 1 },
  reducers: {
    addCustomer: (state, action) => {
      state.list.push({ ...action.payload, id: state.nextId++, createdAt: new Date().toISOString().split('T')[0] });
    },
    updateCustomer: (state, action) => {
      const idx = state.list.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteCustomer: (state, action) => {
      state.list = state.list.filter(c => c.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;
export default customersSlice.reducer;
