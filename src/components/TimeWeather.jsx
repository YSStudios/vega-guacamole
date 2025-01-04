import { useState, useEffect } from "react";
import styles from "../styles/TimeWeather.module.scss";
import moment from "moment";
import Marquee from "react-fast-marquee";
import Image from "next/image";
import sparkle from "../assets/svg/sparkle.svg";
import earth from "../assets/svg/earth.svg";
import rectangles from "../assets/svg/rectangles.svg";
import vega from "../assets/svg/vega-logo-mobile.svg";

export default function Weather({ weatherData }) {
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  useEffect(() => {
    const updateTime = () => {
      const now = moment();
      const formated = now.format("hh:mma");
      const date = now.format("MMM Do YYYY");
      setTime(formated);
      setDate(date);
    };
    setInterval(updateTime);
    updateTime();
  }, []);
  return (
    <Marquee
      style={{
        width: "40%",
        maskImage:
          "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 15%)",
        WebkitMaskImage:
          "linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 15%)",
        top: ".7em",
      }}
      className={styles.marquee}
    >
      <span className={styles.time_span}>
        Augmented Reality, 3D Modeling, Design Services
      </span>
      <Image
        className={styles.divider}
        src={rectangles}
        width={20}
        height={20}
        alt="icon"
      ></Image>
      <span className={styles.time_span}>
        {weatherData.main?.temp.toFixed()}°F
      </span>
      <span className={styles.time_span}>{time}</span>
      <Image
        className={styles.divider}
        src={sparkle}
        width={20}
        height={20}
        alt="icon"
      ></Image>
      <span className={styles.time_span}>{date}</span>
      <Image
        className={styles.divider}
        src={earth}
        width={20}
        height={20}
        alt="icon"
      ></Image>
      <span className={styles.time_span}>New York, NYC</span>
      <Image
        className={styles.divider}
        src={sparkle}
        width={20}
        alt="icon"
      ></Image>
    </Marquee>
  );
}
