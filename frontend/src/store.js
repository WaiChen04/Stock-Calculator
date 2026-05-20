import { configureStore } from "@reduxjs/toolkit";
import stockReducer from "./reducers/stockReducer.js"; // Import reducers

export const store = configureStore({
  reducer: {
    stock: stockReducer, // Add reducers here
    
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['your/action/type'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;