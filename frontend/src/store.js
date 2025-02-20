import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./reducers/stockReducer.js"; // Import reducers

export const store = configureStore({
  reducer: {
    stock: stockReducer, // Add reducers here
  },
});

export default store;