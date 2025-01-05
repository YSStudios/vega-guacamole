import { createSlice } from "@reduxjs/toolkit";

const getInitialParticleColor = () => {
  // If we're in the browser, check localStorage or any other source for saved theme
  if (typeof window !== "undefined") {
    const savedTheme = localStorage.getItem("theme");
    switch (savedTheme) {
      case "light":
        return "#0000CC";
      case "guava":
        return "#00FF00";
      case "inferno":
        return "#ffffff";
      case "dark":
        return "#FFFF00";
      default:
        return "#FF0000"; // Default to theme1 color
    }
  }
  return "#FF0000"; // Default for SSR
};

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    themeActive1: true,
    themeActive2: false,
    themeActive3: false,
    themeActive4: false,
    particleColor: getInitialParticleColor(),
  },
  reducers: {
    themeActive1: (state) => {
      return {
        ...state,
        themeActive1: true,
        themeActive2: false,
        themeActive3: false,
        themeActive4: false,
        particleColor: "#0000CC",
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
      };
    },
    themeActive3: (state) => {
      return {
        ...state,
        themeActive1: false,
        themeActive2: false,
        themeActive3: true,
        themeActive4: false,
        particleColor: "#FFFFFF",
      };
    },
    themeActive4: (state) => {
      return {
        ...state,
        themeActive1: false,
        themeActive2: false,
        themeActive3: false,
        themeActive4: true,
        particleColor: "#FFFF00",
      };
    },
  },
});

export const { themeActive1, themeActive2, themeActive3, themeActive4 } =
  themeSlice.actions;

export const themeValue = (state) => state.theme;
export const particleColorValue = (state) => state.theme.particleColor;

export default themeSlice.reducer;
