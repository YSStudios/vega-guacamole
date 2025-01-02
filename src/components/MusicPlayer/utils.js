export const playAudio = async (isPlaying, audioRef) => {
  if (isPlaying && audioRef.current) {
    try {
      // Resume audio context if it was suspended
      if (
        audioRef.current.context &&
        audioRef.current.context.state === "suspended"
      ) {
        await audioRef.current.context.resume();
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }
};
