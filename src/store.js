import songReducer from './slices/songSlice';

// Add to your existing configureStore call
{
  reducer: {
    // ... other reducers
    song: songReducer,
  }
} 