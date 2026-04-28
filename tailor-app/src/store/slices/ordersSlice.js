import { createSlice } from '@reduxjs/toolkit';
import { mockOrders } from '../../data/mockData';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: mockOrders, nextId: mockOrders.length + 1 },
  reducers: {
    addOrder: (state, action) => {
      state.list.push({ ...action.payload, id: state.nextId++, createdAt: new Date().toISOString().split('T')[0], deliveryDate: null });
    },
    updateOrder: (state, action) => {
      const idx = state.list.findIndex(o => o.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    updateOrderStatus: (state, action) => {
      const idx = state.list.findIndex(o => o.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx].status = action.payload.status;
        if (action.payload.status === 'Delivered') {
          state.list[idx].deliveryDate = new Date().toISOString().split('T')[0];
        }
      }
    },
    deleteOrder: (state, action) => {
      state.list = state.list.filter(o => o.id !== action.payload);
    },
  },
});

export const { addOrder, updateOrder, updateOrderStatus, deleteOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
