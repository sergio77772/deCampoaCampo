import { createSlice } from '@reduxjs/toolkit';

const connectionSlice = createSlice({
  name: 'connection',
  initialState: {
    isOnline: navigator.onLine,
    showingCached: false,
  },
  reducers: {
    setOnline: (state) => {
      state.isOnline = true;
    },
    setOffline: (state) => {
      state.isOnline = false;
    },
    setShowingCached: (state, action) => {
      state.showingCached = action.payload;
    },
  },
});

export const { setOnline, setOffline, setShowingCached } =
  connectionSlice.actions;

export const selectIsOnline = (state) => state.connection.isOnline;
export const selectShowingCached = (state) => state.connection.showingCached;

export default connectionSlice.reducer;
