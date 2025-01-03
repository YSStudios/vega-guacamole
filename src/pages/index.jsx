import React, { useState, useEffect, useRef } from "react";
import App from "../components/App";
import Particle from "../components/Particle";
import ThemeSelector from "../components/ThemeSelector";
import Header from "../components/Header";
import SidebarRight from "../components/SidebarRight";
import ModalGrid from "../components/ModalGrid";
import IntroButton from "../components/IntroButton";
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import gsap from "gsap";
import { Draggable } from "../../gsap";
import NoiseBackground from "../components/NoiseBackground";
import { useSelector, useDispatch } from "react-redux";
import FullScreenVideo from "../components/FullScreenVideo";
import styles from "../styles/Mixins.module.scss";

// Creating the client and builder outside of components
const client = createClient({
  projectId: "yqk7lu4g",
  dataset: "production",
  apiVersion: "2023-03-11",
  token: process.env.SANITY_TOKEN,
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
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

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
    gsap.to(".fadeIn", {
      opacity: loaderActive ? 0 : 1,
      duration: 5,
      stagger: loaderActive ? 0 : 0.5,
      ease: "power2.inOut",
    });
  }, [loaderActive]);

  return (
    <App>
      <Particle animationSpeedRef={animationSpeedRef} />
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
        weatherData={weatherData}
        className="fadeIn"
        style={{ opacity: 0 }}
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
        caseStudies={caseStudies}
        about={about}
        trans={trans}
        vegaTv={vegaTv.videoUrls}
        instaFeed={instaFeed}
        songData={songData}
        urlFor={urlFor}
        handleFocus={handleFocus}
        setFocusedComponent={setFocusedComponent}
        focusedComponent={focusedComponent}
        isCaseStudyClicked={isCaseStudyClicked}
        setIsCaseStudyClicked={setIsCaseStudyClicked}
        className="fadeIn"
      />
      <audio
        ref={vegaButtonSoundRef}
        src="https://res.cloudinary.com/dtps5ugbf/video/upload/v1722389161/site_open_2_iucevj.wav"
      />
    </App>
  );
}

export async function getServerSideProps(context) {
  // Fetch data in parallel to improve performance
  const [
    caseStudies,
    vegaTvData,
    about,
    trans,
    songData,
    weatherResponse,
    instagramData,
  ] = await Promise.all([
    client.fetch(`*[_type == "caseStudies" && !(_id in path("drafts.**"))]{
      header,
      image {
        asset->{url, metadata},
        hotspot
      },
      featuredImage,
      body,
      projectBreakdown,
      portrait[]{
        asset->{_id, _type, url}
      },
      imageGallery1,
      body2,
      order,
      title,
      subtitle,
      services
    } | order(order asc)`),
    client.fetch('*[_type == "vegaTv"][0]'),
    client.fetch(`*[_type == "about"]{
      header,
      "logoUrl": logo.asset->url,
      imagesGallery,
      body,
      imagesGallery2[] {
        image {
          asset->,
          hotspot,
          crop
        },
        name,
        title
      },
      body2,
      skill1 {
        title,
        list
      },
      skill2 {
        title,
        list
      },
      skill3 {
        title,
        list
      }
    }`),
    client.fetch(`*[_type == "Gen-Synth"]{
      header,
      imagesGallery[] {
        asset->
      },
      body,
      videos[] {
        videoUrl,
        videoLink,
        thumbnail {
          asset->
        }
      },
      body2
    }`),
    client.fetch(`*[_type == "song"] {
      _id,
      _createdAt,
      _updatedAt,
      name,
      artist,
      cover,
      audio,
      color[]{
        _key,
        _type,
        alpha,
        hex,
        hsl->{
          _type,
          h,
          s,
          l,
          a
        },
        hsv->{
          _type,
          h,
          s,
          v,
          a
        },
        rgb->{
          _type,
          r,
          g,
          b,
          a
        }
      },
      active
    }`),
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=new york&units=imperial&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}`
    ),
    fetch(
      `http://graph.instagram.com/me/media?fields=id,caption,media_url,timestamp,media_type,permalink,thumbnail_url&access_token=${process.env.NEXT_PUBLIC_INSTAGRAM_KEY}`
    ),
  ]);

  const weatherData = await weatherResponse.json();

  return {
    props: {
      weatherData,
      caseStudies,
      about,
      vegaTv: vegaTvData,
      trans,
      songData,
    },
  };
}
