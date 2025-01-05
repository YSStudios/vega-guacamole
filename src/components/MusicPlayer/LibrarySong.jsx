import React from "react";
import { playAudio } from "./utils";
import styles from "../../styles/LibrarySong.module.scss";

const LibrarySong = ({
  song,
  songs,
  setCurrentSong,
  audioRef,
  setSongs,
  urlFor,
  isPlaying,
  setIsPlaying,
}) => {
  const songSelectHandler = async () => {
    await setCurrentSong(song);
    // Set Active in library
    const newSongs = songs.map((s) => ({
      ...s,
      active: s._id === song._id,
    }));
    setSongs(newSongs);

    // Set isPlaying to true and play the song
    setIsPlaying(true);
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        audioRef.current.play();
      });
    }
  };

  if (!song) {
    return null; // or some fallback UI
  }

  return (
    <div
      onClick={songSelectHandler}
      className={`${styles.playlist_container} ${
        song.active ? styles.active : ""
      }`}
    >
      <img
        className={styles.artist_image}
        src={urlFor(song.cover.asset._ref)
          .width(50)
          .height(50)
          .fit("crop")
          .url()}
        alt={song.artist}
      />
      <div className={styles.span_container}>
        <span className={styles.playlist_span}>{song.artist} -</span>
        <span className={styles.playlist_span}>{song.name}</span>
      </div>
    </div>
  );
};

export default LibrarySong;
