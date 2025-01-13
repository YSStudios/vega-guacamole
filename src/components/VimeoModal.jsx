import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/ModalContent.module.scss";
import { modalValue } from "../slices/modalSlice";
import Image from "next/image";
import maximizeBtn from "../assets/svg/maximize-btn.svg";
import closeBtn from "../assets/svg/close-btn.svg";
// import loader from "../assets/svg/vega";

export default function VimeoModal({
  modalName,
  modalRef,
  resize,
  window,
  width,
  height,
  toggle,
  vegaTv,
}) {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const maximizeRef = useRef(null);
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoName, setCurrentVideoName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingState = () => {
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  };

  const handleModalResize = (modalRef, resize, window, width, height) => {
    dispatch(resize());
    if (maximizeRef.current) {
      if (maximizeRef.current.requestFullscreen) {
        maximizeRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (maximizeRef.current.mozRequestFullScreen) {
        maximizeRef.current.mozRequestFullScreen();
        setIsFullscreen(true);
      } else if (maximizeRef.current.webkitRequestFullscreen) {
        maximizeRef.current.webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if (maximizeRef.current.msRequestFullscreen) {
        maximizeRef.current.msRequestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prevState) =>
      prevState + 1 < vegaTv.length ? prevState + 1 : 0
    );
    setIsPaused(false);
    setIsLoading(true);
  };

  const handlePreviousVideo = () => {
    setCurrentVideoIndex((prevState) =>
      prevState - 1 >= 0 ? prevState - 1 : vegaTv.length - 1
    );
    setIsPaused(false);
    setIsLoading(true);
  };

  const togglePause = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPaused(!isPaused);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      if (active.vimeoActive && !isPaused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [active.vimeoActive, isPaused, currentVideoIndex]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    setCurrentVideoName(vegaTv[currentVideoIndex]);
  }, [currentVideoIndex, vegaTv]);

  return (
    <>
      <div
        className={`${styles.vegaTv} ${isFullscreen ? styles.fullscreen : ""}`}
      >
        <div className={styles.modal_nav_full}>
          <Image
            src={maximizeBtn}
            alt="maximize window"
            className={styles.maximize_window}
            width={20}
            height={20}
            onClick={() => handleModalResize(modalRef, resize)}
          />
          <Image
            src={closeBtn}
            alt="close window"
            className={styles.close_window}
            width={20}
            height={20}
            onClick={() => dispatch(toggle())}
          />
        </div>
        <div className={`${styles.modal_title_wrap_full} dragTrigger`}>
          <svg
            className={styles.modal_title_before}
            width="100%"
            height="100%"
            viewBox="0 0 23 38"
          >
            <path d="M0,33.634L0,20.976C0,9.484 9.496,0 21,0L23,0L23,38L4.372,38C1.958,38 0,36.046 0,33.634Z" />
          </svg>
          <h2 className={styles.modal_title}>{modalName}</h2>
          <svg
            className={styles.modal_title_after}
            width="100%"
            height="100%"
            viewBox="0 0 60 38"
          >
            <path d="M0,0L60,0L60,8L58.882,8.002C49.447,8.002 40.34,12.357 33.286,18.615L19.537,30.813C14.318,35.443 7.579,38 0.598,38L0,38L0,0Z" />
          </svg>
          <div className={styles.modal_title_line_full}></div>
          <svg
            className={styles.modal_title_right}
            width="100%"
            height="100%"
            viewBox="0 0 60 38"
          >
            <path d="M60,0L0,0L0,8L1.118,8.002C10.553,8.002 19.66,12.357 26.714,18.615L40.463,30.813C45.682,35.443 52.421,38 59.402,38L60,38L60,0Z" />
          </svg>
          <div className={styles.modal_title_spacer}></div>
          <svg
            className={styles.modal_title_right_end}
            width="100%"
            height="100%"
            viewBox="0 0 23 38"
          >
            <path d="M23,33.634L23,20.976C23,9.484 13.504,0 2,0L0,0L0,38L18.628,38C21.042,38 23,36.046 23,33.634Z" />
          </svg>
        </div>
        <div className={styles.modal_content}>
          <div ref={maximizeRef} className={styles.modal_body_relative}>
            {/* {isLoading && (
              <div className={styles.loader_wrapper}>
                <Image 
                    src="https://res.cloudinary.com/dtps5ugbf/image/upload/v1736111388/vega-website-320_tdxqhz.gif"
                    alt="Vega Animation"
                    width={250}
                    height={250}
                    priority
                  />
              </div>
            )} */}
            <video
              ref={videoRef}
              src={vegaTv[currentVideoIndex]}
              height={"auto"}
              width={"100%"}
              autoPlay
              muted
              loop
              controls={false}
              playsInline
              onCanPlay={handleLoadingState}
            ></video>
            <div className={styles.vimeo_control_wrapper}>
              <button
                className={styles.skip_back}
                onClick={handlePreviousVideo}
              >
                Previous
              </button>
              {isPaused ? (
                <button className={styles.play} onClick={togglePause}>
                  Play
                </button>
              ) : (
                <button className={styles.pause} onClick={togglePause}>
                  Pause
                </button>
              )}
              <button className={styles.skip_forward} onClick={handleNextVideo}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
