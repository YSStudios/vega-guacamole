import React, { useEffect } from "react";
import noise from "../components/Noise";
import styles from "../styles/Noise.module.scss";

const NoiseBackground = () => {
  useEffect(() => {
    noise(); // Initialize the noise effect
  }, []);

  return (
      <canvas id="noise" className={styles.noise}></canvas>
  );
};

export default NoiseBackground;
