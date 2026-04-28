import { createSlice } from '@reduxjs/toolkit';
import { mockSettings } from '../../data/mockData';

const settingsSlice = createSlice({
  name: 'settings',
  initialState: mockSettings,
  reducers: {
    updateSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
