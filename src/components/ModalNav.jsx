import React, { useRef, useEffect } from "react";
import styles from "../styles/Styles.module.scss";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import maximizeBtn from "../assets/svg/maximize-btn.svg";
import closeBtn from "../assets/svg/close-btn.svg";

function ModalNav({
  modalName,
  handleModalResize,
  modalRef,
  resize,
  dispatch,
  toggle,
  modalHeaderStyle,
  modalNavStyle,
  noDragTrigger
}) {
  const audioRef = useRef(null);
  const handleMaximizeClick = () => {
    ////play the audio file if the modal is not fullscreen, otherwise play a different audio file if the modal is fullscreen
	if (!modalRef.current.classList.contains(styles.fullscreen)) {
		try {
			audioRef.current = new Audio('https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389161/site_enter_p0luqv.wav');
			audioRef.current.play().catch(error => console.warn("Audio playback failed:", error));
		} catch (error) {
			console.warn("Error loading audio:", error);
		}
	} else {
		try {
			if (audioRef.current) {
				audioRef.current.src = 'https://res.cloudinary.com/dtps5ugbf/video/upload/v1726256561/modal_minimize_u07s7u.mp3';
				audioRef.current.play().catch(error => console.warn("Audio playback failed:", error));
			}
		} catch (error) {
			console.warn("Error loading or playing audio:", error);
		}
	}
	handleModalResize(modalRef, resize);
  };

  return (
    <>
      <div className={`${styles.modal_nav} ${modalNavStyle}`}>
        <Image
          src={maximizeBtn}
          alt="maximize window"
          className={styles.maximize_window}
          width={20}
          height={20}
          onClick={handleMaximizeClick}
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
      <div className={`${styles.modal_title_wrap} ${modalHeaderStyle} ${noDragTrigger ? '' : 'dragTrigger'}`}>
        <svg
          className={styles.modal_title_before}
          width="100%"
          height="100%"
          viewBox="0 0 23 38"
        >
          <path d="M 0 34 L 0 21 C 0 9 9 0 21 0 L 23 0 L 23 38 L 4 38 C 2 38 0 36 0 34 Z" />
        </svg>
        <div>
          <h2 className={`${styles.modal_title} ${styles.truncate}`}>{modalName}</h2>
        </div>
        <svg
          className={styles.modal_title_after}
          width="100%"
          height="100%"
          viewBox="0 0 60 38"
        >
          <path d="M0,0L60,0L60,8L58.882,8.002C49.447,8.002 40.34,12.357 33.286,18.615L19.537,30.813C14.318,35.443 7.579,38 0.598,38L0,38L0,0Z" />
        </svg>
        <div className={styles.modal_title_after_line}></div>
      </div>
    </>
  );
}

export default ModalNav;