import { useEffect, useRef, useState } from "react";

function App() {
  const songs = [
    {
      name: "CELEBRATION (LOFI)",
      artist: "Forrest Frank, The Lofi Christian",
      file: "/Music/celebration-lofi.mp3",
      artwork: "/cover.jpg",
    },
    {
      name: "HAPPY (LOFI)",
      artist: "Forrest Frank, The Lofi Christian",
      file: "/Music/happy-lofi.mp3",
      artwork: "/cover.jpg",
    },
    {
      name: "I'm Yours",
      artist: "Lofi Fruits Music, Chill Fruits Music",
      file: "/Music/im-yours.mp3",
      artwork: "/cover.jpg",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to log messages to page + console
  const logDebug = (label: string) => {
    const audio = audioRef.current;
    const msg = `
${label}
SRC: ${audio?.src}
readyState: ${audio?.readyState}
duration: ${audio?.duration}
seekable: ${audio?.seekable.length ? audio.seekable.end(0) : "none"}
paused: ${audio?.paused}
currentTime: ${audio?.currentTime}
-----------------------
`;
    console.log(msg);

    const debugDiv = document.getElementById("debug-log");
    if (debugDiv) debugDiv.textContent += msg;
  };

  // Helper to update Media Session metadata
  const updateMetadata = (index: number) => {
    const song = songs[index];
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.name,
        artist: song.artist,
        artwork: [
          { src: song.artwork, sizes: "512x512", type: "image/jpeg" },
        ],
      });
      logDebug("updateMetadata: " + song.name);
    }
  };

  // Set up Media Session action handlers
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("nexttrack", () => {
      setCurrentIndex((i) => {
        const next = (i! + 1) % songs.length;
        updateMetadata(next);
        return next;
      });
    });

    navigator.mediaSession.setActionHandler("previoustrack", () => {
      setCurrentIndex((i) => {
        const prev = (i! - 1 + songs.length) % songs.length;
        updateMetadata(prev);
        return prev;
      });
    });
  }, []);

  // Media session position updates
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !("mediaSession" in navigator)) return;

    let interval: number | null = null;

    const updatePosition = () => {
      if (!audio || isNaN(audio.duration) || audio.duration === 0) return;

      try {
        navigator.mediaSession.setPositionState({
          duration: audio.duration,
          playbackRate: audio.playbackRate,
          position: audio.currentTime,
        });
        logDebug("updatePosition()");
      } catch (e) {
        console.error("Error setting position state:", e);
      }
    };

    const updatePlaybackState = () => {
      if (!audio) return;
      navigator.mediaSession.playbackState = audio.paused ? "paused" : "playing";
      logDebug("updatePlaybackState()");

      // Start/stop interval depending on play state
      if (!audio.paused) {
        if (!interval) {
          interval = window.setInterval(updatePosition, 500); // update every 0.5s
        }
      } else {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
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
      if (interval) clearInterval(interval);
      events.forEach((event) =>
        audio.removeEventListener(event, handlers[event])
      );
    };
  }, [currentIndex]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎵 Mijn Muziek Player</h1>

      <ul className="space-y-2 mb-6">
        {songs.map((song, i) => (
          <li key={song.file}>
            <button
              onClick={() => {
                setCurrentIndex(i);
                updateMetadata(i); // update metadata immediately on click
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full text-left"
            >
              ▶️ {song.name}
            </button>
          </li>
        ))}
      </ul>

      {currentIndex !== null && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-xl font-semibold mb-2">Now Playing:</h2>
          <audio
            ref={audioRef}
            controls
            autoPlay
            src={songs[currentIndex].file}
            className="w-full"
          />
        </div>
      )}

      {/* Debug log area */}
      {/* <pre
        id="debug-log"
        className="mt-6 bg-gray-200 p-3 rounded text-xs overflow-y-scroll max-h-80 whitespace-pre-wrap"
      ></pre> */}
    </div>
  );
}

export default App;
