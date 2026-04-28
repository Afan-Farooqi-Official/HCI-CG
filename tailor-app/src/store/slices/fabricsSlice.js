import { createSlice } from '@reduxjs/toolkit';
import { mockFabrics } from '../../data/mockData';

const fabricsSlice = createSlice({
  name: 'fabrics',
  initialState: { list: mockFabrics, nextId: mockFabrics.length + 1 },
  reducers: {
    addFabric: (state, action) => {
      state.list.push({ ...action.payload, id: state.nextId++ });
    },
    updateFabric: (state, action) => {
      const idx = state.list.findIndex(f => f.id === action.payload.id);
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload };
    },
    deleteFabric: (state, action) => {
      state.list = state.list.filter(f => f.id !== action.payload);
    },
    deductFabric: (state, action) => {
      const idx = state.list.findIndex(f => f.id === action.payload.fabricId);
      if (idx !== -1) state.list[idx].quantity = Math.max(0, state.list[idx].quantity - action.payload.amount);
    },
  },
});

export const { addFabric, updateFabric, deleteFabric, deductFabric } = fabricsSlice.actions;
export default fabricsSlice.reducer;
