import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "../styles/FullScreenVideo.module.scss";

const FullScreenVideo = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showVideo, setShowVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(2);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const videos = {
    1: "https://firebasestorage.googleapis.com/v0/b/auth-dev-def9f.appspot.com/o/files%2FaPUNku3zIZdc8iagWum0duEUqsI2%2Fgen%20synth%20final.mp4?alt=media&token=08ba9e98-cd85-4103-8213-a72ea8caa8a7",
    2: "https://firebasestorage.googleapis.com/v0/b/auth-dev-def9f.appspot.com/o/files%2FaPUNku3zIZdc8iagWum0duEUqsI2%2FGEN%20SYNTH%202.mp4?alt=media&token=2e7c49b1-5dc5-4d57-8414-6ccd76fc8460",
  };

  useEffect(() => {
    const initVideo = async () => {
      if (videoRef.current && showVideo) {
        videoRef.current.volume = volume;
        setIsLoading(true);

        // Reset the video element
        videoRef.current.currentTime = 0;

        // Load metadata first
        try {
          await new Promise((resolve) => {
            videoRef.current.onloadedmetadata = resolve;
          });

          // Then play
          await videoRef.current.play();
          setIsPlaying(true);
        } catch (error) {
          console.log("Video autoplay failed:", error);
          if (videoRef.current) {
            videoRef.current.muted = true;
            try {
              await videoRef.current.play();
              setIsPlaying(true);
            } catch (mutedError) {
              console.log("Muted autoplay failed:", mutedError);
              setIsPlaying(false);
            }
          }
        }
        setIsLoading(false);
      }
    };

    initVideo();
  }, [showVideo, currentVideo, volume]);

  const handleVideoClick = async () => {
    if (videoRef.current && !isLoading) {
      try {
        if (isPlaying) {
          await videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch (error) {
        console.log("Video playback control failed:", error);
      }
    }
  };

  const handleTitleClick = (videoNumber) => {
    if (currentVideo !== videoNumber && !isLoading) {
      setIsLoading(true);
      setCurrentVideo(videoNumber);
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    if (videoRef.current && isPlaying) {
      videoRef.current.play().catch(console.error);
    }
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className={styles.videoContainer}>
      {!showVideo ? (
        <div className={styles.playPrompt} onClick={() => setShowVideo(true)}>
          <Image
            src="https://res.cloudinary.com/ddkuxrisq/image/upload/v1733464214/gen_-_synth_thumb_logo_qr8n4t.png"
            alt="Click to Play"
            width={300}
            height={300}
            className={styles.playPromptImage}
            priority
          />
          <div className={styles.enterText}>ENTER</div>
        </div>
      ) : (
        <div className={styles.mainContent}>
          <div className={styles.logoWrapper}>
            <Image
              src="https://res.cloudinary.com/ddkuxrisq/image/upload/v1733464006/GEN-SYNTH_logo_fwq1lz.png"
              alt="Gen Synth Logo"
              width={400}
              height={200}
              className={styles.logo}
              priority
            />
          </div>

          <div className={styles.videoWrapper}>
            {isLoading && (
              <div className={styles.loadingOverlay}>
                <div className={styles.loadingSpinner}></div>
              </div>
            )}
            <video
              key={currentVideo}
              ref={videoRef}
              className={styles.video}
              autoPlay
              loop
              playsInline
              preload="auto"
              onClick={handleVideoClick}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onLoadedData={handleLoadedData}
            >
              <source src={videos[currentVideo]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className={styles.videoTitle}>
            <a
              onClick={() => handleTitleClick(1)}
              className={`${currentVideo === 1 ? styles.active : ""} ${
                isLoading ? styles.disabled : ""
              }`}
            >
              Part 1
            </a>
            <span className={styles.divider}>|</span>
            <a
              onClick={() => handleTitleClick(2)}
              className={`${currentVideo === 2 ? styles.active : ""} ${
                isLoading ? styles.disabled : ""
              }`}
            >
              Part 2
            </a>
          </div>

          {isHovering && !isLoading && (
            <div
              className={styles.customTooltip}
              style={{
                left: mousePosition.x,
                top: mousePosition.y,
              }}
            >
              {isPlaying ? "Playing" : "Paused"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FullScreenVideo;
