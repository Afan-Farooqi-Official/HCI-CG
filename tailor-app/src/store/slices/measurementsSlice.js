import { createSlice } from '@reduxjs/toolkit';
import { mockMeasurements } from '../../data/mockData';

const measurementsSlice = createSlice({
  name: 'measurements',
  initialState: { list: mockMeasurements, nextId: mockMeasurements.length + 1 },
  reducers: {
    updateMeasurements: (state, action) => {
      const existing = state.list.findIndex(m => m.customerId === action.payload.customerId);
      if (existing !== -1) {
        state.list[existing] = { ...state.list[existing], ...action.payload, date: new Date().toISOString().split('T')[0] };
      } else {
        state.list.push({ ...action.payload, id: state.nextId++, date: new Date().toISOString().split('T')[0] });
      }
    },
    deleteMeasurement: (state, action) => {
      state.list = state.list.filter(m => m.customerId !== action.payload);
    },
  },
});

export const { updateMeasurements, deleteMeasurement } = measurementsSlice.actions;
export default measurementsSlice.reducer;
