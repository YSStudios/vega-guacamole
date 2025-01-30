import { createSlice } from "@reduxjs/toolkit";

const getInitialParticleColor = () => {
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    switch (savedTheme) {
      case "light":
        return { color: "#FF69B4", blendMode: "plus-lighter" };
      case "guava":
        return { color: "#00FF00", blendMode: "overlay" };
      case "inferno":
        return { color: "#ec8301", blendMode: "plus-lighter" };
      case "dark":
        return { color: "#a9a9a9", blendMode: "plus-lighter" };
      default:
        return { color: "#FF69B4", blendMode: "plus-lighter" };
    }
  }
  return { color: "#FF69B4", blendMode: "plus-lighter" };
};

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeActive1: true,
    themeActive2: false,
    themeActive3: false,
    themeActive4: false,
    particleColor: getInitialParticleColor().color,
    blendMode: getInitialParticleColor().blendMode,
  },
  reducers: {
    themeActive1: (state) => {
      return {
        ...state,
        themeActive1: true,
        themeActive2: false,
        themeActive3: false,
        themeActive4: false,
        particleColor: "#FF69B4",
        blendMode: "plus-lighter",
      };
    },
    themeActive2: (state) => {
      return {
        ...state,
        themeActive1: false,
        themeActive2: true,
        themeActive3: false,
        themeActive4: false,
        particleColor: "#00FF00",
        blendMode: "overlay",
      };
    },
    themeActive3: (state) => {
      return {
        ...state,
        themeActive1: false,
        themeActive2: false,
        themeActive3: true,
        themeActive4: false,
        particleColor: "#ec8301",
        blendMode: "plus-lighter",
      };
    },
    themeActive4: (state) => {
      return {
        ...state,
        themeActive1: false,
        themeActive2: false,
        themeActive3: false,
        themeActive4: true,
        particleColor: "#a9a9a9",
        blendMode: "normal",
      };
    },
  },
});

export const { themeActive1, themeActive2, themeActive3, themeActive4 } =
  themeSlice.actions;

export const themeValue = (state) => state.theme;
export const particleColorValue = (state) => state.theme.particleColor;
export const blendModeValue = (state) => state.theme.blendMode;

export default themeSlice.reducer;
