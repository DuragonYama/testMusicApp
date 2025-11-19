import { useEffect } from "react";
import type { Song } from "../types";

interface UseMediaSessionProps {
  songs: Song[];
  currentIndex: number | null;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  nextTrack: () => void;
  previousTrack: () => void;
}

export const useMediaSession = ({
  songs,
  currentIndex,
  audioRef,
  nextTrack,
  previousTrack,
}: UseMediaSessionProps) => {
  // Update Media Session metadata
  const updateMetadata = (index: number) => {
    const song = songs[index];
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        album: song.album,
        artwork: song.artwork
          ? [{ src: song.artwork, sizes: "512x512", type: "image/jpeg" }]
          : [],
      });
    }
  };

  // Set up Media Session action handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("nexttrack", nextTrack);
    navigator.mediaSession.setActionHandler("previoustrack", previousTrack);
    navigator.mediaSession.setActionHandler("play", () => {
      audioRef.current?.play();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      audioRef.current?.pause();
    });
  }, [currentIndex, songs, nextTrack, previousTrack, audioRef]);

  // Media session position updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !("mediaSession" in navigator)) return;

    const updatePosition = () => {
      if (!audio || isNaN(audio.duration) || audio.duration === 0) return;

      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime,
        });
      } catch (e) {
        console.error("Error setting position state:", e);
      }
    };

    const updatePlaybackState = () => {
      if (!audio) return;
      navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
    };

    const events = ["play", "pause", "loadedmetadata", "durationchange"] as const;
    const handlers: { [key: string]: () => void } = {
      play: updatePlaybackState,
      pause: updatePlaybackState,
      loadedmetadata: updatePosition,
      durationchange: updatePosition,
    };

    events.forEach((event) => audio.addEventListener(event, handlers[event]));

    return () => {
      events.forEach((event) =>
        audio.removeEventListener(event, handlers[event])
      );
    };
  }, [currentIndex, audioRef]);

  // Update metadata when song changes
  useEffect(() => {
    if (currentIndex !== null && songs[currentIndex]) {
      updateMetadata(currentIndex);
    }
  }, [currentIndex, songs]);
};
