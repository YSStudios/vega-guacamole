import React from "react";
import LibrarySong from "./LibrarySong";

const Library = ({
  songs,
  setCurrentSong,
  audioRef,
  isPlaying,
  setSongs,
  urlFor,
}) => {
  return (
    <div>
      <div className="library-songs">
        {Array.isArray(songs) && songs.length > 0 ? (
          songs.map((song) => (
            <LibrarySong
              key={song._id}
              song={song}
              songs={songs}
              setCurrentSong={setCurrentSong}
              audioRef={audioRef}
              isPlaying={isPlaying}
              setSongs={setSongs}
              urlFor={urlFor}
            />
          ))
        ) : (
          <p className={styles.no_songs}>No songs available.</p>
        )}
      </div>
    </div>
  );
};

export default Library;
