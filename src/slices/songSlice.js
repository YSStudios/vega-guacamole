import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentSong: null,
  audioData: {
    bass: 0,
    mid: 0,
    high: 0,
    amplitude: 0,
  },
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setCurrentSongState: (state, action) => {
      state.currentSong = action.payload;
    },
    setAudioData: (state, action) => {
      state.audioData = action.payload;
    },
  },
});

export const { setCurrentSongState, setAudioData } = songSlice.actions;
export const selectCurrentSong = (state) => state.song.currentSong;
export const selectAudioData = (state) => state.song.audioData;
export default songSlice.reducer;
