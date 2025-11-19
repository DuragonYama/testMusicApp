import type { Song } from "../types";
import { formatTime } from "../utils/formatTime";

interface SongListProps {
  songs: Song[];
  currentIndex: number | null;
  playSong: (index: number) => void;
}

export const SongList = ({ songs, currentIndex, playSong }: SongListProps) => {
  return (
    <div className="song-list">
      <div className="song-list-header">
        <div>#</div>
        <div>Title</div>
        <div>Album</div>
        <div>Duration</div>
      </div>

      {songs.map((song, i) => (
        <div
          key={song.file}
          className={`song-item ${currentIndex === i ? "active" : ""}`}
          onClick={() => playSong(i)}
        >
          <div>
            <div className="song-number">{i + 1}</div>
            <div className="play-icon">▶</div>
          </div>

          <div className="song-info">
            {song.artwork && (
              <img
                src={song.artwork}
                alt={song.name}
                className="song-artwork"
              />
            )}
            <div className="song-details">
              <div className="song-name">{song.name}</div>
              <div className="song-artist">{song.artist}</div>
            </div>
          </div>

          <div className="song-album">{song.album}</div>
          <div className="song-duration">{formatTime(song.duration)}</div>
        </div>
      ))}
    </div>
  );
};
