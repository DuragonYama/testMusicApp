import type { Song } from "../types";
import { formatTime } from "../utils/formatTime";

interface PlaybackBarProps {
  songs: Song[];
  currentIndex: number | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  togglePlayPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  seekTo: (e: React.MouseEvent<HTMLDivElement>) => void;
  changeVolume: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const PlaybackBar = ({
  songs,
  currentIndex,
  isPlaying,
  currentTime,
  duration,
  volume,
  togglePlayPause,
  previousTrack,
  nextTrack,
  seekTo,
  changeVolume,
}: PlaybackBarProps) => {
  return (
    <div className="playback-bar">
      {/* Left: Current track info */}
      <div className="playback-left">
        {currentIndex !== null && (
          <>
            {songs[currentIndex].artwork && (
              <img
                src={songs[currentIndex].artwork}
                alt={songs[currentIndex].name}
                className="playback-artwork"
              />
            )}
            <div className="playback-info">
              <div className="playback-song-name">
                {songs[currentIndex].name}
              </div>
              <div className="playback-artist">
                {songs[currentIndex].artist}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Center: Playback controls */}
      <div className="playback-center">
        <div className="playback-controls">
          <button className="control-button" onClick={previousTrack}>
            ⏮
          </button>
          <button
            className="control-button play-button"
            onClick={togglePlayPause}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="control-button" onClick={nextTrack}>
            ⏭
          </button>
        </div>

        {/* Progress bar */}
        <div className="progress-container">
          <span className="progress-time">{formatTime(currentTime)}</span>
          <div className="progress-bar" onClick={seekTo}>
            <div
              className="progress-fill"
              style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
            />
          </div>
          <span className="progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Volume control */}
      <div className="playback-right">
        <div className="volume-container">
          <button className="control-button">
            {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>
          <div className="volume-bar" onClick={changeVolume}>
            <div
              className="volume-fill"
              style={{ width: `${volume * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
