import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  themeActive1,
  themeActive2,
  themeActive3,
  themeActive4,
  themeValue,
} from "../slices/themeSlice";
import styles from "../styles/ThemeSelector.module.scss";
import { useTheme } from "next-themes";
import gsap from "gsap";

const ThemeSelector = () => {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const audioElement = useRef(null);
  const loaderActive = useSelector((state) => state.active.loaderActive);

  useEffect(() => {
    if (audioElement.current) {
      audioElement.current.volume = 0.4;
    }
  }, []);

  const playSound = () => {
    try {
      if (audioElement.current && audioElement.current.readyState >= 2) {
        audioElement.current.currentTime = 0;
        audioElement.current.play().catch((error) => {
          console.warn('Theme selector audio play failed:', error);
        });
      }
    } catch (error) {
      console.warn('Theme selector audio playback error:', error);
    }
  };

  const uncheckThemeToggle = () => {
    const themeToggleCheckbox = document.getElementById("theme-toggle");
    if (themeToggleCheckbox) {
      themeToggleCheckbox.checked = false;
    }
  };

  const handleThemeChange = (newTheme, actionCreator) => {
    playSound();
    dispatch(actionCreator());
    setTheme(newTheme);
    uncheckThemeToggle();
  };

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      // Dispatch the corresponding theme action
      switch(savedTheme) {
        case 'light':
          dispatch(themeActive1());
          break;
        case 'guava':
          dispatch(themeActive2());
          break;
        case 'inferno':
          dispatch(themeActive3());
          break;
        case 'dark':
          dispatch(themeActive4());
          break;
        default:
          dispatch(themeActive1());
      }
    }
  }, []);

  return (
    <>
      <div className={styles.background} />

      {/* Desktop Theme Selector */}
      <div
        className={`${styles.theme_selector} ${
          !loaderActive ? styles.fadeIn : styles.fadeOut
        }`}
      >
        <span>Theme Selector</span>
        <div className={styles.button_container}>
          <button
            className={`${styles.theme_button1} ${styles.theme_buttons}`}
            onClick={() => handleThemeChange("light", themeActive1)}
          >
            Theme 1
          </button>
          <button
            className={`${styles.theme_button2} ${styles.theme_buttons}`}
            onClick={() => handleThemeChange("guava", themeActive2)}
          >
            Theme 2
          </button>
          <button
            className={`${styles.theme_button3} ${styles.theme_buttons}`}
            onClick={() => handleThemeChange("inferno", themeActive3)}
          >
            Theme 3
          </button>
          <button
            className={`${styles.theme_button4} ${styles.theme_buttons}`}
            onClick={() => handleThemeChange("dark", themeActive4)}
          >
            Theme 4
          </button>
        </div>
      </div>

      {/* Mobile Theme Selector */}
      <div
        className={`${styles.mobile_theme_selector} ${
          !loaderActive ? styles.fadeIn : styles.fadeOut
        }`}
      >
        <input
          type="checkbox"
          className={styles.themeCheckbox}
          id="theme-toggle"
        />
        <label htmlFor="theme-toggle" className={styles.mobile_nav} />

        <div
          className={`${styles.theme_button} ${styles.themeBtn1}`}
          onClick={() => handleThemeChange("light", themeActive1)}
        />
        <div
          className={`${styles.theme_button} ${styles.themeBtn2}`}
          onClick={() => handleThemeChange("guava", themeActive2)}
        />
        <div
          className={`${styles.theme_button} ${styles.themeBtn3}`}
          onClick={() => handleThemeChange("inferno", themeActive3)}
        />
        <div
          className={`${styles.theme_button} ${styles.themeBtn4}`}
          onClick={() => handleThemeChange("dark", themeActive4)}
        />
      </div>

      <audio
        src="https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389162/Theme_select_k642pz.wav"
        ref={audioElement}
      />
    </>
  );
};

export default ThemeSelector;
