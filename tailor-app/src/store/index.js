import { configureStore } from '@reduxjs/toolkit';
import customersReducer from './slices/customersSlice';
import measurementsReducer from './slices/measurementsSlice';
import fabricsReducer from './slices/fabricsSlice';
import ordersReducer from './slices/ordersSlice';
import invoicesReducer from './slices/invoicesSlice';
import sizesReducer from './slices/sizesSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    measurements: measurementsReducer,
    fabrics: fabricsReducer,
    orders: ordersReducer,
    invoices: invoicesReducer,
    sizes: sizesReducer,
    settings: settingsReducer,
  },
});

export default store;
