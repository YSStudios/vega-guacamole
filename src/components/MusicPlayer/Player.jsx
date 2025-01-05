import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "../../styles/Player.module.scss";
import Library from "./Library";
import { gsap } from "gsap";
import { playAudio } from "./utils";
import { modalValue, togglePlaylistActive } from "../../slices/modalSlice";
import Marquee from "react-fast-marquee";

const Player = ({
  isPlaying,
  setIsPlaying,
  audioRef,
  songInfo,
  setSongInfo,
  currentSong,
  songs,
  setCurrentSong,
  setSongs,
  songData,
  urlFor,
  isMobile,
}) => {
  const active = useSelector(modalValue);
  const dispatch = useDispatch();
  const playerRef = useRef(null);
  const imageRef = useRef(null);
  const rotationTween = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      rotationTween.current = gsap.to(imageRef.current, {
        rotation: "+=360",
        duration: 5,
        ease: "none",
        repeat: -1,
      });
    } else {
      if (rotationTween.current) {
        rotationTween.current.pause();
      }
    }

    return () => {
      if (rotationTween.current) {
        rotationTween.current.kill();
      }
    };
  }, [isPlaying]);

  // console.log("Current Song:", currentSong);
  // console.log("Songs:", songs);
  // console.log("Song Data:", songData);

  const activeLibraryHandler = (nextPrev) => {
    const newSongs = Array.isArray(songs)
      ? songs.map((song) => {
          if (song._id === nextPrev._id) {
            return {
              ...song,
              active: true,
            };
          } else {
            return {
              ...song,
              active: false,
            };
          }
        })
      : [];

    setSongs(newSongs);
  };

  const trackAnim = {
    transform: `translateX(${songInfo.animationPercentage}%)`,
  };

  // Event Handlers
  function getTime(time) {
    return (
      Math.floor(time / 60) + ":" + ("0" + Math.floor(time % 60)).slice(-2)
    );
  }

  const dragHandler = (e) => {
    audioRef.current.currentTime = e.target.value;
    setSongInfo({ ...songInfo, currentTime: e.target.value });
  };

  const playSongHandler = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrackHandler = async (direction) => {
    if (!Array.isArray(songs)) {
      return;
    }

    let currentIndex = songs.findIndex((song) => song._id === currentSong._id);

    // Forward Back
    if (direction === "skip-forward") {
      await setCurrentSong(songs[(currentIndex + 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex + 1) % songs.length]);
    }
    if (direction === "skip-back") {
      if ((currentIndex - 1) % songs.length === -1) {
        await setCurrentSong(songs[songs.length - 1]);
        activeLibraryHandler(songs[songs.length - 1]);
        playAudio(isPlaying, audioRef);
        return;
      }
      await setCurrentSong(songs[(currentIndex - 1) % songs.length]);
      activeLibraryHandler(songs[(currentIndex - 1) % songs.length]);
    }
    if (isPlaying) {
      try {
        await audioRef.current.play();
      } catch (error) {
        // console.error("Failed to play audio:", error);
      }
    }
  };

  const changeVolume = (e) => {
    let value = e.target.value;
    audioRef.current.volume = value;
    setSongInfo({ ...songInfo, volume: value });
  };

  const songSelectHandler = () => {
    const selectedSong = songs.filter((state) => state._id === song._id);
    setCurrentSong({ ...selectedSong[0] });
    // Set Active in library
    const newSongs = songs.map((song) => {
      if (song._id === _id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);

    // Play audio
    playAudio(isPlaying, audioRef);
  };

  const handlePlaylistToggle = () => {
    dispatch(togglePlaylistActive());
    if (active.playlistActive === true) {
      gsap.fromTo(
        playerRef.current,
        {
          ease: "circ",
          height: "0rem",
          x: "0",
          y: "0",
        },
        {
          duration: 0.05,
          ease: "circ",
          height: "14rem",
          x: "0",
          y: "0",
        }
      );
    } else {
      gsap.to(playerRef.current, {
        duration: 0.05,
        ease: "circ",
        height: "0em",
        x: "0",
        y: "0",
      });
    }
  };

  return (
    <>
      <div className={`${styles.player}`}>
        <div className={styles.track_info_container}>
          {!isMobile && (
            <div className={styles.artist_image}>
              {currentSong?.cover?.asset?._ref && (
                <img
                  className={styles.artist_image}
                  src={urlFor(currentSong.cover.asset._ref)
                    .width(50)
                    .height(50)
                    .fit("crop")
                    .url()}
                  alt={currentSong?.name}
                />
              )}
            </div>
          )}
          {isMobile ? (
            <Marquee speed={50}>
              <div className={styles.track_info}>
                <span className={styles.artist_name}>
                  {currentSong?.artist} -
                </span>
                <span className={styles.track_name}>{currentSong?.name}</span>
              </div>
            </Marquee>
          ) : (
            <div className={styles.track_info}>
              <span className={styles.artist_name}>{currentSong?.artist}</span>
              <Marquee
                pauseOnHover={true}
                speed={25}
                className={styles.track_container}
              >
                <span className={styles.track_name}>{currentSong?.name}</span>
              </Marquee>
            </div>
          )}
        </div>
        <div className={styles.time_control}>
          <div
            style={{
              background:
                currentSong?.color && currentSong.color.length >= 2
                  ? `linear-gradient(to right, ${currentSong.color[0].hex}, ${currentSong.color[1].hex})`
                  : "none",
            }}
            className={styles.track}
          >
            <input
              className={styles.progressBar}
              min={0}
              max={songInfo.duration || 0}
              value={songInfo.currentTime}
              onChange={dragHandler}
              type="range"
            />
            <div style={trackAnim} className={styles.animate_track}></div>
          </div>
          <span className={styles.track_time}>
            {getTime(songInfo.currentTime)}
          </span>
        </div>
        <div className={styles.play_control}>
          <button
            onClick={() => skipTrackHandler("skip-back")}
            className={styles.skip_back}
          />

          {!isMobile && (
            <>
              {isPlaying ? (
                <button onClick={playSongHandler} className={styles.pause} />
              ) : (
                <button onClick={playSongHandler} className={styles.play} />
              )}
            </>
          )}

          {isMobile && (
            <div
              className={`${styles.artist_image} ${
                isPlaying ? styles.pause : styles.play
              }`}
              onClick={playSongHandler}
            >
              {currentSong?.cover?.asset?._ref && (
                <img
                  ref={imageRef}
                  className={styles.artist_image}
                  src={urlFor(currentSong.cover.asset._ref)
                    .width(50)
                    .height(50)
                    .fit("crop")
                    .url()}
                  alt={currentSong?.name}
                />
              )}
            </div>
          )}
          <button
            onClick={() => skipTrackHandler("skip-forward")}
            className={styles.skip_forward}
          />
        </div>
        <div className={styles.volumeContainer}>
          {/* <div className={styles.volumeSlider}>
			<input
			  onChange={changeVolume}
			  value={songInfo.volume}
			  max="1"
			  min="0"
			  step="0.01"
			  type="range"
			/>
		  </div> */}
        </div>
        <div
          className={
            active.playlistActive
              ? `${styles.playlist} `
              : `${styles.playlist_hidden}`
          }
          ref={playerRef}
        >
          <Library
            songs={songs}
            setCurrentSong={setCurrentSong}
            audioRef={audioRef}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            setSongs={setSongs}
            songData={songData}
            urlFor={urlFor}
          />
        </div>
      </div>
      <div
        className={styles.playlist_button}
        onClick={() => dispatch(togglePlaylistActive())}
      >
        playlist
      </div>
    </>
  );
};

export default Player;
