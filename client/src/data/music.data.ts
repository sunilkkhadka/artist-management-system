import { Music } from "../types/music.type";

export const initialMusicData: Music = {
  id: "",
  artist_name: "",
  title: "",
  album_name: "",
  genre: "",
};

export const getInitialMusicData = (music: Music | undefined): Music => {
  return {
    id: music?.id || "",
    artist_name: music?.artist_name || "",
    title: music?.title || "",
    album_name: music?.album_name || "",
    genre: music?.genre || "",
  };
};

export const genres = [
  {
    label: "MB",
    value: "mb",
  },
  {
    label: "Country",
    value: "country",
  },
  {
    label: "Classic",
    value: "classic",
  },
  {
    label: "Rock",
    value: "rock",
  },
  {
    label: "Jazz",
    value: "jazz",
  },
];
