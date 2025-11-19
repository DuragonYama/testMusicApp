import "./App.css";
import { useMusicMetadata } from "./hooks/useMusicMetadata";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useMediaSession } from "./hooks/useMediaSession";
import { Sidebar } from "./components/Sidebar";
import { SongList } from "./components/SongList";
import { PlaybackBar } from "./components/PlaybackBar";

function App() {
  // List of audio file paths to load
  const audioFiles = [
    "/Music/celebration-lofi.mp3",
    "/Music/happy-lofi.mp3",
    "/Music/im-yours.mp3",
  ];

  // Load metadata from audio files
  const { songs, isLoading } = useMusicMetadata(audioFiles);

  // Audio player controls and state
  const {
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
  } = useAudioPlayer(songs);

  // Media Session API integration
  useMediaSession({
    songs,
    currentIndex,
    audioRef,
    nextTrack,
    previousTrack,
  });

  if (isLoading) {
    return (
      <div className="app-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            color: "var(--spotify-text)",
          }}
        >
          Loading music library...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-content">
        <Sidebar />

        <main className="content-area">
          <div className="content-header">
            <h1 className="content-title">Your Playlist</h1>
            <p className="content-subtitle">{songs.length} songs</p>
          </div>

          <SongList
            songs={songs}
            currentIndex={currentIndex}
            playSong={playSong}
          />
        </main>
      </div>

      <PlaybackBar
        songs={songs}
        currentIndex={currentIndex}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        togglePlayPause={togglePlayPause}
        previousTrack={previousTrack}
        nextTrack={nextTrack}
        seekTo={seekTo}
        changeVolume={changeVolume}
      />

      {/* Hidden audio element */}
      {currentIndex !== null && (
        <audio
          ref={audioRef}
          src={songs[currentIndex].file}
          style={{ display: "none" }}
        />
      )}
    </div>
  );
}

export default App;
