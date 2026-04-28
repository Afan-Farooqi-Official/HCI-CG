import { createSlice } from '@reduxjs/toolkit';
import { mockSizes } from '../../data/mockData';

const sizesSlice = createSlice({
  name: 'sizes',
  initialState: { charts: mockSizes },
  reducers: {
    addSizeRow: (state, action) => {
      const { clothingType, sizeRow } = action.payload;
      if (!state.charts[clothingType]) state.charts[clothingType] = [];
      state.charts[clothingType].push(sizeRow);
    },
    updateSizeRow: (state, action) => {
      const { clothingType, index, sizeRow } = action.payload;
      if (state.charts[clothingType]) state.charts[clothingType][index] = sizeRow;
    },
    deleteSizeRow: (state, action) => {
      const { clothingType, index } = action.payload;
      if (state.charts[clothingType]) state.charts[clothingType].splice(index, 1);
    },
    addClothingType: (state, action) => {
      state.charts[action.payload] = [];
    },
    deleteClothingType: (state, action) => {
      delete state.charts[action.payload];
    },
  },
});

export const { addSizeRow, updateSizeRow, deleteSizeRow, addClothingType, deleteClothingType } = sizesSlice.actions;
export default sizesSlice.reducer;
