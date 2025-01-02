import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "active",
  initialState: {
    vimeoActive: false,
    caseStudiesActive: true,
    caseSubActive: false,
    aboutActive: false,
    transActive: false,
    instagramActive: false,
	lightboxActive: false,
    playerActive: true,
    playerMinimize: false,
    playlistActive: false,
    vimeoResizeActive: false,
    aboutResizeActive: false,
    caseResizeActive: false,
    caseSubResizeActive: false,
    transResizeActive: false,
    instagramResizeActive: false,
	lightboxResizeActive: false,
    loaderActive: true,
  },
  reducers: {
    toggleVimeoActive: (state) => {
      return { ...state, vimeoActive: !state.vimeoActive };
    },
    toggleCaseStudiesActive: (state) => {
      return { ...state, caseStudiesActive: !state.caseStudiesActive };
    },
    toggleCaseSubActive: (state) => {
      return { ...state, caseSubActive: !state.caseSubActive };
    },
    toggleAboutActive: (state) => {
      return { ...state, aboutActive: !state.aboutActive };
    },
    toggleTransActive: (state) => {
      return { ...state, transActive: !state.transActive };
    },
    toggleInstagramActive: (state) => {
      return { ...state, instagramActive: !state.instagramActive };
    },
    togglePlayerActive: (state) => {
      return { ...state, playerActive: !state.playerActive };
    },
	toggleLightBoxActive: (state) => {
		return { ...state, lightboxActive: !state.lightboxActive };
	  },
    togglePlayerMinimize: (state) => {
      return { ...state, playerMinimize: !state.playerMinimize };
    },
    togglePlaylistActive: (state) => {
      return { ...state, playlistActive: !state.playlistActive };
    },
    toggleVimeoResize: (state) => {
      return { ...state, vimeoResizeActive: !state.vimeoResizeActive };
    },
    toggleAboutResize: (state) => {
      return { ...state, aboutResizeActive: !state.aboutResizeActive };
    },
    toggleCaseResize: (state) => {
      return { ...state, caseResizeActive: !state.caseResizeActive };
    },
    toggleCaseSubResize: (state) => {
      return { ...state, caseSubResizeActive: !state.caseSubResizeActive };
    },
    toggleTransResize: (state) => {
      return { ...state, transResizeActive: !state.transResizeActive };
    },
    toggleInstagramResize: (state) => {
      return { ...state, instagramResizeActive: !state.instagramResizeActive };
    },
	toggleLightboxResize: (state) => {
	  return { ...state, lightboxResizeActive: !state.lightboxResizeActive };
	},
    toggleLoaderActive: (state) => {
      return { ...state, loaderActive: !state.loaderActive };
    },
	setLightBoxActive: (state, action) => {
		return { ...state, lightboxActive: action.payload };
	},
	setLightBoxResize: (state, action) => {
		return { ...state, lightboxResizeActive: action.payload };
	},
  },
});

export const {
  toggleVimeoActive,
  toggleCaseStudiesActive,
  toggleCaseSubActive,
  toggleAboutActive,
  toggleTransActive,
  toggleInstagramActive,
  toggleLightBoxActive,
  togglePlayerActive,
  togglePlayerMinimize,
  togglePlaylistActive,
  toggleVimeoResize,
  toggleAboutResize,
  toggleCaseSubResize,
  toggleCaseResize,
  toggleTransResize,
  toggleInstagramResize,
  toggleLightboxResize,
  toggleLoaderActive,
  setLightBoxActive,
  setLightBoxResize
} = modalSlice.actions;

export const modalValue = (state) => state.active;

export default modalSlice.reducer;
