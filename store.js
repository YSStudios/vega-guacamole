import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import activeReducers from "./src/slices/modalSlice";
import themeReducers from "./src/slices/themeSlice";
import songReducer from "./src/slices/songSlice";

const rootReducer = combineReducers({
  active: activeReducers,
  theme: themeReducers,
  song: songReducer,
  // any other reducers here
});

export const store = configureStore({
  reducer: rootReducer,
});

// store.subscribe(() => console.log("Store updated:", store.getState()));
