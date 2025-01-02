import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import gsap from "gsap";
import { Draggable } from "../../gsap";
import styles from "../styles/Styles.module.scss";
import VimeoModal from "../components/VimeoModal";
import AboutModal from "../components/AboutModal";
import TransModal from "../components/TransModal";
import InstagramModal from "../components/InstagramModal";
import CaseStudiesModal from "../components/CaseStudiesModal";
import MusicPlayer from "../components/MusicPlayer/MusicPlayer";
import CaseSubModal from "../components/CaseSubModal";
import Lightbox from "../components/LightBox";
import useDelayedStyles from "../hooks/useDelayedStyles";

import {
  modalValue,
  toggleInstagramActive,
  toggleVimeoResize,
  toggleAboutResize,
  toggleCaseResize,
  toggleCaseSubResize,
  toggleTransResize,
  toggleInstagramResize,
  toggleVimeoActive,
  toggleCaseStudiesActive,
  toggleCaseSubActive,
  toggleAboutActive,
  toggleTransActive,
  togglePlayerActive,
  toggleLightBoxActive,
  toggleLightboxResize,
  setLightBoxActive,
  setLightBoxFullscreen,
  setLightBoxResize,
} from "../slices/modalSlice";

export default function ModalGrid({
  caseStudies,
  about,
  trans,
  instaFeed,
  urlFor,
  vegaTv,
  songData,
  setFocusedComponent,
  focusedComponent,
  isCaseStudyClicked,
  setIsCaseStudyClicked,
}) {
  const active = useSelector(modalValue);
  const vimeoRef = useRef(null);
  const playerRef = useRef(null);
  const instagramRef = useRef(null);
  const aboutRef = useRef(null);
  const transRef = useRef(null);
  const caseRef = useRef(null);
  const caseSubRef = useRef(null);
  const lightboxRef = useRef(null);
  const draggablesRef = useRef(null);
  const [caseStudiesState, setCaseStudiesState] = useState([]);
  const [aboutState, setAboutState] = useState([]);
  const [transState, setTransState] = useState([]);
  const [modalData, setModalData] = useState([]);
  //   const [isCaseStudyClicked, setIsCaseStudyClicked] = useState(false);
  const [isCaseFullscreen, setCaseFullscreen] = useState(false);
  const [isCaseSubFullscreen, setCaseSubFullscreen] = useState(false);
  const [isAboutFullscreen, setAboutFullscreen] = useState(false);
  const [isTransFullscreen, setTransFullscreen] = useState(false);
  const [isLightBoxFullscreen, setLightBoxFullscreen] = useState(false);
  const {
    delayedActiveClass: caseStudiesActiveClass,
    delayedInactiveClass: caseStudiesInactiveClass,
  } = useDelayedStyles(active.caseStudiesActive);
  const {
    delayedActiveClass: caseSubActiveClass,
    delayedInactiveClass: caseSubInactiveClass,
  } = useDelayedStyles(active.caseSubActive);
  const {
    delayedActiveClass: aboutActiveClass,
    delayedInactiveClass: aboutInactiveClass,
  } = useDelayedStyles(active.aboutActive);
  const {
    delayedActiveClass: transActiveClass,
    delayedInactiveClass: transInactiveClass,
  } = useDelayedStyles(active.transActive);
  const {
    delayedActiveClass: instagramActiveClass,
    delayedInactiveClass: instagramInactiveClass,
  } = useDelayedStyles(active.instagramActive);
  const {
    delayedActiveClass: playerActiveClass,
    delayedInactiveClass: playerInactiveClass,
  } = useDelayedStyles(active.playerActive);
  const {
    delayedActiveClass: lightBoxActiveClass,
    delayedInactiveClass: lightBoxInactiveClass,
  } = useDelayedStyles(active.lightboxActive);
  const {
    delayedActiveClass: vimeoActiveClass,
    delayedInactiveClass: vimeoInactiveClass,
  } = useDelayedStyles(active.vimeoActive);
  const [currentContent, setCurrentContent] = useState(null); // Add currentContent state

  const [isOpen, setIsOpen] = useState(false);
  // const [focusedComponent, setFocusedComponent] = useState(null); // new state variable
  const dispatch = useDispatch();
  // Add this outside the useEffects, at the beginning of your component function
  let draggableInstances = [];

  const loaderActive = useSelector((state) => state.active.loaderActive);

  const fetchCaseStudies = () => {
    const data = caseStudies;
    setCaseStudiesState(data);
  };

  const fetchAbout = () => {
    const data = about;
    setAboutState(data);
  };

  const fetchTrans = () => {
    const data = trans;
    setTransState(data);
  };

  const modalFullscreenSetters = {
    caseRef: setCaseFullscreen,
    caseSubRef: setCaseSubFullscreen,
    aboutRef: setAboutFullscreen,
    transRef: setTransFullscreen,
    lightboxRef: setLightBoxFullscreen,
  };

  const handleModalResize = (modalRef, resizeAction) => {
    console.log("Resizing..."); // just for testing
    dispatch(resizeAction());

    // If the modal has a corresponding fullscreen state, toggle it
    if (modalFullscreenSetters[modalRef.current.id]) {
      modalFullscreenSetters[modalRef.current.id]((prevState) => !prevState);
    }
  };

  const openModal = (data) => {
    // Check if it's a mobile screen (you already had this logic)
    const isMobile = window.innerWidth <= 768;

    // If a case study is currently open:
    if (active.caseSubActive === true) {
      // 1. Close the current case study
      dispatch(toggleCaseSubActive());

      // 2. Introduce a delay before loading and opening the new study
      setTimeout(() => {
        // 3. Load the data for the new case study
        setModalData(data);

        // 4. Manage z-index and focus
        gsap.set(caseSubRef.current, { zIndex: Draggable.zIndex++ });
        // handleFocus("caseSubRef");

        // 5. Handle any necessary resizing logic
        const shouldRunHandleModalResize =
          (isMobile && !active.caseSubResizeActive) ||
          (active.caseResizeActive === true &&
            active.caseSubResizeActive === false);
        if (shouldRunHandleModalResize) {
          handleModalResize(caseSubRef, toggleCaseSubResize);
        }

        // 6. Open the new case study
        dispatch(toggleCaseSubActive());
      }, 500); // Adjust the delay in milliseconds if needed
    } else {
      // Logic to handle the initial opening of a case study (no change needed)
      dispatch(toggleCaseSubActive());
      setModalData(data);
      gsap.set(caseSubRef.current, { zIndex: Draggable.zIndex + 2 });
      //handleFocus("caseSubRef");

      // Conditions to run handleModalResize
      const shouldRunHandleModalResize =
        (isMobile && !active.caseSubResizeActive) ||
        (active.caseResizeActive === true &&
          active.caseSubResizeActive === false);

      if (shouldRunHandleModalResize) {
        handleModalResize(caseSubRef, toggleCaseSubResize);
      }
    }
  };

  useEffect(() => {
    const dragTriggers = document.getElementsByClassName("dragTrigger");
    const draggables = document.getElementsByClassName("draggable");
    draggablesRef.current = draggables;
    const modalContainer = document.getElementById("modal_container");

    draggableInstances = Array.from(dragTriggers).map((trigger) => {
      const draggable = trigger.parentElement.parentElement;
      return Draggable.create(draggable, {
        trigger: trigger,
        bounds: modalContainer,
        edgeResistance: 0.65,
        type: "x,y",
        onClick: function () {
          // handleFocus(this.target.id);
          gsap.set(this.target, { zIndex: Draggable.zIndex++ });
        },
      });
    });

    // Create a separate Draggable instance for the lightbox div
    if (lightboxRef.current) {
      Draggable.create(lightboxRef.current, {
        bounds: modalContainer,
        edgeResistance: 0.65,
        type: "x,y",
        onClick: function () {
          gsap.set(this.target, { zIndex: Draggable.zIndex++ });
        },
      });
    }
  }, []);

  useEffect(() => {
    fetchCaseStudies();
    fetchAbout();
    fetchTrans();
  }, []);

  useEffect(() => {
    setLightBoxFullscreen(active.lightboxResizeActive);
  }, [active.lightboxResizeActive]);

  useEffect(() => {
    if (currentContent && lightboxRef.current) {
      gsap.set(lightboxRef.current, { zIndex: Draggable.zIndex++ });
    }
  }, [currentContent, lightboxRef]);

  return (
    <>
      <div
        id="modal_container"
        className={`${styles.modal_container} ${
          !loaderActive ? styles.fadeIn : styles.fadeOut
        }`}
      >
        <div
          className={`
					${styles.modal_window} 
					${styles.player} 
					${playerActiveClass ? styles[playerActiveClass] : ""} 
					${playerInactiveClass ? styles[playerInactiveClass] : ""} 
					${focusedComponent === "playerRef" ? styles.focus : ""}`}
          id="playerRef"
          ref={playerRef}
          onClick={() => {
            gsap.set(playerRef.current, { zIndex: Draggable.zIndex++ });
          }}
        >
          <MusicPlayer
            toggle={togglePlayerActive}
            activeModal={active.playerActive}
            songData={songData}
            urlFor={urlFor}
          />
        </div>

        <div
          className={`${styles.modal_window} ${styles.vimeo} 
					${vimeoActiveClass ? styles[vimeoActiveClass] : ""} 
					${vimeoInactiveClass ? styles[vimeoInactiveClass] : ""} 
					${focusedComponent === "vimeoRef" ? styles.focus : ""}`}
          id="vimeoRef"
          ref={vimeoRef}
          onClick={() => {
            gsap.set(vimeoRef.current, { zIndex: Draggable.zIndex++ });
          }}
        >
          <VimeoModal
            modalName={"VegaTv"}
            modalRef={vimeoRef}
            resize={toggleVimeoResize}
            window={active.vimeoResizeActive}
            width={600}
            height={"fit-content"}
            toggle={toggleVimeoActive}
            activeModal={active.vimeoActive}
            id={`vimeoRef`}
            draggablesRef={draggablesRef}
            vegaTv={vegaTv}
          />
        </div>

        <div
          id="caseRef"
          ref={caseRef}
          className={`
					${styles.modal_window} 
					${styles.case_studies} 
					${caseStudiesActiveClass ? styles[caseStudiesActiveClass] : ""} 
					${caseStudiesInactiveClass ? styles[caseStudiesInactiveClass] : ""} 
					${focusedComponent === "caseRef" ? styles.focus : ""}
					${isCaseFullscreen ? styles.fullscreen : styles.normal}
					`}
          onClick={() => {
            if (caseRef.current) {
              gsap.set(caseRef.current, { zIndex: Draggable.zIndex++ });
            }
          }}
        >
          <CaseStudiesModal
            modalName={"Case Studies"}
            modalRef={caseRef}
            resize={toggleCaseResize}
            window={active.caseResizeActive}
            toggle={toggleCaseStudiesActive}
            toggleSub={toggleCaseSubActive}
            activeModal={active.caseStudiesActive}
            id={`caseRef`}
            caseStudiesState={caseStudiesState}
            draggablesRef={draggablesRef}
            openModal={openModal}
            handleModalResize={handleModalResize}
            urlFor={urlFor}
            caseSubRef={caseSubRef}
          />
        </div>

        <div
          className={`
          ${styles.modal_window} 
          ${styles.case_studies_sub} 
          ${styles.draggable}
          ${caseSubActiveClass ? styles[caseSubActiveClass] : ""} 
          ${caseSubInactiveClass ? styles[caseSubInactiveClass] : ""}
          ${focusedComponent === "caseSubRef" ? styles.focus : ""}
          ${isCaseSubFullscreen ? styles.fullscreen : styles.normal}
          `}
          id="caseSubRef"
          ref={caseSubRef}
          onClick={() => {
            if (caseSubRef.current) {
              gsap.set(caseSubRef.current, { zIndex: Draggable.zIndex++ });
            }
          }}
        >
          <CaseSubModal
            modalName={modalData.header}
            modalRef={caseSubRef}
            resize={toggleCaseSubResize}
            window={active.caseSubResizeActive}
            toggle={toggleCaseSubActive}
            activeModal={active.caseStudiesActive}
            id={`caseSubRef`}
            caseStudiesState={caseStudiesState}
            draggablesRef={draggablesRef}
            modalData={modalData}
            urlFor={urlFor}
            handleModalResize={handleModalResize}
            isCaseSubFullscreen={isCaseSubFullscreen}
            setCurrentContent={setCurrentContent}
            setLightBoxActive={setLightBoxActive}
            setLightBoxResize={setLightBoxResize}
          />
        </div>

        <div
          className={`
			${styles.modal_window} 
			${styles.about} 
			${aboutActiveClass ? styles[aboutActiveClass] : ""} 
    		${aboutInactiveClass ? styles[aboutInactiveClass] : ""}
			${focusedComponent === "aboutRef" ? styles.focus : ""}
			${isAboutFullscreen ? styles.fullscreen : styles.normal}
			`}
          id="aboutRef"
          ref={aboutRef}
          onClick={() => {
            gsap.set(aboutRef.current, { zIndex: Draggable.zIndex++ });
            // handleFocus("aboutRef");
          }}
        >
          <AboutModal
            modalName={"About"}
            modalRef={aboutRef}
            resize={toggleAboutResize}
            window={active.aboutResizeActive}
            width={600}
            height={400}
            toggle={toggleAboutActive}
            activeModal={active.aboutActive}
            id={`aboutRef`}
            draggablesRef={draggablesRef}
            aboutState={aboutState}
            urlFor={urlFor}
            handleModalResize={handleModalResize}
          />
        </div>

        <div
          className={`
					${styles.modal_window} 
					${styles.trans} 
					${transActiveClass ? styles[transActiveClass] : ""} 
					${transInactiveClass ? styles[transInactiveClass] : ""} 
					${focusedComponent === "transRef" ? styles.focus : ""}
					${isTransFullscreen ? styles.fullscreen : styles.normal}
					`}
          id="transRef"
          ref={transRef}
          onClick={() => {
            gsap.set(transRef.current, { zIndex: Draggable.zIndex++ });
            // handleFocus("transRef");
          }}
        >
          <TransModal
            modalName={"Gen-Synth"}
            modalRef={transRef}
            resize={toggleTransResize}
            window={active.transResizeActive}
            width={600}
            height={400}
            toggle={toggleTransActive}
            activeModal={active.transActive}
            id={`transRef`}
            draggablesRef={draggablesRef}
            transState={transState}
            urlFor={urlFor}
            handleModalResize={handleModalResize}
          />
        </div>

        <div
          className={`
					${styles.modal_window} ${styles.instagram} 
					${instagramActiveClass ? styles[instagramActiveClass] : ""} 
					${instagramInactiveClass ? styles[instagramInactiveClass] : ""} 
					${focusedComponent === "instagramRef" ? styles.focus : ""}
					`}
          id="instagramRef"
          ref={instagramRef}
          onClick={() => {
            gsap.set(instagramRef.current, { zIndex: Draggable.zIndex++ });
          }}
        >
          <InstagramModal
            modalName={"Instagram"}
            modalRef={instagramRef}
            resize={toggleInstagramResize}
            window={active.instagramResizeActive}
            width={400}
            height={500}
            toggle={toggleInstagramActive}
            activeModal={active.instagramActive}
            instaFeed={instaFeed.data}
            id={`instagramRef`}
            draggablesRef={draggablesRef}
          />
        </div>

        <div
          className={`${styles.clean_window} 
          ${styles.lightbox}
          ${focusedComponent === "lightboxRef" ? styles.focus : ""}
          ${isLightBoxFullscreen ? styles.fullscreen : styles.normal}
		  ${lightBoxActiveClass ? styles[lightBoxActiveClass] : ""}
		  ${lightBoxInactiveClass ? styles[lightBoxInactiveClass] : ""}
          `}
          id="lightboxRef"
          ref={lightboxRef}
          onClick={() => {
            gsap.set(lightboxRef.current, { zIndex: Draggable.zIndex++ });
          }}
        >
          <Lightbox
            modalName={"Image Viewer"}
            content={currentContent}
            onClose={() => {
              setCurrentContent(null);
            }}
            urlFor={urlFor}
            handleModalResize={handleModalResize}
            modalRef={lightboxRef}
            resize={toggleLightboxResize}
            toggle={toggleLightBoxActive}
            draggablesRef={draggablesRef}
          />
        </div>
      </div>
    </>
  );
}
