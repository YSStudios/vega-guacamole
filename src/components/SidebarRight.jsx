import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import { Draggable } from "../../gsap";
import {
  toggleVimeoActive,
  toggleCaseStudiesActive,
  toggleAboutActive,
  toggleTransActive,
  toggleInstagramActive,
  togglePlayerActive,
} from "../slices/modalSlice";
import styles from "../styles/SidebarRight.module.scss";
import NavButton from "../components/NavButton";
import { modalValue } from "../slices/modalSlice";
import Link from "next/link";

const SidebarRight = ({
  handleFocus,
  setFocusedComponent,
  focusedComponent,
  isCaseStudyClicked,
  setIsCaseStudyClicked,
}) => {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const audioElement = useRef();
  const loaderActive = useSelector((state) => state.active.loaderActive);

  useEffect(() => {
    audioElement.current.volume = 0.2;
  }, []);

  const playSound = () => {
    try {
      if (audioElement.current && audioElement.current.readyState >= 2) {
        audioElement.current.currentTime = 0.05;
        audioElement.current.play().catch((error) => {
          console.warn('Audio play failed:', error);
        });
      }
    } catch (error) {
      console.warn('Audio playback error:', error);
    }
  };

  const handleZIndex = (toggle, ref) => {
    playSound();
    dispatch(toggle());
    gsap.set(ref, { zIndex: Draggable.zIndex++ });
  };

  const [isMobile, setIsMobile] = useState(false);

  // Function to uncheck the checkbox
  const uncheckNavToggle = () => {
    const navToggleCheckbox = document.getElementById("nav-toggle");
    if (navToggleCheckbox) {
      navToggleCheckbox.checked = false;
    }
  };

  useEffect(() => {
    // Define a function to update the state based on the window width
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Call the function once to set the initial state
    checkIfMobile();

    // Add a resize event listener to update the state when the window is resized
    window.addEventListener("resize", checkIfMobile);

    // Cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div
      className={`${styles.sidebar_right_wrap} ${
        !loaderActive ? styles.fadeIn : styles.fadeOut
      }`}
    >
      <div className={styles.nav_wrap}>
        <div className={styles.nav_top}>
          <div
            className={styles.player_minimize}
            onClick={() => {
              handleZIndex(togglePlayerActive, playerRef);
              handleFocus("playerRef");
            }}
          >
            Player
          </div>
          <div
            className={styles.instagram_minimize}
            onClick={() => {
              handleZIndex(toggleInstagramActive, instagramRef);
              handleFocus("instagramRef");
            }}
          >
            Instagram
          </div>
        </div>
        {!isMobile ? (
          <div className={styles.nav_bottom}>
            <div className={styles.button_container}>
              <div
                className={`${styles.button_wrap} ${styles.btn_about}`}
                onClick={() => {
                  handleZIndex(toggleAboutActive, aboutRef);
                  handleFocus("aboutRef");
                }}
              >
                <NavButton id="about" name={"About"} radius={60} offset={-25} />
              </div>
              <div
                className={`${styles.button_wrap} ${styles.btn_case_studies}`}
                onClick={() => {
                  handleZIndex(toggleCaseStudiesActive, caseRef);
                  handleFocus("caseRef");
                }}
              >
                <NavButton
                  id="case_studies"
                  name={"Case Studies"}
                  radius={90}
                  offset={10}
                />
              </div>
              <div
                className={`${styles.button_wrap} ${styles.btn_vimeo}`}
                onClick={() => {
                  handleZIndex(toggleVimeoActive, vimeoRef);
                  handleFocus("vimeoRef");
                }}
              >
                <NavButton
                  id="vimeo"
                  name={"VegaTV"}
                  radius={70}
                  offset={-35}
                />
              </div>
              <div
                className={`${styles.button_wrap} ${styles.btn_transparency}`}
                onClick={() => {
                  handleZIndex(toggleTransActive, transRef);
                  handleFocus("transRef");
                }}
              >
                <NavButton
                  id="transparency"
                  name={"Gen-Synth"}
                  radius={90}
                  offset={-20}
                />
              </div>
              <div className={`${styles.button_wrap} ${styles.btn_shop}`}>
                <a
                  href="https://vega.earth/shop"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <NavButton id="shop" name={"Shop"} radius={55} offset={-30} />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.mobile_nav_wrap}>
            <input
              type="checkbox"
              className={styles.navCheckbox}
              id="nav-toggle"
            />
            <label htmlFor="nav-toggle" className={styles.mobile_nav}></label>
            <span className={styles.mobile_nav_btn}></span>
            <span className={styles.mobile_nav_btn_close}></span>

            <div
              className={`${styles.navSmall} ${styles.nav_button} ${styles.navBtn1} ${styles.about}`}
              onClick={() => {
                uncheckNavToggle();
                handleZIndex(toggleAboutActive, aboutRef);
                handleFocus("aboutRef");
              }}
            ></div>

            <div
              className={`${styles.navSmall} ${styles.nav_button} ${styles.navBtn2} ${styles.vimeo}`}
              onClick={() => {
                uncheckNavToggle();
                handleZIndex(toggleVimeoActive, vimeoRef);
                handleFocus("vimeoRef");
              }}
            ></div>

            <div
              className={`${styles.navSmall} ${styles.nav_button} ${styles.navBtn3} ${styles.transparency}`}
              onClick={() => {
                uncheckNavToggle();
                handleZIndex(toggleTransActive, transRef);
                handleFocus("transRef");
              }}
            ></div>

            <div
              className={`${styles.navSmall} ${styles.nav_button} ${styles.navBtn4} ${styles.shop}`}
            ></div>

            <div
              className={`${styles.navSmall} ${styles.nav_button} ${styles.navBtn5} ${styles.case_studies}`}
              onClick={() => {
                uncheckNavToggle();
                handleZIndex(toggleCaseStudiesActive, caseRef);
                handleFocus("caseRef");
              }}
            ></div>
          </div>
        )}
      </div>
      <div className={styles.sidebar_right_bar}>
        <div className={styles.sidebar_bg}></div>
      </div>
      <audio
        src="https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389161/Module_open_kl46xt.wav"
        ref={audioElement}
      ></audio>
    </div>
  );
};

export default SidebarRight;
