import React, { useState, useEffect, useRef } from "react";
import App from "../components/App";
import Particle from "../components/Particle";
import ThemeSelector from "../components/ThemeSelector";
import Header from "../components/Header";
import SidebarRight from "../components/SidebarRight";
import ModalGrid from "../components/ModalGrid";
import IntroButton from "../components/IntroButton";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import gsap from "gsap";
import { Draggable } from "../../gsap";
import NoiseBackground from "../components/NoiseBackground";
import { useSelector, useDispatch } from "react-redux";
import FullScreenVideo from "../components/FullScreenVideo";
import styles from "../styles/Mixins.module.scss";
import { INSTAGRAM_FEED } from "../types/instagram";
import { v4 as uuidv4 } from "uuid";

// Sanity client setup
const client = createClient({
  projectId: "yqk7lu4g",
  dataset: "production",
  apiVersion: "2023-03-11",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
const urlFor = (source) => builder.image(source);

export default function Home({
  weatherData,
  caseStudies,
  about,
  trans,
  instaFeed,
  vegaTv,
  songData,
  sanityInstaData,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const [focusedComponent, setFocusedComponent] = useState(null);
  const [isCaseStudyClicked, setIsCaseStudyClicked] = useState(false);
  const loaderActive = useSelector((state) => state.active.loaderActive);
  const buttonRef = useRef(null);
  const vegaButtonSoundRef = useRef(null);
  const animationSpeedRef = useRef(0.008);
  const isInteractingRef = useRef(false);
  const mousePositionRef = useRef({ x: 10000, y: 10000 });

  const handleFocus = (refName) => {
    if (
      refName !== "caseRef" ||
      (refName === "caseRef" && !isCaseStudyClicked)
    ) {
      setFocusedComponent(refName);
      gsap.set(refName, { zIndex: Draggable.zIndex++ });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleButtonComplete = () => {
    if (vegaButtonSoundRef.current) {
      vegaButtonSoundRef.current.volume = 0.4;
      vegaButtonSoundRef.current
        .play()
        .catch((error) =>
          console.error("Error playing Vega button sound:", error)
        );
    }
    animationSpeedRef.current = 0.08;
  };

  useEffect(() => {
    if (showButton && buttonRef.current) {
      gsap.to(buttonRef.current, {
        opacity: 1,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }, [showButton]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleTouchStart = (event) => {
      const touch = event.touches[0];
      mousePositionRef.current = { x: touch.clientX, y: touch.clientY };
      isInteractingRef.current = true;
    };

    const handleTouchEnd = () => {
      isInteractingRef.current = false;
      mousePositionRef.current = { x: 10000, y: 10000 };
    };

    const handleTouchMove = (event) => {
      if (isInteractingRef.current) {
        const touch = event.touches[0];
        mousePositionRef.current = { x: touch.clientX, y: touch.clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <App>
      <Particle
        animationSpeedRef={animationSpeedRef}
        isInteractingRef={isInteractingRef}
        mousePositionRef={mousePositionRef}
      />
      <NoiseBackground />
      {showButton && (
        <IntroButton
          ref={buttonRef}
          onComplete={handleButtonComplete}
          style={{
            opacity: 0,
            visibility: loaderActive ? "visible" : "hidden",
          }}
        />
      )}
      <ThemeSelector />
      <Header
        weatherData={weatherData || {}}
        className={`fadeIn ${!loaderActive ? styles.fadeIn : styles.fadeOut}`}
      />
      <SidebarRight
        handleFocus={handleFocus}
        setFocusedComponent={setFocusedComponent}
        focusedComponent={focusedComponent}
        isCaseStudyClicked={isCaseStudyClicked}
        setIsCaseStudyClicked={setIsCaseStudyClicked}
        className="fadeIn"
      />
      <ModalGrid
        caseStudies={caseStudies || []}
        about={about || []}
        trans={trans || []}
        vegaTv={vegaTv?.videoUrls || []}
        instaFeed={instaFeed || []}
        songData={songData || []}
        urlFor={urlFor}
        handleFocus={handleFocus}
        setFocusedComponent={setFocusedComponent}
        focusedComponent={focusedComponent}
        isCaseStudyClicked={isCaseStudyClicked}
        setIsCaseStudyClicked={setIsCaseStudyClicked}
        className="fadeIn"
        sanityInstaData={
          sanityInstaData || {
            title: "Instagram Feed",
            posts: INSTAGRAM_FEED,
            instagramProfile: "https://www.instagram.com/vega.us/",
          }
        }
      />
      <audio
        ref={vegaButtonSoundRef}
        src="https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389161/site_open_2_iucevj.wav"
      />
    </App>
  );
}

export async function getServerSideProps(context) {
  try {
    const [
      weatherResponse,
      caseStudies,
      vegaTvData,
      about,
      trans,
      songData,
      sanityInstaData,
    ] = await Promise.all([
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?" +
          new URLSearchParams({
            q: "new york",
            units: "imperial",
            appid: process.env.WEATHER_KEY,
          })
      ),
      client.fetch(
        `*[_type == "caseStudies" && !(_id in path("drafts.**"))]{...} | order(order asc)`
      ),
      client.fetch('*[_type == "vegaTv"][0]'),
      client.fetch(`*[_type == "about"]{...}`),
      client.fetch(`*[_type == "Gen-Synth"]{...}`),
      client.fetch(`*[_type == "song"]{...}`),
      client.fetch(`*[_type == "instagram"][0]{...}`),
    ]);

    const weatherData = await weatherResponse.json();

    if (sanityInstaData?.posts) {
      const hasMissingIds = sanityInstaData.posts.some((post) => !post.id);
      if (hasMissingIds) {
        sanityInstaData.posts = sanityInstaData.posts.map((post) => ({
          ...post,
          id: post.id || uuidv4(),
        }));
      }
    }

    return {
      props: {
        weatherData,
        caseStudies,
        about,
        vegaTv: vegaTvData,
        trans,
        songData,
        instaFeed: [],
        sanityInstaData: sanityInstaData || {
          title: "Instagram Feed",
          posts: INSTAGRAM_FEED,
          instagramProfile: "https://www.instagram.com/vega.us/",
        },
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    return {
      props: {
        weatherData: null,
        caseStudies: [],
        about: null,
        vegaTv: null,
        trans: null,
        songData: null,
        instaFeed: [],
        sanityInstaData: {
          title: "Instagram Feed",
          posts: INSTAGRAM_FEED,
          instagramProfile: "https://www.instagram.com/vega.us/",
        },
      },
    };
  }
}
