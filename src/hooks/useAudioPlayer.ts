import { useEffect, useRef, useState } from "react";
import type { Song } from "../types";

interface UseAudioPlayerReturn {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentIndex: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playSong: (index: number) => void;
  togglePlayPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (e: React.MouseEvent<HTMLDivElement>) => void;
  changeVolume: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const useAudioPlayer = (songs: Song[]): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // Play/Pause toggle
  const togglePlayPause = () => {
    if (!audioRef.current || currentIndex === null) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  // Play specific song
  const playSong = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  // Next track
  const nextTrack = () => {
    if (currentIndex === null || songs.length === 0) return;
    const next = (currentIndex + 1) % songs.length;
    playSong(next);
  };

  // Previous track
  const previousTrack = () => {
    if (currentIndex === null || songs.length === 0) return;
    const prev = (currentIndex - 1 + songs.length) % songs.length;
    playSong(prev);
  };

  // Seek to position
  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = percent * duration;
  };

  // Change volume
  const changeVolume = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex, songs]);

  // Auto-play when song changes
  useEffect(() => {
    if (currentIndex !== null && audioRef.current) {
      audioRef.current.play().catch((e) => {
        console.error("Auto-play failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentIndex]);

  return {
    audioRef,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    playSong,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    changeVolume,
  };
};
