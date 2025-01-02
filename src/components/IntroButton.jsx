import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleLoaderActive } from "../slices/modalSlice";
import styles from "../styles/IntroButton.module.scss";

const IntroButton = React.forwardRef(({ onComplete, ...props }, ref) => {
  const [fillPercentage, setFillPercentage] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const animationRef = useRef(null);
  const dispatch = useDispatch();
  const loaderActive = useSelector((state) => state.active.loaderActive);

  const resetState = () => {
    cancelAnimationFrame(animationRef.current);
    setFillPercentage(0);
    setIsCompleted(false);
    setShowProgress(false);
    setIsFadingOut(false);
  };

  const startFilling = () => {
    if (loaderActive && !isCompleted) {
      setShowProgress(true);
      animationRef.current = requestAnimationFrame(updateFill);
    }
  };

  const updateFill = () => {
    setFillPercentage((prev) => {
      const newPercentage = Math.min(prev + 5, 100);
      if (newPercentage === 100) {
        setIsCompleted(true);
      }
      return newPercentage;
    });

    if (fillPercentage < 100) {
      animationRef.current = requestAnimationFrame(updateFill);
    }
  };

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (isCompleted && loaderActive) {
      setIsFadingOut(true);
      const fadeOutTimer = setTimeout(() => {
        dispatch(toggleLoaderActive());
        if (onComplete) onComplete();
      }, 1);

      const resetTimer = setTimeout(() => {
        resetState();
      }, 2000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [isCompleted, dispatch, onComplete, loaderActive]);

  // Reset state when loaderActive becomes true
  useEffect(() => {
    if (loaderActive) {
      resetState();
    }
  }, [loaderActive]);

  return (
    <button
      ref={ref}
      className={`${styles.introButton} 
        ${isCompleted ? styles.completed : ""}
        ${fillPercentage === 100 ? styles.hovered : ""}
        ${isFadingOut ? styles.fadeOut : ""}`}
      onClick={startFilling}
      disabled={!loaderActive || isCompleted}
      style={{ "--fill-percentage": `${fillPercentage}%` }}
      {...props}
    >
      <span className={styles.buttonText}>
        {showProgress ? `${Math.round(fillPercentage)}%` : "Enter"}
      </span>
      <div
        className={styles.fillBar}
        style={{ height: `${fillPercentage}%` }}
      ></div>
    </button>
  );
});

export default IntroButton;
