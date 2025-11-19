import { useEffect, useState } from "react";
import { parseBlob } from "music-metadata";
import type { Song } from "../types";

export const useMusicMetadata = (audioFiles: string[]) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMetadata = async () => {
      setIsLoading(true);
      const loadedSongs: Song[] = [];

      for (const filePath of audioFiles) {
        try {
          // Fetch the audio file
          const response = await fetch(filePath);
          const blob = await response.blob();

          // Parse metadata
          const metadata = await parseBlob(blob);

          // Extract album artwork if available
          let artworkUrl: string | undefined;
          if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const blob = new Blob([picture.data.buffer as ArrayBuffer], { type: picture.format });
            artworkUrl = URL.createObjectURL(blob);
          }

          // Create song object from metadata
          const song: Song = {
            name: metadata.common.title || filePath.split("/").pop() || "Unknown",
            artist: metadata.common.artist || "Unknown Artist",
            album: metadata.common.album || "Unknown Album",
            file: filePath,
            artwork: artworkUrl,
            duration: metadata.format.duration || 0,
          };

          loadedSongs.push(song);
        } catch (error) {
          console.error(`Error loading metadata for ${filePath}:`, error);
          // Add song with default values if metadata extraction fails
          loadedSongs.push({
            name: filePath.split("/").pop() || "Unknown",
            artist: "Unknown Artist",
            album: "Unknown Album",
            file: filePath,
            duration: 0,
          });
        }
      }

      if (isMounted) {
        setSongs(loadedSongs);
        setIsLoading(false);
      }
    };

    loadMetadata();

    // Cleanup: revoke object URLs when component unmounts
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { songs, isLoading };
};
