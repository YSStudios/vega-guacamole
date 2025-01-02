import { useSelector, useDispatch } from "react-redux";

export const handleModalResize = (modalRef, resize, window) => {
  dispatch(resize());
  if (window === false) {
    gsap.to(modalRef.current, {
      duration: 1,
      ease: "expo.out",
      width: "75vw",
      height: "82vh",
      transformOrigin: "center center",
      transform: "translate3d(0,-70px,0)",
    });
  } else {
    gsap.to(modalRef.current, {
      duration: 1,
      ease: "expo.out",
      width: "460px",
      height: "18em",
    });
  }
};

export const handleModalClose = (windowRef, resizeActive, modalState) => {
  dispatch(resizeActive());
  if (modalState === false) {
    gsap.to(windowRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(windowRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};

export const handlePlayerMinimize = () => {
  if (active.playerMinimize === true) {
    gsap.to(playerRef.current, {
      duration: 0.8,
      ease: "circ",
      scale: ".01",
      display: "none",
    });
  } else {
    gsap.to(playerRef.current, {
      duration: 0.8,
      ease: "circ",
      scale: "1",
      display: "",
    });
  }
};

export const handleVimeoToggle = () => {
  if (active.vimeoActive === false) {
    gsap.to(vimeoRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(vimeoRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};
export const handleInstagramToggle = () => {
  if (active.instagramActive === false) {
    gsap.to(instagramRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(instagramRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};
export const handleAboutToggle = () => {
  if (active.aboutActive === false) {
    gsap.to(aboutRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(aboutRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};
export const handleCaseStudiesToggle = () => {
  if (active.caseStudiesActive === false) {
    gsap.to(caseRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(caseRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};
export const handleContactToggle = () => {
  if (active.contactActive === false) {
    gsap.to(contactRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "0",
      display: "none",
    });
  } else {
    gsap.to(contactRef.current, {
      duration: 0.8,
      ease: "power4.out",
      scale: "1",
      display: "",
    });
  }
};

//export loaderSlice
export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
	value: true,
  },
  reducers: {
	loader: (state) => {
	  state.value = false;
	},
  },
});
